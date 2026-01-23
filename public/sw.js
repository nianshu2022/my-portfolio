// Minimal Service Worker to prevent 404 errors
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', () => {
});

self.addEventListener('fetch', () => {
    // Default pass-through
});
