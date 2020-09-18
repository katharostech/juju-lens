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
          this.$emit('data', data);
        });

      }, this.startupDelay);
    }
  }

  public focus() {
    this.t?.focus();
  }

  public isReady(): boolean {
    return !!this.t;
  }

  public write(data: any) {
    this.t?.write(data);
  }
}
</script>