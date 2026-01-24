// 使用版本号管理缓存，部署时可手动或自动修改此值
const CACHE_VERSION = 'v6';
const CACHE_NAME = `nianshu-blog-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
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

    const isPrefetch =
        event.request.headers.get('Purpose') === 'prefetch' ||
        event.request.headers.get('Sec-Purpose') === 'prefetch' ||
        event.request.headers.get('Next-Router-Prefetch') === '1';

    // 识别静态资源缓存策略：CacheFirst
    // 增加对 wsrv.nl (图片代理) 和 _next/image (Next.js 图片优化) 的缓存支持
    const isStaticAsset =
        url.hostname === 'wsrv.nl' ||
        url.pathname.startsWith('/_next/image') ||
        url.pathname.startsWith('/img/') ||
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff2?|json|txt|webp)(\?.*)?$/i);

    if (isStaticAsset) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;

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

    // 页面 HTML 和 数据请求：NetworkFirst
    // 优先从网络获取，失败或超时则回退到预览版/缓存，确保 Hydration 一致性
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse.ok && !isPrefetch) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    return new Response('Offline', { status: 503 });
                });
            })
    );
});
