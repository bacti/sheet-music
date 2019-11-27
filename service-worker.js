importScripts('./cache-polyfill.js')
const cacheName = 'cache-v4'

self.addEventListener('install', event =>
{
    console.info('Event: Install')
    event.waitUntil
    (
        caches.open(cacheName)
        .then(cache =>
        {
            return (
                cache.addAll(files)
                .then(evt =>
                {
                    console.info('All files are cached')
                    return self.skipWaiting() //To forces the waiting service worker to become the active service worker
                })
                .catch(error => console.error('Failed to cache', error))
            )
        })
    )
})

self.addEventListener('fetch', event =>
{
    const { request } = event
    console.info('Event: Fetch', request.url)
    event.respondWith
    (
        caches.match(request).then(response =>
        {
            if (response)
                return response

            // if (event.preloadResponse)
            // {
            //     console.info('Using navigation preload')
            //     return response
            // }

            return (
                fetch(request)
                .then(response =>
                {
                    const responseToCache = response.clone()
                    caches.open(cacheName)
                    .then(cache =>
                    {
                        cache.put(request, responseToCache)
                        .catch(err => console.warn(request.url + ': ' + err.message))
                    })
                    return response
                })
                .catch(error => console.warn(request.url + ': ' + error.message))
            )
        })
    )
})

// ACTIVATE EVENT: triggered once after registering, also used to clean up caches.
self.addEventListener('activate', event =>
{
    //Navigation preload is help us make parallel request while service worker is booting up.
    //Enable - chrome://flags/#enable-service-worker-navigation-preload
    //Support - Chrome 57 beta (behing the flag)
    //More info - https://developers.google.com/web/updates/2017/02/navigation-preload#the-problem

    // Check if navigationPreload is supported or not
    // if (self.registration.navigationPreload) { 
    //     self.registration.navigationPreload.enable()
    // }
    // else if (!self.registration.navigationPreload) { 
    //     console.info('Your browser does not support navigation preload.')
    // }

    console.info('Event: Activate')
    event.waitUntil
    (
        caches.keys()
        .then(cacheNames => Promise.all
        (
            cacheNames.map(cache =>
            {
                if (cache !== cacheName)
                {
                    return caches.delete(cache)
                }
            })
        ))
        .then(evt =>
        {
            console.info('Old caches are cleared!')
            // To tell the service worker to activate current one 
            // instead of waiting for the old one to finish.
            return self.clients.claim() 
        }) 
    )
})

// PUSH EVENT: triggered everytime, when a push notification is received.
self.addEventListener('push', event =>
{
    console.info('Event: Push')
    const title = 'Push notification demo'
    const body =
    {
        'body': 'click to return to application',
        'tag': 'demo',
        'icon': './images/icons/apple-touch-icon.png',
        'badge': './images/icons/apple-touch-icon.png',
        'actions':
        [
            { 'action': 'yes', 'title': 'I ♥ this app!' },
            { 'action': 'no', 'title': 'I don\'t like this app' },
        ]
    }
    event.waitUntil(self.registration.showNotification(title, body))
})

// BACKGROUND SYNC EVENT: triggers after `bg sync` registration and page has network connection.
// It will try and fetch github username, if its fulfills then sync is complete. If it fails,
// another sync is scheduled to retry (will will also waits for network connection)
self.addEventListener('sync', event =>
{
    console.info('Event: Sync')
    event.waitUntil
    (
        self.clients.matchAll()
        .then(clients => clients.map(client => client.postMessage('online')))
        .catch(error => console.error(error))
    )
})

// NOTIFICATION EVENT: triggered when user click the notification.
self.addEventListener('notificationclick', event => console.info('Event: NotificationClick'))
