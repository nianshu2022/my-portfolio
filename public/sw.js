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
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // 如果后端返回 404，说明文件可能已经因为版本更新而变更了路径
                if (networkResponse.status === 404) {
                    if (cachedResponse) {
                        caches.open(CACHE_NAME).then(cache => cache.delete(event.request));
                    }
                    return networkResponse;
                }

                // 正常响应则存入缓存
                if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch((error) => {
                console.error('Fetch failed in SW:', error);

                // 重点修复：如果 fetch 失败且没有缓存，必须返回一个 Response 对象，而不是让 Promise Reject
                if (cachedResponse) {
                    return cachedResponse;
                }

                // 返回一个自定义的错误响应，避免 SW 崩溃引发后续 React 错误
                return new Response('Network or Security Error', {
                    status: 408,
                    statusText: 'Network Timeout or Security Block'
                });
            });

            // SWR 策略
            return cachedResponse || fetchPromise;
        })
    );
});
