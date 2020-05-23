<template>
  <transition name="window-transition">
    <div class="floating-window" :style="floatingWindowStyle" v-if="visible">
      <q-card class="fit">
        <q-bar v-touch-pan.mouse.prevent="moveWindow" class="cursor-pointer">
          <div class="text-weight-bold ellipsis">{{ title }}</div>
          <q-space />
          <!-- TODO: Use material icons instead of fontawesome? -->
          <!-- Minimize button -->
          <q-btn
            v-if="showMinimize"
            v-ripple
            dense
            flat
            icon="fas fa-window-minimize"
            @click="$emit('minimize')"
          />
          <!-- Maximize button -->
          <q-btn
            v-if="!maximized && showMaximize"
            v-ripple
            dense
            flat
            icon="fas fa-window-maximize"
            @click="$emit('maximize')"
          />
          <!-- Resore button -->
          <q-btn
            v-if="maximized && showMaximize"
            v-ripple
            dense
            flat
            icon="fas fa-window-restore"
            @click="$emit('restore')"
          />
          <!-- Close button -->
          <q-btn
            v-if="showClose"
            v-ripple
            dense
            flat
            icon="fas fa-window-close"
            @click="$emit('close')"
          />
        </q-bar>
        <div>
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
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from 'vue-property-decorator';

@Component
export default class FloatingWindow extends Vue {
  @Prop({ type: String, default: '' }) readonly title!: string;
  @Prop(Boolean) readonly maximized!: boolean;
  @Prop({ type: Boolean, default: true }) readonly visible!: boolean;
  @Prop({ type: Boolean, default: true }) readonly showMinimize!: boolean;
  @Prop({ type: Boolean, default: true }) readonly showMaximize!: boolean;
  @Prop({ type: Boolean, default: true }) readonly showClose!: boolean;

  readonly transitionDuration = 0.2;
  transitioning = false;

  top = 50;
  left = 50;
  right = 50;
  bottom = 50;

  get floatingWindowStyle() {
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
        `left: ${this.left}px; top: ${this.top}px; right: ${this.right}px; bottom: ${this.bottom}px;`
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveWindow(event: any) {
    if (!this.maximized) {
      const left = this.left + event.delta.x;
      const top = this.top + event.delta.y;

      if (left >= 0) {
        this.left = left;
        this.right -= event.delta.x;
      }

      if (top >= 0) {
        this.top = top;
        this.bottom -= event.delta.y;
      }
    }
  }

  //
  // Resize handlers
  //

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowTop(event: any) {
    if (!this.maximized) {
      const top = this.top + event.delta.y;
      this.top = top >= 0 ? top : 0;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowBottom(event: any) {
    if (!this.maximized) {
      this.bottom = this.bottom - event.delta.y;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowRight(event: any) {
    if (!this.maximized) {
      this.right = this.right - event.delta.x;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowLeft(event: any) {
    if (!this.maximized) {
      const left = this.left + event.delta.x;
      this.left = left >= 0 ? left : 0;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowTopLeft(event: any) {
    this.resizeWindowTop(event);
    this.resizeWindowLeft(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowTopRight(event: any) {
    this.resizeWindowRight(event);
    this.resizeWindowTop(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowBottomLeft(event: any) {
    this.resizeWindowBottom(event);
    this.resizeWindowLeft(event);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeWindowBottomRight(event: any) {
    this.resizeWindowBottom(event);
    this.resizeWindowRight(event);
  }
}
</script>

<style lang="stylus">
.floating-window
  position absolute
  min-width 10em
  min-height 10em

// Window transition classes
.window-transition-enter-active,
.window-transition-leave-active
    transition all 0.4s ease

.window-transition-leave-to,
.window-transition-enter
  transform scale(0) !important
  left -5% !important
  right 100% !important
  top 40% !important
  bottom 40% !important
</style>
