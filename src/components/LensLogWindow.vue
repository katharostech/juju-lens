<template>
  <div>
    <floating-unit-window
      title="Debug Window"
      :visible="!lensLogWindow.minimized"
      :maximized="lensLogWindow.maximized"
      v-on:maximize="updateLensLogWindow({ maximized: true })"
      v-on:restore="
        updateLensLogWindow({ maximized: !lensLogWindow.maximized })
      "
      v-on:minimize="updateLensLogWindow({ minimized: true })"
      v-on:close="updateLensLogWindow({ activated: false })"
      icon="fas fa-file-alt"
    >
      <p>Hello World</p>
    </floating-unit-window>
  </div>
</template>

<script lang="ts">
import FloatingUnitWindow from 'components/FloatingWindow.vue';

import { LensLogWindowState } from 'store/app/state';
import { mutationTypes } from 'store/app/mutations';

import { Vue, Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const app = namespace('app');

@Component({
  components: {
    FloatingUnitWindow
  }
})
export default class LensLogWindow extends Vue {
  @app.State lensLogWindow!: LensLogWindowState;
  @app.Mutation(mutationTypes.updateLensLogWindow)
  updateLensLogWindow!: (options: {
    minimized?: boolean;
    maximized?: boolean;
    activated?: boolean;
  }) => void;
}
</script>
