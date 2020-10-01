<template>
  <div>
    <!-- TODO: Handle animating the window out of the screen when you close it -->
    <floating-window
      title="Juju Lens Logs"
      :visible="!lensLogWindow.minimized"
      :maximized="lensLogWindow.maximized"
      v-on:maximize="updateLensLogWindow({ maximized: true })"
      v-on:restore="
        updateLensLogWindow({ maximized: !lensLogWindow.maximized })
      "
      v-on:minimize="updateLensLogWindow({ minimized: true })"
      v-on:close="updateLensLogWindow({ activated: false })"
      @click.native="updateLensLogWindow({ focus: true })"
      :style="{ 'z-index': lensLogWindow.zIndex }"
      icon="fas fa-file-alt"
    >
      <div class="fit q-pa-xs bg-black">
        <x-term
          ref="term"
          class="full-height q-mr-xs"
          :startupDelay="300"
          :auto-resize="!lensLogWindow.minimized"
          @ready="streamLogs"
        />
      </div>
    </floating-window>
  </div>
</template>

<script lang="ts">
import FloatingWindow from 'components/FloatingWindow.vue';
import XTerm from 'components/XTerm.vue';

import { LensLogWindowState } from 'store/app/state';
import { mutationTypes } from 'store/app/mutations';

import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const app = namespace('app');

@Component({
  components: {
    FloatingWindow,
    XTerm
  }
})
export default class LensLogWindow extends Vue {
  @app.State lensLogWindow!: LensLogWindowState;
  @app.Mutation(mutationTypes.updateLensLogWindow)
  updateLensLogWindow!: (options: {
    minimized?: boolean;
    maximized?: boolean;
    activated?: boolean;
    focus?: boolean;
  }) => void;

  async streamLogs(): Promise<void> {
    console.log('ready');
    (this.$refs.term as any).write(
      (await window.tauriLoggingGetLogs())
        .map(this.formatLog.bind(this))
        .join('')
    );
    const subscriber = new window.TauriLoggingSubscriber();
    subscriber.onmessage = (m: any) =>
      (this.$refs.term as any).write(this.formatLog(m));
  }

  formatLog(record: any): string {
    return `${this.formatDate(record.timestamp)} ${this.formatLevel(
      record.level
    )} \x1B[0m${record.message} ${Object.entries(record.fields)
      .map(([key, value]) => `${key} = ${JSON.stringify(value)}`)
      .join(' ')}\n\r`;
  }

  formatLevel(level: string) {
    if (level == 'trace') {
      return '\x1B[35m' + level;
    } else if (level == 'debug') {
      return '\x1B[34m' + level;
    } else if (level == 'info') {
      return '\x1B[32m' + level;
    } else if (level == 'warn') {
      return '\x1B[33m' + level;
    } else if (level == 'error') {
      return '\x1B[31m' + level;
    }
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    let seconds = date.getSeconds().toString();
    seconds = seconds.length == 1 ? '0' + seconds : seconds;

    let minutes = date.getMinutes().toString();
    minutes = minutes.length == 1 ? '0' + minutes : minutes;

    let hours = date.getHours().toString();
    hours = hours.length == 1 ? '0' + hours : hours;

    let dayOfMonth = date.getDate().toString();
    dayOfMonth = dayOfMonth.length == 1 ? '0' + dayOfMonth : dayOfMonth;

    const month = months[date.getMonth()];

    return `\x1B[2m${month} ${dayOfMonth} ${hours}:${minutes}:${seconds}`;
  }
}
</script>
