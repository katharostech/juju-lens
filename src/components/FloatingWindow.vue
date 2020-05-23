<template>
  <div
    ref="parentSizeDetector"
    style="position: absolute; top: 0; bottom: 0; right: 0; left: 0;"
  >
    <transition name="window-transition">
      <!-- Div set to the full size of it's parent, that way we can measure this div to measure
    the parent's size. -->
      <div class="floating-window" :style="floatingWindowStyle" v-if="visible">
        <q-card class="fit">
          <q-bar
            v-touch-pan.mouse.prevent="moveWindow"
            class="floating-window--bar cursor-pointer"
          >
            <q-icon v-if="icon" :name="icon" />

            <div class="text-weight-bold ellipsis">{{ title }}</div>

            <q-space />

            <!-- TODO: Use material icons instead of fontawesome? -->

            <div style="position: relative;">
              <!-- Position button -->
              <q-btn
                v-if="showMinimize"
                v-ripple
                dense
                flat
                icon="fas fa-th"
                @click="showPositionButtons = !showPositionButtons"
              >
                <q-tooltip
                  transition-show="jump-up"
                  transition-hide="jump-down"
                  anchor="top middle"
                  self="bottom middle"
                  :delay="500"
                >
                  Position
                </q-tooltip>
              </q-btn>

              <!-- Position select buttons -->
              <transition
                v-for="([x, y], i) in [
                  [0, 1],
                  [1, 1],
                  [1, 0],
                  [1, -1],
                  [0, -1],
                  [-1, -1],
                  [-1, 0],
                  [-1, 1],
                  [0, 0]
                ]"
                :key="i"
                name="pos-btn-trans"
              >
                <q-btn
                  v-if="showPositionButtons"
                  round
                  dense
                  color="secondary"
                  :style="
                    `position: absolute; left: ${3 * x}em; top: ${3 * y}em;`
                  "
                  class="position-button"
                  @click="setWindowTilePosition([x, y])"
                >
                  <q-icon
                    v-if="!(x == 0 && y == 0)"
                    name="arrow_drop_down"
                    :style="`transform: rotate(${-i * 45}deg)`"
                  />
                  <q-icon v-else name="pages" />
                </q-btn>
              </transition>
            </div>

            <!-- Minimize button -->
            <q-btn
              v-if="showMinimize"
              v-ripple
              dense
              flat
              icon="fas fa-window-minimize"
              @click="$emit('minimize')"
            >
              <q-tooltip
                transition-show="jump-up"
                transition-hide="jump-down"
                anchor="top middle"
                self="bottom middle"
                :delay="500"
              >
                Minimize
              </q-tooltip>
            </q-btn>

            <!-- Maximize button -->
            <q-btn
              v-if="!maximized && showMaximize"
              v-ripple
              dense
              flat
              icon="fas fa-expand"
              @click="$emit('maximize')"
            >
              <q-tooltip
                transition-show="jump-up"
                transition-hide="jump-down"
                anchor="top middle"
                self="bottom middle"
                :delay="500"
              >
                Maximize
              </q-tooltip>
            </q-btn>

            <!-- Restore button -->
            <q-btn
              v-if="maximized && showMaximize"
              v-ripple
              dense
              flat
              icon="fas fa-window-restore"
              @click="$emit('restore')"
            >
              <q-tooltip
                transition-show="jump-up"
                transition-hide="jump-down"
                anchor="top middle"
                self="bottom middle"
                :delay="500"
              >
                Restore
              </q-tooltip>
            </q-btn>

            <!-- Close button -->
            <q-btn
              v-if="showClose"
              v-ripple
              dense
              flat
              icon="fas fa-window-close"
              @click="$emit('close')"
            >
              <q-tooltip
                transition-show="jump-up"
                transition-hide="jump-down"
                anchor="top middle"
                self="bottom middle"
                :delay="500"
              >
                Close
              </q-tooltip>
            </q-btn>
          </q-bar>

          <!-- Window Content -->
          <div class="floating-window--content">
            <slot name="default" />
          </div>

          <!-- RESIZE HANDLES -->

          <!-- Resize Top side -->
          <div
            v-touch-pan.mouse.up.down.prevent="resizeWindowTop"
            style="position: absolute; left: 0; right: 0; top: 0; cursor: ns-resize; height: 0.7em;"
          ></div>
          <!-- Resize Bottom side -->
          <div
            v-touch-pan.mouse.up.down.prevent="resizeWindowBottom"
            style="position: absolute; bottom: 0; right: 0; left: 0; cursor: ns-resize; height: 0.7em;"
          ></div>
          <!-- Resize Right side -->
          <div
            v-touch-pan.mouse.left.right.prevent="resizeWindowRight"
            style="position: absolute; bottom: 0; right: 0; top: 0; cursor: ew-resize; width: 0.7em;"
          ></div>
          <!-- Resize Left side -->
          <div
            v-touch-pan.mouse.left.right.prevent="resizeWindowLeft"
            style="position: absolute; bottom: 0; right: left; top: 0; cursor: ew-resize; width: 0.7em;"
          ></div>
          <!-- Resize Top Left -->
          <div
            v-touch-pan.mouse.prevent="resizeWindowTopLeft"
            style="position: absolute; top: 0; left: 0; cursor: nw-resize; width: 0.7em; height: 0.7em;"
          ></div>
          <!-- Resize Top Right -->
          <div
            v-touch-pan.mouse.prevent="resizeWindowTopRight"
            style="position: absolute; top: 0; right: 0; cursor: sw-resize; width: 0.7em; height: 0.7em;"
          ></div>
          <!-- Resize Bottom Left -->
          <div
            v-touch-pan.mouse.prevent="resizeWindowBottomLeft"
            style="position: absolute; bottom: 0; left: 0; cursor: sw-resize; width: 0.7em; height: 0.7em;"
          ></div>
          <!-- Resize Bottom Right -->
          <div
            v-touch-pan.mouse.prevent="resizeWindowBottomRight"
            style="position: absolute; bottom: 0; right: 0; cursor: nw-resize; width: 0.7em; height: 0.7em;"
          ></div>
        </q-card>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { dom } from 'quasar';
