<template>
  <div :id="`term-${id}`" class="vue-xterm bg-black" style="overflow: hidden;">
    <q-resize-observer :debounce="250" @resize="onResize" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import { uid } from 'quasar';

import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import 'xterm/lib/xterm.js';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
import { getSshKeypair } from 'utils/ssh';

@Component
export default class TestTerm extends Vue {
  // TODO: Not the best solution, but the startup delay fixes issues with the
  // floating windows where they don't have a concrete size for a small time
  // frame and the terminal needs the concrete size in order to bind to the div.
  @Prop({ type: Number, default: 0 }) readonly startupDelay!: number;

  // Enable auto-resizing
  @Prop({ type: Boolean, default: false }) readonly autoResize!: boolean;

  id = '';

  fitAddon: FitAddon | null = null;
  t: Terminal | null = null;
  session: any = null;

  created() {
    this.id = uid();
  }

  async mounted(): Promise<void> {
    await this.loadTerm();
  }

  onResize() {
    if (this.fitAddon && this.autoResize) {
      this.fitAddon.fit();
      const { cols, rows } = this.fitAddon.proposeDimensions();
      this.session.resize(cols, rows);
    }
  }

  async loadTerm(): Promise<void> {
    if (!this.t) {
      const keypair = await getSshKeypair();
      this.$q
        .dialog({
          title: 'Username',
          message: 'Connection username',
          prompt: {
            label: 'username',
            model: 'vagrant',
            type: 'text' // optional
          },
          persistent: true
        })
        .onOk((user: string) => {
          this.$q
            .dialog({
              title: 'Host',
              message: 'Connection host:port',
              prompt: {
                label: 'host',
                model: '127.0.0.1',
                type: 'text' // optional
              },
              persistent: true
            })
            .onOk((host: string) => {
              this.session = new window.TauriSshSession({
                user,
                host: host.includes(':') ? host : host + ':22',
                publicKey: keypair.public,
                privateKey: keypair.private
              });

              this.session.onclose = () => {
                this.$emit('close');
              };

              this.session.onerror = (e: string) => {
                this.$emit('error', e);
              };

              // Wait for the startup delay ( most likely ) to allow the dom to get to a point
              // at which it has concrete dimensions for the terminal to attach to.
              setTimeout(() => {
                this.t = new Terminal();
                this.fitAddon = new FitAddon();
                this.t.loadAddon(this.fitAddon);
                this.t.loadAddon(new WebLinksAddon());

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.t.open(document.getElementById(`term-${this.id}`)!);
                this.t.focus();
                this.fitAddon.fit();

                this.t.onData(data => {
                  this.session.send(data);
                });

                this.session.onmessage = (m: any) => {
                  this.t?.write(m);
                };

                this.session
                  .connect()
                  .then(() => {
                    this.$emit('ready');
                  })
                  .catch((e: any) => {
                    this.$emit('connect-failure', e);
                  });
              }, this.startupDelay);
            });
        });
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
    this.session.close();
  }
}
</script>
