<template>
  <div>
    <!-- TODO: just for clarity's sake find a way to make this just
    `floating-window` instead of `floating-window-component` -->
    <floating-window-component
      class="floating-terminal-window"
      :title="floatingWindow.unit.name"
      :visible="floatingWindow.visible"
      :maximized="floatingWindow.maximized"
      v-on:maximize="toggleMaximized"
      v-on:restore="toggleMaximized"
      v-on:minimize="toggleFloatingWindowVisible(floatingWindowId)"
      v-on:close="
        removeFloatingUnitWindow(floatingWindowId);
        closeSshConn();
      "
      icon="fas fa-terminal"
      :style="{ 'z-index': floatingWindow.zIndex }"
      @click.native="focusFloatingUnitWindow(floatingWindowId)"
    >
      <div class="fit q-pa-xs bg-black">
        <x-term
          ref="term"
          class="full-height"
          :startupDelay="300"
          :auto-resize="floatingWindow.visible"
          @connect-failure="
            e => {
              $q.notify({
                color: 'negative',
                message: e,
                position: 'bottom-right',
                timeout: 2000
              });
              removeFloatingUnitWindow(floatingWindowId);
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
          @close="removeFloatingUnitWindow(floatingWindowId)"
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

import { FloatingUnitWindow } from 'store/app/state';
import { mutationTypes } from 'store/app/mutations';
import { actionTypes } from 'store/app/actions';
import { FilledModel } from 'store/juju/state/utils';
const app = namespace('app');
const juju = namespace('juju');

@Component({
  components: {
    FloatingWindowComponent,
    XTerm
  }
})
export default class FloatingTerminalWindow extends Vue {
  @Prop(String) floatingWindowId!: string;

  @app.State floatingUnitWindows!: FloatingUnitWindow[];
  @app.Mutation(mutationTypes.toggleFloatingUnitWindowVisible)
  toggleFloatingUnitWindowVisible!: (id: string) => void;
  @app.Mutation(mutationTypes.toggleFloatingUnitWindowMaximized)
  toggleFloatingUnitWindowMaximized!: (id: string) => void;
  @app.Mutation(mutationTypes.focusFloatingUnitWindow)
  focusFloatingUnitWindow!: (id: string) => void;
  @app.Action(actionTypes.removeFloatingUnitWindow)
  removeFloatingUnitWindow!: (id: string) => void;

  @juju.Getter('currentControllerModelsFilled')
  controllerModels!: FilledModel[];

  get floatingWindow(): FloatingUnitWindow {
    return this.floatingUnitWindows.filter(
      window => window.id == this.floatingWindowId
    )[0];
  }

  get model(): FilledModel {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const modelUuid = this.floatingWindow.app['model-uuid'];
    return this.controllerModels.filter(x => x['model-uuid'] == modelUuid)[0];
  }

  toggleMaximized(): void {
    this.toggleFloatingUnitWindowMaximized(this.floatingWindowId);
    // Make sure terminal keeps focus after maximizing
    (this.$refs.term as any).focus();
  }

  onRestore(): void {
    this.toggleFloatingUnitWindowMaximized(this.floatingWindowId);
    (this.$refs.term as any).focus();
  }

  created(): void {
    this.model.conn.conn.facades.sshClient
      .publicKeys({
        entities: [
          {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            tag: `unit-${this.floatingWindow.unit.name.replace('/', '-')}`
          }
        ]
      })
      .then((res: any) => {
        if (res.results[0].error) {
          this.$q.notify({
            color: 'negative',
            message: res.results[0].error.message,
            position: 'bottom-right',
            timeout: 2000
          });
          this.removeFloatingUnitWindow(this.floatingWindowId);
        } else {
          const hostKeys = res.results[0].publicKeys;
          (this.$refs.term as any).start(
            'ubuntu',
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.floatingWindow.unit['public-address'],
            hostKeys
          );
        }
      });
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