const { height, width } = dom;

import { Vue, Prop, Watch, Component } from 'vue-property-decorator';

@Component
export default class FloatingWindow extends Vue {
  @Prop({ type: String, default: '' }) readonly title!: string;
  @Prop(Boolean) readonly maximized!: boolean;
  @Prop({ type: Boolean, default: true }) readonly visible!: boolean;
  @Prop({ type: Boolean, default: true }) readonly showMinimize!: boolean;
  @Prop({ type: Boolean, default: true }) readonly showMaximize!: boolean;
  @Prop({ type: Boolean, default: true }) readonly showClose!: boolean;
  @Prop(String) readonly icon!: string;

  readonly transitionDuration = 0.3;
  transitioning = false;

  top = 15;
  left = 15;
  right = 15;
  bottom = 15;

  showPositionButtons = false;
  positionButtonGlobalClickListener: null | EventListenerOrEventListenerObject = null;

  get floatingWindowStyle(): string {
    const transitionStyle = this.transitioning
      ? `transition: all ${this.transitionDuration}s;`
      : '';

    if (this.maximized) {
      return (
        transitionStyle +
        'margin: 0; transform: none; right: 0; bottom: 0; left: 0; top: 0;'
      );
    } else {
      return (
        transitionStyle +
        `left: ${this.left}%; top: ${this.top}%; right: ${this.right}%; bottom: ${this.bottom}%;`
      );
    }
  }

  @Watch('maximized')
  onMaximizedChange(): void {
    // Set this to transitioning for the duration of the transition
    this.transitioning = true;
    setTimeout(
      () => (this.transitioning = false),
      this.transitionDuration * 1000
    );
  }

