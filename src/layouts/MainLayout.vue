<template>
  <q-layout
    view="hHh lpr lFf"
    class="main-layout"
    :class="{ 'router-transitioning': routerTransitionInProgress }"
  >
    <q-header elevated class="bg-primary text-white main-layout--header">
      <q-toolbar>
        <!-- Taskbar menu button -->
        <q-btn
          v-ripple
          flat
          round
          dense
          icon="menu"
          class="xs on-left"
          @click="showTaskbar = !showTaskbar"
        />
        <!-- Logo -->
        <router-link class="wrapper-link" :to="{ name: 'home' }">
          <q-avatar>
            <img src="~assets/logo.svg" />
          </q-avatar>
        </router-link>
        <!-- Toolbar title -->
        <q-toolbar-title :style="!showTitle ? 'padding: 0;' : ''">
          <router-link class="wrapper-link" :to="{ name: 'home' }">
            <span v-if="showTitle">Juju Lens</span>
          </router-link>
          <q-resize-observer
            @resize="({ width }) => (showTitle = width > 86)"
          />
        </q-toolbar-title>
        <!-- Toolbar tabs -->
        <q-tabs inline-label shrink class="gt-mobile-menu">
          <q-route-tab
            v-for="(link, i) in mainLinks"
            :key="i"
            :icon="link.icon"
            :label="link.label"
            :to="link.to"
            style="font-size: 0.3em;"
          />
        </q-tabs>
        <!-- Controller select -->
        <q-select
          filled
          dark
          v-model="currentController"
          :options="controllerOptions"
          option-label="name"
          label="Controller"
          class="q-mx-sm controller-select"
          popup-content-class="controller-select-popup"
          style="flex: 0.1 1 12em"
        />
        <!-- Dark mode button -->
        <dark-mode-toggle />
        <!-- Mobile menu button -->
        <q-btn
          v-ripple
          flat
          round
          dense
          icon="menu"
          class="lt-mobile-menu on-right"
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
      :breakpoint="taskbarBreakpoint"
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
          <!-- Info Button -->
          <q-item clickable v-ripple :to="{ name: 'welcome' }">
            <q-item-section avatar>
              <q-icon name="info" />
            </q-item-section>
            <q-item-section>
              Welcome Page
            </q-item-section>
          </q-item>

          <!-- My Account -->
          <q-item clickable v-ripple :to="{ name: 'my-account' }">
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>
              My Account
            </q-item-section>
          </q-item>

          <!-- Debug window -->
          <q-item
            clickable
            v-ripple
            @click="
              $store.commit('app/toggleDebugWindow');
              if (windowWidth() <= taskbarBreakpoint) {
                showTaskbar = false;
              }
            "
          >
            <q-item-section avatar>
              <q-icon name="fas fa-bug" />
            </q-item-section>
            <q-item-section>
              Debug Window
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            @click="
              showTerminal = !showTerminal;
              if (windowWidth() <= taskbarBreakpoint) {
                showTaskbar = false;
              }
            "
          >
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
          <q-item
            v-for="(link, i) in mainLinks"
            :key="i"
            clickable
            v-ripple
            :to="link.to"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>

            <q-item-section>
              {{ link.label }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page>
        <transition
          name="router-slide-down"
          mode="out-in"
          v-on:before-leave="routerTransitionInProgress = true"
          v-on:after-enter="routerTransitionInProgress = false"
        >
          <!-- TODO: We need to figure out how to wrap child routes in a scroll
        area or something so that they don't get taller than the screen and
        mess up the fit of the floating windows over the content. For now each
        child route has to manually make sure it fits the page and otherwise
        has a scroll area or somethign to keep from overflowing the page size. -->
          <router-view />
        </transition>
        <debug-window />
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

import { namespace } from 'vuex-class';
const juju = namespace('juju');
import { mutationTypes } from 'store/juju/mutations';
import { Controller } from 'store/juju/state';

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
  //
  // Current controller handling
  //

  @juju.State('currentController') globalCurrentController!: Controller | null;
  @juju.State controllers!: Controller[];
  @juju.Mutation(mutationTypes.setCurrentController) setCurrentController!: (
    name: Controller | null
  ) => Promise<undefined>;

  get currentController(): Controller | null {
    return this.globalCurrentController;
  }
  set currentController(value: Controller | null) {
    this.setCurrentController(value);
  }
  get controllerOptions(): Controller[] {
    return this.controllers;
  }

  //
  // Misc. State
  //

  readonly taskbarBreakpoint = 599;
  showTaskbar = false;
  taskbarMini = true;

  showMenuDrawer = false;
  routerTransitionInProgress = false;

  showTerminal = false;
  terminalMaximized = false;

  showTitle = true;

  // The main menu links
  readonly mainLinks = [
    {
      label: 'Controllers',
      icon: 'fas fa-network-wired',
      to: { name: 'controllers' }
    },
    {
      label: 'Models',
      icon: 'share',
      to: { name: 'models' }
    },
    {
      label: 'Admin',
      icon: 'person',
      to: { name: 'admin' }
    }
  ];

  // Used to selectively hide the taskbar on taskbar button click
  windowWidth(): number {
    return window.innerWidth;
  }
}
</script>

<style lang="stylus">
.body--light
  .taskbar, .menu-drawer
    background-color $blue-grey-1

.body--dark .q-item.q-router-link--active,
.body--dark .q-item--active
  color $secondary

.body--light .q-item.q-router-link--active,
.body--light .q-item--active
  color darken($secondary, 25%)

.main-layout--header .q-tabs
  margin-right 0.5em
  margin-left 0.5em

.controller-select .q-field__label
  color hsla(0, 0%, 100%, 0.7)

.body--light .controller-select-popup
  .q-item
    background-color white
  :not(.q-item--active).q-item
    color black

// Breakpoint class for mobile menu items
.main-layout
  .lt-mobile-menu
    @media(min-width: 675px)
      display none
  .gt-mobile-menu
    @media(max-width: 675px)
      display none

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
  transform TranslateY(-100vh)

.router-slide-down-leave-to
  transform TranslateX(-100vw)
</style>
