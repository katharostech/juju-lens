<template>
  <div>
    <!-- TODO: just for clarity's sake find a way to make this just
    `floating-window` instead of `floating-window-component` -->
    <floating-window-component
      class="floating-log-window"
      :title="floatingWindow.unit.name"
      :visible="floatingWindow.visible"
      :maximized="floatingWindow.maximized"
      v-on:maximize="toggleFloatingUnitWindowMaximized(floatingWindowId)"
      v-on:restore="toggleFloatingUnitWindowMaximized(floatingWindowId)"
      v-on:minimize="toggleFloatingUnitWindowVisible(floatingWindowId)"
      v-on:close="removeFloatingUnitWindow(floatingWindowId)"
      icon="fas fa-file-alt"
      :style="{ 'z-index': floatingWindow.zIndex }"
      @click.native="focusFloatingUnitWindow(floatingWindowId)"
    >
      <q-table
        dense
        virtual-scroll
        hide-bottom
        :pagination="{ rowsPerPage: 0 }"
        :data="logEntries"
        :columns="logColumns"
        table-style="box-shadow: none;"
        style="max-height: 100%;"
      />
    </floating-window-component>
  </div>
</template>

<script lang="ts">
import FloatingWindowComponent from 'components/FloatingWindow.vue';

import { Vue, Component, Prop } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

import { date } from 'quasar';

import { FloatingUnitWindow } from 'store/app/state';
import { mutationTypes } from 'store/app/mutations';
import { actionTypes } from 'store/app/actions';
const app = namespace('app');

const randomLogMessages = [
  'The app is doing something...',
  'Oh, no! Something is not right here!',
  // eslint-disable-next-line quotes
  "This is totally not important so don't mind me.",
  'This is a really long log message that repeats itself multiple times. \
  This is a really long log message that repeats itself multiple times. \
  This is a really long log message that repeats itself multiple times. \
  This is a really long log message that repeats itself multiple times. '
];

export interface LogEntry {
  timestamp: number;
  message: string;
}

@Component({
  components: {
    FloatingWindowComponent
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

  get floatingWindow(): FloatingUnitWindow {
    return this.floatingUnitWindows.filter(
      window => window.id == this.floatingWindowId
    )[0];
  }

  logEntries: LogEntry[] = [];
  logColumns = [
    {
      name: 'timestamp',
      label: 'Timestamp',
      field: 'timestamp',
      sortable: true,
      align: 'left',
      format: (stamp: number): string =>
        date.formatDate(stamp, 'YY-MM-DD:HH-MM-ss:SS')
    },
    {
      name: 'message',
      label: 'Message',
      field: 'message',
      sortable: true,
      align: 'left'
    }
  ];

  created(): void {
    // Start streaming fake logs
    setTimeout(
      function log(this: FloatingTerminalWindow) {
        this.logEntries.push({
          timestamp: Date.now(),
          message:
            randomLogMessages[
              Math.floor(Math.random() * randomLogMessages.length)
            ]
        });

        setTimeout(log.bind(this), Math.random() * 1500);
      }.bind(this),
      200
    );
  }
}
</script>

<style lang="stylus"></style>
