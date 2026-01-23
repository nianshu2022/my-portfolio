const CACHE_NAME = 'nianshu-blog-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
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

    // 仅处理 http/https 协议
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // 检查响应是否有效
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // 网络错误时，如果已经有缓存则不抛错，否则返回错误响应
                if (!cachedResponse) {
                    return new Response('Network error occurred', {
                        status: 408,
                        statusText: 'Network Timeout'
                    });
                }
            });

            // Stale-While-Revalidate: 有缓存先给缓存，后台同步抓取新版
            return cachedResponse || fetchPromise;
        })
    );
});
