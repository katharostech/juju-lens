<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin column"
      style="width: 60em; max-width: 90vw; max-height: 90vh"
    >
      <!-- Heading -->
      <q-card-section class="column no-wrap" style="max-height: 90vh">
        <div class="text-h5 col-auto q-mb-sm flex items-center justify-left">
          <!-- Edit icon and text -->
          <q-icon name="settings" class="on-left" />
          <span>Settings</span>
          &nbsp;
          <span class="text-weight-light text-caption q-mt-xs">
            Juju Lens v{{ jujuLensVersion }}
          </span>
        </div>

        <!-- Edit form-->
        <div class="q-pa-md col-grow col-shrink scroll">
          <div class="text-h6 q-mb-sm">Juju Lens Settings</div>

          <q-list bordered padding>
            <q-item-label v-if="isTauri" header>Logging</q-item-label>

            <div v-if="isTauri" class="row">
              <q-item
                class="col-12 col-sm-4"
                clickable
                v-ripple
                @click="
                  updateLensLogWindow({
                    minimized: false,
                    activated: true,
                    focus: true,
                  });
                  hide();
                "
              >
                <q-item-section>
                  <q-item-label>Show Logs</q-item-label>
                  <q-item-label caption>
                    Show the Juju Lens app logs. Useful for reporting bugs.
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item class="col-12 col-sm-8" tag="label" v-ripple>
                <q-item-section side top>
                  <q-checkbox v-model="enableTraceLogs" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>Trace Logging</q-item-label>
                  <q-item-label caption>
                    Enable extremely verbose trace logs. WARNING: Enabling trace
                    logs may negatively effect performance so only enable for
                    debugging or error reporting purposes.
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </q-list>
        </div>

        <q-card-actions class="col-auto" align="right">
          <q-btn flat icon="check" label="OK" @click="hide" />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import jujuLensPackageInfo from '../../../package.json';
import { Vue, Component, Watch } from 'vue-property-decorator';

import { setTraceLogsEnabled, getTraceLogsEnabled } from 'utils/logging';

import { mutationTypes } from 'store/app/mutations';
import { namespace } from 'vuex-class';
const app = namespace('app');

@Component
export default class LensSettingsDialog extends Vue {
  @app.Mutation(mutationTypes.updateLensLogWindow)
  updateLensLogWindow!: (options: {
    minimized?: boolean;
    maximized?: boolean;
    activated?: boolean;
    focus?: boolean;
  }) => void;

  jujuLensVersion = jujuLensPackageInfo.version;

  enableTraceLogs = false;
  loaded = false;

  @Watch('enableTraceLogs')
  persistTraceLogSetting(enabled: boolean): void {
    if (this.loaded) {
      setTraceLogsEnabled(enabled);
    }
  }

  created(): void {
    this.enableTraceLogs = getTraceLogsEnabled();
    this.$nextTick(() => {
      this.loaded = true;
    });
  }

  // Skeleton example for Quasar Dialog plugin compatible dialog taken from
  // Quasar docs:
  // https://quasar.dev/quasar-plugins/dialog#Invoking-custom-component

  // following method is REQUIRED
  // (don't change its name --> "show")
  show(): void {
    // Show the dialog
    (this.$refs.dialog as any).show();
  }

  // following method is REQUIRED
  // (don't change its name --> "hide")
  hide(): void {
    (this.$refs.dialog as any).hide();
  }

  onDialogHide(): void {
    // required to be emitted
    // when QDialog emits "hide" event
    this.$emit('hide');
  }

  get isTauri(): boolean {
    return !!window.__TAURI__;
  }
}
</script>
