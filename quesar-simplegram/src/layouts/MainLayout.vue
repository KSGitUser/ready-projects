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

    <q-footer class="bg-white small-screen-only" bordered>
        <q-tabs
          class="text-grey-10"
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

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data() {
    return {}
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
