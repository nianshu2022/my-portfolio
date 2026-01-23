// 使用版本号管理缓存，部署时可手动或自动修改此值
const CACHE_VERSION = 'v2';
const CACHE_NAME = `nianshu-blog-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 清理旧版本的缓存
                    if (cacheName.startsWith('nianshu-blog-') && cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse.status === 404) {
                        if (cachedResponse) {
                            caches.open(CACHE_NAME).then(cache => cache.delete(event.request));
                        }
                        return networkResponse;
                    }

                    if (networkResponse.ok && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                })
                .catch((err) => {
                    console.error('[SW] Fetch Error:', err);
                    return cachedResponse || new Response('Error', { status: 503 });
                });

            // 如果有缓存，立即返回缓存并在后台更新
            if (cachedResponse) {
                // Background update
                if (event.waitUntil) {
                    event.waitUntil(fetchPromise);
                }
                return cachedResponse;
            }

            // 没缓存则等待网络结果
            return fetchPromise;
        })
    );
});
