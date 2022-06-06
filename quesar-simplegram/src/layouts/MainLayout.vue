<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      class="bg-white text-grey-10"
      bordered
    >
      <q-toolbar class="constrain">
        <q-btn
          flat
          round
          dense
          to="/camera"
          icon="eva-camera-outline q-mr-sm"
          class="large-screen-only"
          size="1.8rem"
        />
        <q-separator vertical spaced class="large-screen-only"/>
        <q-toolbar-title
          class="text-grand-hotel text-bold"
        >
          Quasar Simplegram
        </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          to="/"
          icon="eva-home-outline"
          class="large-screen-only"
          size="1.8rem"
        />
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white" bordered>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-if="showAppInstallBanner" class="banner-container bg-primary">
          <div class="constrain">
            <q-banner
              inline-actions
              dense
              class="bg-primary text-white">
              <template v-slot:avatar>
                <q-avatar icon="eva-camera-outline" color="white" text-color="grey-10" font-size="22px"/>
              </template>
              <b>Install Simplegram?</b>
              <template v-slot:action>
                <q-btn
                  flat
                  label="Yes"
                  dense
                  class="q-px-sm"
                  @click="installApp"
                />
                <q-btn
                  flat
                  label="Later"
                  dense
                  class="q-px-sm"
                  @click="showAppInstallBanner = false"
                />
                <q-btn
                  flat
                  label="Never"
                  dense
                  class="q-px-sm"
                  @click="neverShowAppInstallBanner"
                />
              </template>
            </q-banner>
          </div>
        </div>
      </transition>

        <q-tabs
          class="text-grey-10 small-screen-only"
          active-color="primary"
          indicator-color="transparent"
        >
          <q-route-tab
            to="/"
            icon="eva-home-outline"
          />
          <q-route-tab
            to="/camera"
            icon="eva-camera-outline"
          />
        </q-tabs>
    </q-footer>

    <q-page-container class="bg-grey-1">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

let deferredPrompt;

export default {
  name: 'MainLayout',
  data() {
    return {
      showAppInstallBanner: false,
    }
  },
  mounted() {
    this.showInstallBanner();
  },
  methods: {
   showInstallBanner() {
     const neverShowAppInstallBanner  = this.$q.localStorage.getItem('neverShowAppInstallBanner')

     if (!neverShowAppInstallBanner) {
       window.addEventListener('beforeinstallprompt', (e) => {
         e.preventDefault()

         deferredPrompt = e

         setTimeout(()=> {
           this.showAppInstallBanner = true;
         }, 3000)
       })
     }
   },
   async installApp() {
      this.showAppInstallBanner = false;
      deferredPrompt.prompt()
      const userChoice = await deferredPrompt.userChoice
      if (userChoice.outcome === 'accepted') {
        console.info('User accepted the install prompt')
        this.neverShowAppInstallBanner();
      } else {
        console.info('User dismissed the install prompt')
      }
    },
    neverShowAppInstallBanner() {
      this.showAppInstallBanner = false
      this.$q.localStorage.set('neverShowAppInstallBanner', true)
    }
  }
}
</script>

<style lang="scss">
  .q-toolbar {
    @media (min-width: $breakpoint-sm-min) {
      height: 7.7rem;
    }
  }

  .q-toolbar__title {
    @media (max-width: $breakpoint-xs-max) {
      text-align: center;
    }

    font-size: 3rem;
  }

  .q-footer {
    .q-tab__icon {
      font-size: 3rem;
    }
  }
</style>
