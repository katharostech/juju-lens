<template>
  <div
    class="badge q-px-xs"
    :style="{
      left: left ? '-0.25rem' : undefined,
      right: !left ? '-0.25rem' : undefined
    }"
  >
    <slot name="default" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Badge extends Vue {
  @Prop(Boolean) readonly left!: string | undefined;
}
</script>

<style lang="stylus">
.badge
  border-radius 2px
  position absolute
  font-size 0.8em
  top -0.3rem
  line-height 1rem
</style>
