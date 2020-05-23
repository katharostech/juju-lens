<template>
  <div>
    <floating-window
      title="Debug Window"
      :visible="showDebugWindow"
      :maximized="debugWindowMaximized"
      v-on:maximize="toggleDebugWindowMaximized"
      v-on:restore="toggleDebugWindowMaximized"
      v-on:minimize="toggleDebugWindow"
      :showClose="false"
    >
      <p>Hello World</p></floating-window
    >
  </div>
</template>

<script lang="ts">
import FloatingWindow from 'components/FloatingWindow.vue';

import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    FloatingWindow
  }
})
export default class DebugWindow extends Vue {
  get showDebugWindow(): boolean {
    return this.$store.state.floatingWindows.debugWindow.visible;
  }

  get debugWindowMaximized(): boolean {
    return this.$store.state.floatingWindows.debugWindow.maximized;
  }

  toggleDebugWindow(): void {
    this.$store.commit('floatingWindows/toggleDebugWindow');
  }

  toggleDebugWindowMaximized(): void {
    this.$store.commit('floatingWindows/toggleDebugWindowMaximized');
  }
}
</script>
