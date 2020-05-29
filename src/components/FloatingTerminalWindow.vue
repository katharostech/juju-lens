<template>
  <div>
    <!-- TODO: just for clarity's sake find a way to make this just
    `floating-window` instead of `floating-window-component` -->
    <floating-window-component
      class="floating-terminal-window"
      :title="`${floatingWindow.app.name}/${floatingWindow.unit.index}`"
      :visible="floatingWindow.visible"
      :maximized="floatingWindow.maximized"
      v-on:maximize="toggleFloatingWindowMaximized(floatingWindowId)"
      v-on:restore="toggleFloatingWindowMaximized(floatingWindowId)"
      v-on:minimize="toggleFloatingWindowVisible(floatingWindowId)"
      v-on:close="removeFloatingWindow(floatingWindowId)"
      icon="fas fa-terminal"
      :style="{ 'z-index': floatingWindow.zIndex }"
      @click.native="focusFloatingWindow(floatingWindowId)"
    >
      <!-- Terminal Body -->
      <div class="floating-terminal-window--terminal fit q-pa-xs">
        <q-input
          v-model="termText"
          square
          autogrow
          type="textarea"
          style="width: 100% height: 100%;"
        />
      </div>
    </floating-window-component>
  </div>
</template>

<script lang="ts">
import FloatingWindowComponent from 'components/FloatingWindow.vue';

import { Vue, Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { FloatingWindow } from 'store/app/state';
import { mutationTypes } from 'store/app/mutations';
import { actionTypes } from 'store/app/actions';
const app = namespace('app');

@Component({
  components: {
    FloatingWindowComponent
  }
})
export default class FloatingTerminalWindow extends Vue {
  @Prop(String) floatingWindowId!: string;
  @app.State floatingWindows!: FloatingWindow[];
  @app.Mutation(mutationTypes.toggleFloatingWindowVisible)
  toggleFloatingWindowVisible!: (id: string) => void;
  @app.Mutation(mutationTypes.toggleFloatingWindowMaximized)
  toggleFloatingWindowMaximized!: (id: string) => void;
  @app.Mutation(mutationTypes.focusFloatingWindow)
  focusFloatingWindow!: (id: string) => void;
  @app.Action(actionTypes.removeFloatingWindow)
  removeFloatingWindow!: (id: string) => void;

  get floatingWindow(): FloatingWindow {
    return this.floatingWindows.filter(
      window => window.id == this.floatingWindowId
    )[0];
  }

  termText = 'ubuntu@host $ ';
}
</script>

<style lang="stylus">
.floating-terminal-window--terminal
  background-color black
  font-family 'Courier New', Courier, monospace

  textarea
    color white
    padding 0 !important
</style>
