<template>
  <div
    ref="termContainer"
    :id="`term-${id}`"
    class="vue-xterm bg-black"
    style="overflow: hidden;"
  >
    <q-resize-observer :debounce="250" @resize="onResize" />
    <div
      class="flex justify-center items-center"
      style="position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 1000000; opacity: 0.8"
      v-if="loading"
    >
      <q-spinner size="10em" color="white" />
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Vue, Component, Prop } from 'vue-property-decorator';

import { uid } from 'quasar';

import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import 'xterm/lib/xterm.js';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
import { getSshKeypair } from 'utils/ssh';

@Component
export default class XTerm extends Vue {
  // TODO: Not the best solution, but the startup delay fixes issues with the
  // floating windows where they don't have a concrete size for a small time
  // frame and the terminal needs the concrete size in order to bind to the div.
  @Prop({ type: Number, default: 0 }) readonly startupDelay!: number;

  // Enable auto-resizing
  @Prop({ type: Boolean, default: false }) readonly autoResize!: boolean;

  // SSH connection parameters
  @Prop({ type: String, default: null }) username!: string | null;
  @Prop({ type: String, default: null }) host!: string | null;
  @Prop({ type: String, default: null }) hostKey!: string | null;

  id = '';

  fitAddon: FitAddon | null = null;
  t: Terminal | null = null;
  session: any | null = null;
  loading = true;

  mounted() {
    this.loadTerm();
  }

  created() {
    this.id = uid();
  }

  onResize() {
    if (this.fitAddon && this.autoResize) {
      this.fitAddon.fit();
      const { cols, rows } = this.fitAddon.proposeDimensions();
      this.session.resize(cols, rows);
    }
  }

  public async start(user: string, host: string, hostKeys: string[]) {
    // Wait for the terminal to be prepared
    await new Promise(resolve =>
      setTimeout(
        function wait(this: XTerm) {
          if (this.t) {
            resolve();
          } else {
            setTimeout(wait.bind(this), 200);
          }
        }.bind(this),
        200
      )
    );

    const keypair = await getSshKeypair();
    this.session = new window.TauriSshSession({
      user,
      host: host.includes(':') ? host : host + ':22',
      publicKey: keypair.public,
      privateKey: keypair.private,
      hostKeys: hostKeys
    });

    this.session.onclose = () => {
      this.$emit('close');
    };

    this.session.onerror = (e: string) => {
      this.$emit('error', e);
    };

    this.t!.onData(data => {
      this.session.send(data);
    });

    // TODO: Handle t.onBinary? ( Only used for certain mouse
    // commands that aren't valid UTF-8, so probably not that
    // important.

    this.session.onmessage = (m: any) => {
      this.t?.write(m);
    };

    this.session
      .connect()
      .then(() => {
        this.loading = false;
        this.$emit('ready');
        // Update terminal size
        this.onResize()
      })
      .catch((e: any) => {
        this.$emit('connect-failure', e);
      });
  }

  loadTerm() {
    if (!this.t) {
      // Wait for the startup delay ( most likely ) to allow the dom to
      // get to a point at which it has concrete dimensions for the
      // terminal to attach to.
      setTimeout(() => {
        this.t = new Terminal();
        this.fitAddon = new FitAddon();
        this.t.loadAddon(this.fitAddon);
        this.t.loadAddon(new WebLinksAddon());

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.t.open(document.getElementById(`term-${this.id}`)!);
        this.t.focus();
        this.fitAddon.fit();
      }, this.startupDelay);
    }
  }

  public focus() {
    this.t?.focus();
  }

  public write(data: any) {
    // We actually want this to error if the terminal is not ready yet.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.t!.write(data);
  }

  public close() {
    this.session?.close();
  }
}
</script>

<style lang="stylus">
.fade-enter-active,
.fade-leave-actie
  transition opacity 0.5s !important

.fade-enter, .fade-leave-to
  opacity 0
</style>
