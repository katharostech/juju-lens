<template>
  <q-inner-loading :showing="showLoading">
    <q-spinner-rings
      size="80%"
      :color="$q.dark.isActive ? 'secondary' : 'primary'"
    />
  </q-inner-loading>
</template>

<script lang="ts">
import { QInnerLoading, QSpinnerRings } from 'quasar';

import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({
  components: {
    QInnerLoading,
    QSpinnerRings
  }
})
export default class JujuLoading extends Vue {
  @Prop(Boolean) readonly loading!: boolean;
  @Prop({ type: Number, default: 300 }) readonly delay!: number;

  showLoading = false;
  showLoadingTimeoutHandle: null | NodeJS.Timeout = null;

  created() {
    this.onLoadingChange(this.loading);
  }

  @Watch('loading')
  onLoadingChange(loading: boolean): void {
    // If we are not loading
    if (!loading) {
      this.showLoading = false;
    }

    // If we are done loading and there is a timeout to clear
    if (!loading && this.showLoadingTimeoutHandle) {
      clearTimeout(this.showLoadingTimeoutHandle);

      // If we are loading and we haven't set the loading timeout yet
    } else if (loading && !this.showLoadingTimeoutHandle) {
      this.showLoadingTimeoutHandle = setTimeout(
        () => (this.showLoading = true),
        this.delay
      );
    }
  }
}
</script>
