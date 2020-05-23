<template>
  <div
    class="embedded-terminal"
    :style="{
      height: `${visible ? (maximized ? maxHeight : height) : 0}px`,
      transition: transitioning ? `all ${transitionDuration}s ease` : ''
    }"
  >
    <!-- Top Resize Handle -->
    <div
      v-touch-pan.mouse.up.down.prevent="resizeTop"
      style="position: absolute; left: 0; right: 0; top: 0; cursor: ns-resize; height: 0.7em;"
    ></div>

    <!-- Terminal Top Bar -->
    <q-bar class="embedded-terminal--bar bg-primary" dense>
      <q-icon name="fas fa-terminal" />

      <div class="text-weight-bold ellipsis">Terminal</div>

      <q-space />

      <!-- Maximize button -->
      <q-btn
        v-ripple
        dense
        flat
        v-if="!maximized"
        icon="fas fa-expand"
        @click="$emit('maximize')"
      >
        <q-tooltip
          transition-show="jump-up"
          transition-hide="jump-down"
          anchor="top middle"
          self="bottom middle"
          :delay="300"
        >
          Maximize
        </q-tooltip>
      </q-btn>

      <!-- Maximize button -->
      <q-btn
        v-ripple
        dense
        flat
        v-if="maximized"
        icon="fas fa-window-restore"
        @click="$emit('restore')"
      >
        <q-tooltip
          transition-show="jump-up"
          transition-hide="jump-down"
          anchor="top middle"
          self="bottom middle"
          :delay="300"
        >
          Maximize
        </q-tooltip>
      </q-btn>

      <!-- Minimize button -->
      <q-btn
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
          :delay="300"
        >
          Hide
        </q-tooltip>
      </q-btn>
    </q-bar>

    <!-- Terminal Body -->
    <div class="embedded-terminal--body fit q-pa-xs">
      <q-input
        v-model="termText"
        square
        autogrow
        type="textarea"
        style="width: 100% height: 100%;"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Inject } from 'vue-property-decorator';

@Component
export default class EmbeddedTerminal extends Vue {
  @Prop(Boolean) readonly visible!: boolean;
  @Prop(Boolean) readonly maximized!: boolean;

  // Grab the layout info for the layout that we are in
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Inject('layout') readonly layout!: any;

  height = 200;
  readonly transitionDuration = 0.3;
  transitioning = false;

  termText = 'jujuuser@jujucontroller $ ';

  get maxHeight(): number {
    return window.innerHeight - this.layout.header.offset;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeTop(event: any): void {
    // Restore window if it was maximized
    if (this.maximized) {
      this.$emit('restore');
      this.height = this.maxHeight;
    }

    const height = this.height - event.delta.y;
    // Collapse completely if only the top bar is showing anyway
    if (height < 30) {
      this.height = 0;
      this.$emit('minimize');
    } else {
      this.height = height;
    }
  }

  // Make sure we don't surpass our bounds
  @Watch('height')
  onHeightChange(): void {
    if (this.height > this.maxHeight) {
      this.height = this.maxHeight;
    }
  }

  @Watch('visible')
  @Watch('maximized')
  onVisibleChange() {
    this.transitioning = true;

    // If the height is very low, make sure it is at least 200
    if (this.height < 50) {
      this.height = 200;
    }

    setTimeout(
      () => (this.transitioning = false),
      this.transitionDuration * 1000
    );
  }
}
</script>

<style lang="stylus">
.embedded-terminal--body
  background-color black
  font-family 'Courier New', Courier, monospace

  textarea
    color white
    padding 0 !important

.body--light .embedded-terminal--body .q-field--standard .q-field__control::before
  border-bottom-color $grey-4 !important
</style>
