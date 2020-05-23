<template>
  <div class="embedded-terminal" :style="{ height: `${height}px` }">
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

      <q-btn v-ripple dense flat icon="fas fa-grip-lines-vertical">
        <q-tooltip
          transition-show="jump-up"
          transition-hide="jump-down"
          anchor="top middle"
          self="bottom middle"
          :delay="300"
        >
          Split
        </q-tooltip>
      </q-btn>

      <q-btn
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
          :delay="300"
        >
          Maximize
        </q-tooltip>
      </q-btn>

      <q-btn
        v-ripple
        dense
        flat
        icon="fas fa-window-minimize"
        @click="$emit('setHeight', 0)"
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
    <div class="embedded-terminal--body fit">
      Hello world
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model } from 'vue-property-decorator';

@Component
export default class EmbeddedTerminal extends Vue {
  @Model('setHeight', { type: Number, default: 100 }) readonly height!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeTop(event: any): void {
    const height = this.height - event.delta.y;
    if (height < 30) {
      this.$emit('setHeight', 0);
    } else {
      this.$emit('setHeight', height);
    }
  }
}
</script>

<style lang="stylus">
.embedded-terminal--body
  color white
  background-color black
</style>
