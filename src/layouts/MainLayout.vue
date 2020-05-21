<template>
  <q-layout
    view="lHh Lpr lFf"
    :class="{ 'router-transitioning': routerTransitionInProgress }"
  >
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <router-link class="wrapper-link" :to="{ name: 'home' }">
          <q-toolbar-title>
            <q-avatar>
              <img src="~assets/logo.svg" />
            </q-avatar>
            Juju Lens
          </q-toolbar-title>
        </router-link>
        <q-space />
        <dark-mode-toggle />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          Essential Links
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition
        name="router-slide-down"
        mode="out-in"
        v-on:before-leave="routerTransitionInProgress = true"
        v-on:after-enter="routerTransitionInProgress = false"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import DarkModeToggle from 'components/DarkModeToggle.vue';

import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    DarkModeToggle
  }
})
export default class MainLayout extends Vue {
  leftDrawerOpen = false;
  routerTransitionInProgress = false;
}
</script>

<style lang="stylus">
// Router transition classes
.q-layout.router-transitioning
  max-height 100vh
  max-width 100vw
  overflow hidden

.router-slide-down-enter-active,
.router-slide-down-leave-active
  transition all .4s ease
  overflow hidden

.router-slide-down-enter
  transform TranslateY(-100%)

.router-slide-down-leave-to
  transform TranslateY(100%)
</style>
