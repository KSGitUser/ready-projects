/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

/*
  dependencies
 */

  import { precacheAndRoute } from 'workbox-precaching'
  import {registerRoute} from 'workbox-routing';
  import {StaleWhileRevalidate} from 'workbox-strategies';
  import {CacheFirst} from 'workbox-strategies';
  import {ExpirationPlugin} from 'workbox-expiration';
  import {CacheableResponsePlugin} from 'workbox-cacheable-response';
  import {NetworkFirst} from 'workbox-strategies';
  import {plugins} from "app/.postcssrc";
  import {Queue} from 'workbox-background-sync';

/*
  config
 */

  precacheAndRoute(self.__WB_MANIFEST)

  let backgroundSyncSupport = 'sync' in self.registration

/*
  queue - createPost
*/

  let createPostQueue = null

  if (backgroundSyncSupport) {
    createPostQueue = new Queue('createPostQueue', {
      onSync: async ({queue}) => {
        let entry;
        while (entry = await queue.shiftRequest()) {
          try {
            await fetch(entry.request);
            const channel = new BroadcastChannel('sw-messages');
            channel.postMessage({msg: 'offline-post-uploaded'});
          } catch (error) {
            console.error('Replay failed for request', entry.request, error);

            // Put the entry back in the queue and re-throw the error:
            await queue.unshiftRequest(entry);
            throw error;
          }
        }
      }
    });
  }

/*
  caching strategies
 */

  // set up only for fonts files
  registerRoute(({request, url}) => request.destination === 'font' ||
      url.host.startsWith('fonts.g'),
    new CacheFirst({
      cacheName: 'google-fonts',
      plugins: [
        new ExpirationPlugin({
          maxEntries: 30,
        }),
        new CacheableResponsePlugin({
          statuses: [0, 200]
        })
      ]
    })
  );

  registerRoute(
    ({url}) =>  {
      return url.pathname.startsWith('/posts')
    },
    new NetworkFirst({
      cacheName: 'Network-First',
    })
  );

  registerRoute(
    ({url}) => url.href.startsWith('http'),
    new StaleWhileRevalidate({
        cacheName: 'Stale-While',
      }
    )
  );

/*
  events - fetch
 */

if (backgroundSyncSupport) {
  self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'POST') {
      return;
    }

    const bgSyncLogic = async () => {
      try {
        const response = await fetch(event.request.clone());
        return response;
      } catch (error) {
        return await createPostQueue.pushRequest({request: event.request});
      }
    };

    event.waitUntil(bgSyncLogic());

  })

}




