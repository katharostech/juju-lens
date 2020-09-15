<template>
  <!-- A simple component for charm icons that reverts to a "?" icon when the
  charm icon cannot be loaded -->
  <div v-lazy-container="{ selector: 'img' }">
    <img
      :data-src="src"
      data-loading="/CharmIcon/loading-charm-icon.svg"
      data-error="/CharmIcon/broken-charm-icon.svg"
      width="100%"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class CharmIcon extends Vue {
  @Prop(String) readonly src!: string;
}
</script>

<style lang="stylus">
@keyframes spin {
  from   {transform: RotateZ(0deg);}
  to  {transform: RotateZ(360deg)}
}

img
  transition opacity 0.6s

img[lazy=loading]
  opacity 0.5
  animation spin 2s linear infinite
</style>
