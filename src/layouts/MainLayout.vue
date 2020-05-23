<template>
  <q-layout
    view="hHh lpr lFf"
    :class="{ 'router-transitioning': routerTransitionInProgress }"
  >
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          v-ripple
          flat
          round
          dense
          icon="menu"
          class="xs on-left"
          @click="showTaskbar = !showTaskbar"
        />
        <router-link class="wrapper-link on-left" :to="{ name: 'home' }">
          <q-toolbar-title>
            <q-avatar class="on-left">
              <img src="~assets/logo.svg" />
            </q-avatar>
            Juju Lens
          </q-toolbar-title>
        </router-link>
        <div class="gt-xs">
          <q-btn v-ripple flat icon="cloud" label="Clouds" class="q-ma-xs" />
          <q-btn v-ripple flat icon="share" label="Models" class="q-ma-xs" />
          <q-btn v-ripple flat icon="person" label="Admin" class="q-ma-xs" />
        </div>
        <q-space />
        <dark-mode-toggle />
        <q-btn
          v-ripple
          flat
          round
          dense
          icon="menu"
          class="xs on-right"
          @click="showMenuDrawer = !showMenuDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="showTaskbar"
      mini
      mini-to-overlay
      bordered
      show-if-above
      :breakpoint="599"
      :width="60"
      content-class="taskbar"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="send" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="() => $store.commit('floatingWindows/toggleDebugWindow')"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-bug" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer
      side="right"
      v-model="showMenuDrawer"
      :width="200"
      content-class="menu-drawer"
    >
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="cloud" />
            </q-item-section>

            <q-item-section>
              Clouds
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="share" />
            </q-item-section>

            <q-item-section>
              Models
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>

            <q-item-section>
              Admin
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <debug-window />
        <div>
          <transition
            name="router-slide-down"
            mode="out-in"
            v-on:before-leave="routerTransitionInProgress = true"
            v-on:after-enter="routerTransitionInProgress = false"
          >
            <router-view />
          </transition>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import DarkModeToggle from 'components/DarkModeToggle.vue';
import FloatingWindow from 'components/FloatingWindow.vue';
import DebugWindow from 'components/DebugWindow.vue';

import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    DarkModeToggle,
    FloatingWindow,
    DebugWindow
  }
})
export default class MainLayout extends Vue {
  showTaskbar = false;
  taskbarMini = true;
  showMenuDrawer = false;
  routerTransitionInProgress = false;
}
</script>

<style lang="stylus">
.body--light
  .taskbar, .menu-drawer
    background-color $grey-2

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
