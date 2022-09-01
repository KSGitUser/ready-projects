<template>
  <q-page class="constrain q-pa-md">

    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-if="showNotificationBanner && pushNotificationsSupported" class="banner-container bg-primary">
        <div class="constrain">
          <q-banner
            class="bg-grey-3 q-mb-md">
            <template v-slot:avatar>
              <q-icon name="eva-bell-outline" color="primary" />
            </template>
            Would you like to enable notifications?
            <template v-slot:action>
              <q-btn
                flat
                label="Yes"
                color="primary"
                dense
                class="q-px-sm"
                @click="enableNotifications"
              />
              <q-btn
                flat
                label="Later"
                color="primary"
                dense
                class="q-px-sm"
                @click="showNotificationBanner = false"
              />
              <q-btn
                flat
                label="Never"
                color="primary"
                dense
                class="q-px-sm"
                @click="neverShowNotificationsBanner"
              />
            </template>
          </q-banner>
        </div>
      </div>
    </transition>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-sm-8">
        <template v-if="!loadingPosts && posts.length">
          <q-card
            v-for="post in posts"
            :key="post.id"
            class="card-post q-mb-md"
            :class="{ 'bg-red-1' : post.offline }"
            flat
            bordered
          >
            <q-badge
              v-if="post.offline"
              color="red"
              class="badge-offline absolute-top-right"
            >
              Stored offline
            </q-badge>
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://2.gravatar.com/avatar/06fa0c232f2f7fce058757346bd0b701=80" alt="user avatar">
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-bold">Sergey Krikun</q-item-label>
                <q-item-label caption>
                  {{ post.location }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-img
              :src="post.imageUrl"
            />

            <q-card-section>
              <div> {{ post.caption }}</div>
              <div class="text-caption text-grey">{{ post.date | niceDate}}</div>
            </q-card-section>
          </q-card>
        </template>
        <template v-else-if="!loadingPosts && !posts.length">
          <h5 class="text-center text-grey">No posts yet.</h5>
        </template>
        <template v-else>
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar>
                <q-skeleton type="QAvatar" animation="fade" size="40px" />
              </q-item-section>

              <q-item-section>
                <q-item-label>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
                <q-item-label caption>
                  <q-skeleton type="text" animation="fade" />
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-skeleton height="200px" square animation="fade" />

            <q-card-section>
              <q-skeleton type="text" class="text-subtitle2" animation="fade" />
              <q-skeleton type="text" width="50%" class="text-subtitle2" animation="fade" />
            </q-card-section>
          </q-card>
        </template>
      </div>
      <div class="col-4 large-screen-only">
        <q-item class="fixed">
          <q-item-section avatar>
            <q-avatar size="48px">
              <img src="https://2.gravatar.com/avatar/06fa0c232f2f7fce058757346bd0b701=80" alt="user avatar">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-bold">SergeyKrikun</q-item-label>
            <q-item-label caption>
              Sergey Krikun
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>

  </q-page>
</template>

<script>
import { date } from 'quasar';
import { openDB } from 'idb';

export default {
  name: 'PageHome',
   data() {
    return {
      posts: [],
      loadingPosts: false,
      showNotificationBanner: false,
    }
   },
  computed: {
    serviceWorkerSupported() {
      return 'serviceWorker' in navigator;
    },
    pushNotificationsSupported() {
      return 'PushManager' in window
    }
  },
  methods: {
    async getOfflinePosts() {
      try{
        const db = await openDB('workbox-background-sync')
        const offlinePostsRequests = await db.getAll('requests')
        offlinePostsRequests.forEach(offlinePostRequest => {
          if (offlinePostRequest.queueName === 'createPostQueue') {
            const newRequest = new Request(offlinePostRequest.requestData.url, offlinePostRequest.requestData)
            newRequest.formData().then(formData => {
              const offlinePost = {}
              offlinePost.id = formData.get('id')
              offlinePost.caption = formData.get('caption')
              offlinePost.location = formData.get('location')
              offlinePost.date = parseInt(formData.get('date'))
              offlinePost.offline = true

              const reader = new FileReader()
              reader.readAsDataURL(formData.get('file'))
              reader.onloadend = () => {
                offlinePost.imageUrl = reader.result
                this.posts.unshift(offlinePost)
              }
            })
          }
        })
      } catch (e) {
        console.error('getOfflinePosts error', e)
      }
    },
    async getPosts() {
      try {
         this.loadingPosts = true;
        ({ data: this.posts  }= await this.$axios.get(`${process.env.API}/posts`));
        if (!navigator.onLine) {
          this.getOfflinePosts();
        }
      } catch(e) {
        this.$q.dialog({
          title: 'Error',
          message: 'Could not download posts'
        });
        console.error(e)
      } finally {
        this.loadingPosts = false;
      }

    },
    onServerWorkerMessage(event) {
      if (event?.data?.msg === 'offline-post-uploaded') {
        const offlinePostCount = this.posts.filter(post => post.offline).length
        this.posts[offlinePostCount -1].offline = false
      }
    },
    listenForOfflinePostUploaded() {
      if (this.serviceWorkerSupported) {
        const channel = new BroadcastChannel('sw-messages');
        channel.addEventListener('message', this.onServerWorkerMessage);
      }
    },
    async enableNotifications() {
      if (!this.pushNotificationsSupported) {
        return;
      }

      const notificationsPermission = await Notification.requestPermission();
      this.neverShowNotificationsBanner();
      if (notificationsPermission === 'granted') {
        this.displayGrantedNotification();
      }
    },
    neverShowNotificationsBanner() {
      this.showNotificationBanner = false
      this.$q.localStorage.set('neverShowNotificationsBanner', true)
    },
    initNotificationsBanner() {
      const neverShowNotificationBanner  = this.$q.localStorage.getItem('neverShowNotificationsBanner')

      if (!neverShowNotificationBanner) {
        this.showNotificationBanner = true;
      }
    },
    async displayGrantedNotification() {
      let notificationConfig = {
        body: 'Thanks for subscribing!',
        icon: '/icons/icon-128x128.png',
        image: '/icons/icon-128x128.png',
        badge: '/icons/icon-128x128.png',
        actions: [
          {
            action: 'hello',
            title: 'Hello',
            icon: '/icons/icon-128x128.png'
          },
          {
            action: 'goodbye',
            title: 'Goodbye',
            icon: '/icons/icon-128x128.png'
          },
        ]
      }

      if (!(this.$q.platform?.is.ios || this.$q.platform?.is.mac)) {
        notificationConfig = { ...notificationConfig, ...{
          renotify: true,
          tag: 'confirm-notification',
          vibrate: [100, 50, 200],
          actions: [
            {
              action: 'hello',
              title: 'Hello',
              icon: '/icons/icon-128x128.png'
            },
            {
              action: 'goodbye',
              title: 'Goodbye',
              icon: '/icons/icon-128x128.png'
            },
          ]
        }}
      }
      // new Notification("You're subscribed to notifications!", notificationConfig)

      if (this.serviceWorkerSupported && this.pushNotificationsSupported) {
        const swReg = await navigator.serviceWorker.ready;
        swReg.showNotification(
          "You're subscribed to notifications!",
          notificationConfig
        )
      }
    }
  },
  activated() {
    this.getPosts();
  },
  created() {
    this.listenForOfflinePostUploaded()
  },
  mounted() {
    this.initNotificationsBanner()
  },
  filters: {
    niceDate(initialValue) {
      return date.formatDate(initialValue, 'MMMM D h:mmA');
    }
  }
}
</script>

<slyle lang="scss">
  .card-post {
    .badge-offline {
      border-top-left-radius: 0 !important;
    }

    .q-img {
      aspect-ratio: 9 / 6;
    }
  }
</slyle>
