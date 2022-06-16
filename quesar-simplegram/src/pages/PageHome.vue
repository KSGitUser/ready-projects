<template>
  <q-page class="constrain q-pa-md">

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
    }
   },
  computed: {
    serviceWorkerSupported() {
      return 'serviceWorker' in navigator;
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
    }
  },
  activated() {
    this.getPosts();
  },
  created() {
    this.listenForOfflinePostUploaded()
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
