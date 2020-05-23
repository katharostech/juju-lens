<template>
  <q-layout
    view="hHh lpr lFf"
    :class="{ 'router-transitioning': routerTransitionInProgress }"
  >
    <q-header elevated class="bg-primary text-white">
      <q-toolbar ref="headerToolbar">
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

    <!-- Taskbar -->
    <q-drawer
      v-model="showTaskbar"
      :mini="taskbarMini"
      mini-to-overlay
      bordered
      show-if-above
      :breakpoint="599"
      :width="200"
      content-class="taskbar"
      @mouseover="taskbarMini = false"
      @mouseout="taskbarMini = true"
    >
      <div class="column fit">
        <q-scroll-area
          class="col"
          :thumb-style="{
            width: '3px'
          }"
        >
          <q-list>
            <q-item
              v-for="(item, i) in [
                {
                  type: 'term',
                  unitName: 'my-app/1'
                },
                {
                  type: 'log',
                  unitName: 'my-app/2'
                },
                {
                  type: 'log',
                  unitName: 'my-db/1'
                },
                {
                  type: 'log',
                  unitName: 'my-longer-app-name-app/2'
                },
                {
                  type: 'term',
                  unitName: 'my-app/1'
                },
                {
                  type: 'log',
                  unitName: 'my-db/1'
                }
              ]"
              :key="i"
              clickable
              v-ripple
            >
              <q-menu
                context-menu
                anchor="center right"
                self="center left"
                content-style="z-index: 10000"
                transition-show="jump-right"
                transition-hide="jump-left"
              >
                <q-list dense>
                  <q-item clickable v-close-popup>
                    <q-item-section side>
                      <q-icon name="fas fa-window-close" />
                    </q-item-section>
                    <q-item-section>Close</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <q-item-section avatar>
                <q-icon
                  :name="
                    item.type == 'log' ? 'fas fa-file-alt' : 'fas fa-terminal'
                  "
                />
              </q-item-section>
              <q-item-section avatar class="ellipsis">
                {{ item.unitName }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-separator style="height: 1px" />

        <q-list>
          <q-item
            clickable
            v-ripple
            @click="() => $store.commit('floatingWindows/toggleDebugWindow')"
          >
            <q-item-section avatar>
              <q-icon name="fas fa-bug" />
            </q-item-section>
            <q-item-section>
              Debug Window
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="showTerminal = !showTerminal">
            <q-item-section avatar>
              <q-icon name="fas fa-terminal" />
            </q-item-section>
            <q-item-section>
              Juju Terminal
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- Menu Drawer -->
    <q-drawer
      side="right"
      v-model="showMenuDrawer"
      :width="200"
      content-class="menu-drawer"
    >
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <q-item>
            <q-item-section class="text-weight-bold">
              Menu
            </q-item-section>
          </q-item>
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

    <q-footer>
      <embedded-terminal
        :visible="showTerminal"
        :maximized="terminalMaximized"
        @minimize="showTerminal = false"
        @maximize="terminalMaximized = true"
        @restore="terminalMaximized = false"
      />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import DarkModeToggle from 'components/DarkModeToggle.vue';
import FloatingWindow from 'components/FloatingWindow.vue';
import EmbeddedTerminal from 'components/EmbeddedTerminal.vue';
import DebugWindow from 'components/DebugWindow.vue';

import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    DarkModeToggle,
    FloatingWindow,
    DebugWindow,
    EmbeddedTerminal
  }
})
export default class MainLayout extends Vue {
  showTaskbar = false;
  taskbarMini = true;
  showMenuDrawer = false;
  routerTransitionInProgress = false;

  showTerminal = false;
  terminalMaximized = false;

  //// This was supposed to delay the expanding of the taksbar, but I'm not sure I like it so
  //// commenting it out for now.
  // // Handle showing the taskbar after a delay of mouse hover time
  // // This NodeJS.Timeout doesn't necessarily make sense I don't thinkg, but it made TypeScript
  // // happy.
  // showTaskbarTimeout: null | NodeJS.Timeout = null;

  // onTaskbarMouseOver(): void {
  //   this.showTaskbarTimeout = setTimeout(() => (this.taskbarMini = false), 500);
  // }
  // onTaskbarMouseOut(): void {
  //   if (this.taskbarMini == false) {
  //     this.taskbarMini = true;
  //   }

  //   if (this.showTaskbarTimeout) {
  //     clearTimeout(this.showTaskbarTimeout);
  //     this.showTaskbarTimeout = null;
  //   }
  // }
}
</script>

<style lang="stylus">
.body--light
  .taskbar, .menu-drawer
    background-color $grey-2
    color $dark

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
