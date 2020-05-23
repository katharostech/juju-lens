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

    <q-drawer
      v-model="showTaskbar"
      mini
      mini-to-overlay
      bordered
      show-if-above
      :breakpoint="599"
      :width="40"
      :mini-width="40"
      content-class="taskbar"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple style="height: 30px;">
            <q-item-section avatar>
              <q-icon name="inbox" size="1.2em" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple style="height: 30px;">
            <q-item-section avatar>
              <q-icon name="star" size="1.2em" />
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple style="height: 30px;">
            <q-item-section avatar>
              <q-icon name="send" size="1.2em" />
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-ripple style="height: 30px;">
            <q-item-section avatar>
              <q-icon name="drafts" size="1.2em" />
            </q-item-section>
          </q-item>

          <q-space vertical />

          <q-item
            clickable
            v-ripple
            @click="() => $store.commit('floatingWindows/toggleDebugWindow')"
          >
            <q-item-section avatar style="height: 30px;">
              <q-icon name="fas fa-bug" size="1.2em" />
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
            <q-item-section avatar style="height: 30px;">
              <q-icon name="fas fa-terminal" size="1.2em" />
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
