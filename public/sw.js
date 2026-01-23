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
                // 如果后端返回 404，说明文件可能已经因为版本更新而变更了路径（Hash 变了）
                if (networkResponse.status === 404) {
                    // 如果缓存中有这个“已不存在”的文件，立即清理它
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
            }).catch(() => {
                // 网络彻底断开时回退到缓存
                return cachedResponse;
            });

            // SWR 策略：优先返回缓存，后台异步同步最新资源
            // 但如果缓存已知会导致 404 (JS chunk)，这里可以根据后缀做特殊处理，但目前通用 SWR 已能缓解大部分问题
            return cachedResponse || fetchPromise;
        })
    );
});
