<template>
  <div>
    <!-- TODO: just for clarity's sake find a way to make this just
    `floating-window` instead of `floating-window-component` -->
    <floating-window-component
      class="floating-terminal-window"
      :title="floatingWindow.unit.name"
      :visible="floatingWindow.visible"
      :maximized="floatingWindow.maximized"
      v-on:maximize="toggleFloatingWindowMaximized(floatingWindowId)"
      v-on:restore="toggleFloatingWindowMaximized(floatingWindowId)"
      v-on:minimize="toggleFloatingWindowVisible(floatingWindowId)"
      v-on:close="
        removeFloatingWindow(floatingWindowId);
        closeSshConn();
      "
      icon="fas fa-terminal"
      :style="{ 'z-index': floatingWindow.zIndex }"
      @click.native="focusFloatingWindow(floatingWindowId)"
    >
      <div class="fit q-pa-xs bg-black">
        <x-term
          ref="term"
          class="full-height"
          :startupDelay="300"
          :auto-resize="floatingWindow.visible"
          @data="data => log(data)"
          @connect-failure="
            e => {
              $q.notify({
                color: 'negative',
                message: e,
                position: 'bottom-right',
                timeout: 2000
              });
              removeFloatingWindow(floatingWindowId);
            }
          "
          @error="
            e => {
              $q.notify({
                color: 'negative',
                message: e,
                position: 'bottom-right',
                timeout: 2000
              });
            }
          "
          @close="removeFloatingWindow(floatingWindowId)"
        />
      </div>
    </floating-window-component>
  </div>
</template>

<script lang="ts">
import FloatingWindowComponent from 'components/FloatingWindow.vue';
import XTerm from 'components/XTerm.vue';

import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { FloatingWindow } from 'store/app/state';
import { mutationTypes } from 'store/app/mutations';
import { actionTypes } from 'store/app/actions';
const app = namespace('app');

@Component({
  components: {
    FloatingWindowComponent,
    XTerm
  }
})
export default class FloatingTerminalWindow extends Vue {
  @Prop(String) floatingWindowId!: string;
  @Prop(String) termOptions!: object;
  @app.State floatingWindows!: FloatingWindow[];
  @app.Mutation(mutationTypes.toggleFloatingWindowVisible)
  toggleFloatingWindowVisible!: (id: string) => void;
  @app.Mutation(mutationTypes.toggleFloatingWindowMaximized)
  toggleFloatingWindowMaximized!: (id: string) => void;
  @app.Mutation(mutationTypes.focusFloatingWindow)
  focusFloatingWindow!: (id: string) => void;
  @app.Action(actionTypes.removeFloatingWindow)
  removeFloatingWindow!: (id: string) => void;

  log(data: any) {
    console.log(data);
  }

  get floatingWindow(): FloatingWindow {
    return this.floatingWindows.filter(
      window => window.id == this.floatingWindowId
    )[0];
  }

  closeSshConn() {
    (this.$refs.term as any).close();
  }

  @Watch('floatingWindow.visible')
  visibilityChanged(visible: boolean) {
    if (visible) {
      (this.$refs.term as any).focus();
    }
  }
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
