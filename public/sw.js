// 使用版本号管理缓存，部署时可手动或自动修改此值
const CACHE_VERSION = 'v4';
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

    // 静态资源缓存策略：CacheFirst (优先读取缓存，不更新)
    // 适用于：图片、Next.js 静态资源、字体等带指纹或不常变的文件
    const isStaticAsset =
        url.pathname.startsWith('/img/') ||
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff2?)(\?.*)?$/i);

    if (isStaticAsset) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(event.request).then((networkResponse) => {
                        if (networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // 其他资源（HTML、Data）：StaleWhileRevalidate (优先显示缓存，后台更新)
    // 确保用户看到内容，同时获取最新版
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request)
                .then((networkResponse) => {
                    // 处理 404
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

            // 如果有缓存，立即返回缓存
            if (cachedResponse) {
                // Background update for next visit
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
