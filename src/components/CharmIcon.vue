<template>
  <!-- A simple component for charm icons that reverts to a "?" icon when the
  charm icon cannot be loaded -->
  <q-img :src="src">
    <template v-slot:error>
      <img
        src="./CharmIcon/broken-charm-icon.svg"
        style="max-width: 100%; max-height: 100%; width: 100%; height: 100%"
      />
    </template>
    <slot name="default" />
  </q-img>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class CharmIcon extends Vue {
  @Prop(String) readonly src!: string;
}
</script>
