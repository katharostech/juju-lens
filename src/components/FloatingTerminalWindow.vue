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
      v-on:minimize="toggleFloatingUnitWindowVisible(floatingWindowId)"
      v-on:close="
        close();
        removeFloatingUnitWindow(floatingWindowId);
      "
      icon="fas fa-terminal"
      :style="{ 'z-index': floatingWindow.zIndex }"
      @click.native="focusFloatingUnitWindow(floatingWindowId)"
    >
      <div class="fit q-pa-xs bg-black">
        <x-term
          ref="term"
          class="full-height q-pr-xs"
          :startupDelay="300"
          :auto-resize="floatingWindow.visible"
          :loading="loading"
          @ready="connect"
          @data="onData"
          @resize="onResize"
        />
      </div>
    </floating-window-component>
  </div>
</template>

<script lang="ts">
import FloatingWindowComponent from 'components/FloatingWindow.vue';
import XTerm from 'components/XTerm.vue';

import { getSshKeypair } from 'utils/ssh';
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

  session: any | null = null;
  loading = true;

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

  connect(): void {
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
          console.error(res.results[0].error.message);
          this.$q.notify({
            color: 'negative',
            message: res.results[0].error.message,
            position: 'bottom-right',
            timeout: 2000
          });
          this.removeFloatingUnitWindow(this.floatingWindowId);
        } else {
          const hostKeys = res.results[0].publicKeys;
          this.openSession(
            'ubuntu',
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.floatingWindow.unit['public-address'],
            hostKeys
          ).catch(e => {
            console.error(e);
            this.$q.notify({
              color: 'negative',
              message: e,
              position: 'bottom-right',
              timeout: 2000
            });
            this.removeFloatingUnitWindow(this.floatingWindowId);
          });
        }
      });
  }

  public async openSession(user: string, host: string, hostKeys: string[]) {
    const keypair = await getSshKeypair();
    this.session = new window.TauriSshSession({
      user,
      host: host.includes(':') ? host : host + ':22',
      publicKey: keypair.public,
      privateKey: keypair.private,
      hostKeys: hostKeys
    });

    this.session.onclose = () => {
      this.removeFloatingUnitWindow(this.floatingWindowId);
    };

    this.session.onerror = (e: string) => {
      console.error(e);
      this.$q.notify({
        color: 'negative',
        message: e,
        position: 'bottom-right',
        timeout: 2000
      });
    };

    // TODO: Handle t.onBinary? ( Only used for certain mouse
    // commands that aren't valid UTF-8, so probably not that
    // important.

    this.session.onmessage = (m: any) => {
      (this.$refs.term as any).write(m);
    };

    this.session
      .connect()
      .then(() => {
        this.loading = false;
        // Update terminal size
        this.onResize((this.$refs.term as any).getDimensions());
      })
      .catch((e: any) => {
        console.error(e);
        this.$q.notify({
          color: 'negative',
          message: e,
          position: 'bottom-right',
          timeout: 2000
        });
        this.removeFloatingUnitWindow(this.floatingWindowId);
      });
  }

  close() {
    this.session?.close();
  }

  onData(data: any): void {
    this.session?.send(data);
  }

  onResize({ rows, cols }: { rows: number; cols: number }): void {
    this.session?.resize(cols, rows);
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
