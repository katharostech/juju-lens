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

  created() {
    this.id = uid();
  }

  mounted(): void {
    this.loadTerm();
  }

  onResize() {
    if (this.fitAddon && this.autoResize) {
      this.fitAddon.fit();
    }
  }

  loadTerm(): void {
    if (!this.t) {
      // Wait 100 milis before attaching terminal to make sure it gets a concrete height
      setTimeout(() => {
        this.t = new Terminal();
        this.fitAddon = new FitAddon();
        this.t.loadAddon(this.fitAddon);
        this.t.loadAddon(new WebLinksAddon());

        (this.t as any).prompt = () => {
          this.t?.write('\r\n$ ');
        };

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.t.open(document.getElementById(`term-${this.id}`)!);
        this.t.focus();
        this.fitAddon.fit();

        this.t.writeln('Welcome to xterm.js');
        this.t.writeln(
          'This is a local terminal emulation, without a real terminal in the back-end.'
        );
        this.t.writeln('Type some keys and commands to play around.');
        this.t.writeln('');
        (this.t as any).prompt();

        this.t.onKey((e: { key: string; domEvent: KeyboardEvent }) => {
          const ev = e.domEvent;
          const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

          if (ev.keyCode === 13) {
            (this.t as any).prompt();
          } else if (ev.keyCode === 8) {
            // Do not delete the prompt
            if ((this.t as any)._core.buffer.x > 2) {
              this.t?.write('\b \b');
            }
          } else if (printable) {
            this.t?.write(e.key);
          }
        });
      }, this.startupDelay);
    }
  }

  public focus() {
    this.t?.focus();
  }
}
</script>
