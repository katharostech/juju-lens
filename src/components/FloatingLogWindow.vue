<template>
  <div>
    <!-- TODO: just for clarity's sake find a way to make this just
    `floating-window` instead of `floating-window-component` -->
    <floating-window-component
      class="floating-log-window"
      :title="`${floatingWindow.app.name}/${floatingWindow.unit.index}`"
      :visible="floatingWindow.visible"
      :maximized="floatingWindow.maximized"
      v-on:maximize="toggleFloatingWindowMaximized(floatingWindowId)"
      v-on:restore="toggleFloatingWindowMaximized(floatingWindowId)"
      v-on:minimize="toggleFloatingWindowVisible(floatingWindowId)"
      v-on:close="removeFloatingWindow(floatingWindowId)"
      icon="fas fa-file-alt"
      :style="{ 'z-index': floatingWindow.zIndex }"
      @click.native="focusFloatingWindow(floatingWindowId)"
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

import { FloatingWindow } from 'store/app/state';
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

  logEntries: LogEntry[] = [];
  logColumns = [
    {
      name: 'timestamp',
      label: 'Timestamp',
      field: 'timestamp',
      sortable: true,
      align: 'left',
      format: (stamp: number) => date.formatDate(stamp, 'YY-MM-DD:HH-MM-ss:SS')
    },
    {
      name: 'message',
      label: 'Message',
      field: 'message',
      sortable: true,
      align: 'left'
    }
  ];

  created() {
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
