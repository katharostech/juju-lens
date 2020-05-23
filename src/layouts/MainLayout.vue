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
      mini
      mini-to-overlay
      bordered
      show-if-above
      :breakpoint="599"
      :width="200"
      content-class="taskbar"
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
                  unitName: 'my-app/2'
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
              <q-menu context-menu content-style="z-index: 10000">
                <q-list dense>
                  <q-item clickable v-close-popup>
                    <q-item-section side>
                      <q-icon name="fas fa-window-close" />
                    </q-item-section>
                    <q-item-section>Close</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <q-tooltip
                anchor="center right"
                self="center left"
                transition-show="jump-right"
                transition-hide="jump-left"
                content-class="q-mini-drawer-hide"
                :delay="340"
              >
                {{ item.unitName }}
              </q-tooltip>
              <q-item-section avatar>
                <q-icon
                  :name="
                    item.type == 'log' ? 'fas fa-file-alt' : 'fas fa-terminal'
                  "
                />
              </q-item-section>
              <q-item-section avatar>
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
            <q-tooltip
              anchor="center right"
              self="center left"
              transition-show="jump-right"
              transition-hide="jump-left"
            >
              Debug Window
            </q-tooltip>
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
              terminalHeight > 25
                ? (terminalHeight = 0)
                : (terminalHeight = 300)
            "
          >
            <q-tooltip
              anchor="center right"
              self="center left"
              transition-show="jump-right"
              transition-hide="jump-left"
            >
              Juju Terminal
            </q-tooltip>
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
        v-model="terminalHeight"
        @maximize="maximizeTerminal"
        :class="
          terminalTransitioning
            ? `transition: all ${terminalTransitionDuration}s`
            : ''
        "
      />
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import DarkModeToggle from 'components/DarkModeToggle.vue';
import FloatingWindow from 'components/FloatingWindow.vue';
import EmbeddedTerminal from 'components/EmbeddedTerminal.vue';
import DebugWindow from 'components/DebugWindow.vue';

import { dom } from 'quasar';
const { height } = dom;

import { Component, Vue, Watch } from 'vue-property-decorator';

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

  terminalHeight = 0;
  readonly terminalTransitionDuration = 0.3;
  terminalTransitioning = false;

  get availableTermHeight(): number {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return window.innerHeight - height((this.$refs.headerToolbar as any).$el);
  }

  @Watch('terminalHeight')
  onTerminalHeightChange(termHeight: number) {
    // Make sure the terminal doesn't grow past the available height
    const availHeight = this.availableTermHeight;
    if (termHeight > availHeight) {
      this.terminalHeight = availHeight;
    }
  }

  maximizeTerminal(): void {
    this.terminalTransitioning = true;
    this.terminalHeight = this.availableTermHeight;
    // Keep this timeout time in sync with the CSS `.terminal-transitioning` class
    setTimeout(
      () => (this.terminalTransitioning = false),
      this.terminalTransitionDuration * 1000
    );
  }
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
