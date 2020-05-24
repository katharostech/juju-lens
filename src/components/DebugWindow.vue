<template>
  <div>
    <floating-window
      title="Debug Window"
      :visible="debugWindow.visible"
      :maximized="debugWindow.maximized"
      v-on:maximize="toggleDebugWindowMaximized"
      v-on:restore="toggleDebugWindowMaximized"
      v-on:minimize="toggleDebugWindow"
      :showClose="false"
      icon="fas fa-bug"
    >
      <p>Hello World</p></floating-window
    >
  </div>
</template>

<script lang="ts">
import FloatingWindow from 'components/FloatingWindow.vue';

import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const floatingWindows = namespace('floatingWindows');

@Component({
  components: {
    FloatingWindow
  }
})
export default class DebugWindow extends Vue {
  @floatingWindows.State debugWindow!: unknown;
  @floatingWindows.Mutation toggleDebugWindow!: unknown;
  @floatingWindows.Mutation toggleDebugWindowMaximized!: unknown;
}
</script>
