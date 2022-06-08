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


/*
  config
 */

  precacheAndRoute(self.__WB_MANIFEST)


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
    ({url}) => url.pathname.startsWith('/posts'),
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

