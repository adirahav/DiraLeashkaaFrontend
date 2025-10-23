// service-worker.js

const CACHE_NAME = 'diraleaskaa-cache-v1'

// קבצים קבועים שאנחנו יודעים שיהיו תמיד
const STATIC_ASSETS = [
  '/',               // index.html
  '/favicon.ico',
  '/manifest.json',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png',
]

// פונקציית עזר לשמירה בקאש
async function cachePut(request, response) {
  try {
    const cache = await caches.open(CACHE_NAME)
    await cache.put(request, response)
  } catch (err) {
    console.error('[SW] Failed to cache resource:', request.url, err)
  }
}

// Install: שמירת הקבצים הקבועים
self.addEventListener('install', event => {
  console.log('[SW] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate: ניקוי קאש ישן
self.addEventListener('activate', event => {
  console.log('[SW] Activating...')
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key)
            return caches.delete(key)
          }
        })
      )
    )
  )
  self.clients.claim()
})

// Fetch: טיפול בבקשות API וקבצים סטטיים
self.addEventListener('fetch', event => {
  const { request } = event

  // התעלמות מבקשות לא רלוונטיות (chrome-extension, data:, וכו’)
  if (!request.url.startsWith('http')) return

  // --- API / BACKEND ---
  if (request.url.startsWith('https://diraleashkaa.onrender.com')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const resClone = response.clone()
          cachePut(request, resClone)
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // --- קבצים סטטיים ---
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // console.log('[SW] Cache hit:', request.url)
        return cached
      }

      return fetch(request)
        .then(response => {
          // רק אם הבקשה הצליחה ויש סטטוס תקין
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          const resClone = response.clone()

          // שמירה בקאש אם זה קובץ סטטי
          if (request.url.match(/\.(js|css|png|jpg|svg|ico|json)$/)) {
            cachePut(request, resClone)
          }

          return response
        })
        .catch(() => {
          // Fallback אופליין
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/')
          }
        })
    })
  )
})