  // Watch for changes to the showPositionButtons and add a click handler to close the buttons when
  // you click away from them.
  @Watch('showPositionButtons')
  onShowPositionButtonChange(showPosBtns: boolean): void {
    if (showPosBtns) {
      this.positionButtonGlobalClickListener = this.globalClickListener.bind(
        this
      );

      document.addEventListener(
        'mousedown',
        this.positionButtonGlobalClickListener
      );
    }
  }
  globalClickListener(): void {
    this.showPositionButtons = false;

    if (this.positionButtonGlobalClickListener) {
      document.removeEventListener(
        'mousedown',
        this.positionButtonGlobalClickListener
      );

      this.positionButtonGlobalClickListener = null;
    }
  }

  get parentSize(): [number, number] {
    return [
      width(this.$refs.parentSizeDetector as Element),
      height(this.$refs.parentSizeDetector as Element)
    ];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveWindow(event: any): void {
    if (!this.maximized) {
      const left = this.left + (event.delta.x / this.parentSize[0]) * 100;
      const top = this.top + (event.delta.y / this.parentSize[1]) * 100;

      if (left >= 0) {
        this.left = left;
        this.right -= (event.delta.x / this.parentSize[0]) * 100;
      }

      if (top >= 0) {
        this.top = top;
        this.bottom -= (event.delta.y / this.parentSize[1]) * 100;
      }
    }
  }

  setWindowTilePosition([x, y]: [number, number]): void {
    this.showPositionButtons = false;
    this.transitioning = true;

    // Unmaximize if necessary
    if (this.maximized) {
      this.$emit('restore');
    }

    if (x == 0 && y == 0) {
      this.left = 15;
      this.top = 15;
      this.right = 15;
      this.bottom = 15;
      return;
    }

    if (x == 0) {
      this.left = 0;
      this.right = 0;
    } else if (x == 1) {
      this.left = 50;
      this.right = 0;
    } else if (x == -1) {
      this.right = 50;
      this.left = 0;
    }

    if (y == 0) {
      this.top = 0;
      this.bottom = 0;
    } else if (y == 1) {
      this.top = 50;
      this.bottom = 0;
    } else if (y == -1) {
      this.top = 0;
      this.bottom = 50;
    }

    setTimeout(
      () => (this.transitioning = false),
      this.transitionDuration * 1000
    );
  }

  //
  // Resize handlers
  //

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowTop(event: any): void {
    if (!this.maximized) {
      const top = this.top + (event.delta.y / this.parentSize[1]) * 100;
      this.top = top >= 0 ? top : 0;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowBottom(event: any): void {
    if (!this.maximized) {
      this.bottom = this.bottom - (event.delta.y / this.parentSize[1]) * 100;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowRight(event: any): void {
    if (!this.maximized) {
      this.right = this.right - (event.delta.x / this.parentSize[0]) * 100;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowLeft(event: any): void {
    if (!this.maximized) {
      const left = this.left + (event.delta.x / this.parentSize[0]) * 100;
      this.left = left >= 0 ? left : 0;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowTopLeft(event: any): void {
    this.resizeWindowTop(event);
    this.resizeWindowLeft(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowTopRight(event: any): void {
    this.resizeWindowRight(event);
    this.resizeWindowTop(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowBottomLeft(event: any): void {
    this.resizeWindowBottom(event);
    this.resizeWindowLeft(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowBottomRight(event: any): void {
    this.resizeWindowBottom(event);
    this.resizeWindowRight(event);
  }
}
</script>

<style lang="stylus">
.floating-window
  position absolute
  min-width 10em
  min-height 3em

  .floating-window--content
    max-width 100%
    max-height 100%
    overflow auto

.floating-window--bar
  background-color $primary
  color white

.position-button
  z-index 1000000

// Position button transitions
.pos-btn-trans-enter-active,
.pos-btn-trans-leave-active
  transition all 0.15s ease

.pos-btn-trans-leave-to,
.pos-btn-trans-enter
  transform scale(0) !important

// Window transition classes
.window-transition-enter-active,
.window-transition-leave-active
    transition all 0.4s ease

.window-transition-leave-to,
.window-transition-enter
  transform scale(0) !important
  left -10% !important
  right 100% !important
  top 40% !important
  bottom 40% !important
</style>
