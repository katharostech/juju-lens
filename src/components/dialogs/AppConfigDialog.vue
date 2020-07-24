<template>
  <q-dialog ref="dialog" @hide="onDialogHide" :persistent="hasChanges">
    <q-card
      class="q-dialog-plugin column"
      style="width: 60em; max-width: 90vw; max-height: 90vh"
    >
      <!-- Heading -->
      <q-card-section class="column no-wrap" style="max-height: 90vh">
        <div class="text-h5 col-auto q-mb-sm flex items-center justify-left">
          <!-- Edit icon and text -->
          <q-icon name="edit" class="on-left" />
          <span>App Config</span>
        </div>

        <!-- Edit form-->
        <q-form
          class="q-gutter-md col column no-wrap scroll"
          @submit="onSubmit"
        >
          <div class="q-pa-md col-grow col-shrink scroll">
            <template v-for="(configData, configName) in config">
              <!-- Checkbox field -->
              <template v-if="configData.type == 'boolean'">
                <q-item tag="label" v-ripple :key="configName">
                  <q-item-section>
                    <q-item-label>{{ configName }}</q-item-label>
                    <q-item-label caption>
                      {{
                        `${configData.description} — Default: ${
                          configData.default && configData.default.length > 25
                            ? configData.default.substr(0, 100) + '...'
                            : configData.default || '[empty]'
                        }`
                      }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section avatar top>
                    <q-checkbox
                      :color="inputColor"
                      v-model="configData.value"
                    />
                  </q-item-section>
                </q-item>
              </template>
              <template v-else>
                <!-- Text or number field -->
                <q-item tag="label" :key="configName">
                  <q-item-section>
                    <q-item-label>{{ configName }}</q-item-label>
                    <q-item-label caption>
                      {{
                        `${configData.description} — Default: ${
                          configData.default && configData.default.length > 25
                            ? configData.default.substr(0, 100) + '...'
                            : configData.default || '[empty]'
                        }`
                      }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <!-- TODO: Autogrow causes a noticable delay showing the
                    dialog window on certain charms with excessive config such
                    as postgresql. Not sure if there is a good way around that.
                    -->
                    <q-input
                      :color="inputColor"
                      :autogrow="configData.type == 'string'"
                      :placeholder="configName"
                      :value="configData.value"
                      v-model="configData.value"
                      :type="configData.type == 'string' ? 'textarea' : ''"
                      :rules="[
                        val =>
                          configData.type == 'int'
                            ? strictCheckInt(val) || 'Must be a valid integer'
                            : true,
                        val =>
                          configData.type == 'float'
                            ? strictCheckFloat(val) || 'Must be a valid number'
                            : true
                      ]"
                    />
                  </q-item-section>
                </q-item>
                <!-- TODO: Enum fields -->
              </template>
            </template>

            <div v-if="Object.keys(config).length < 1" class="text-body1">
              This application has no config.
            </div>
          </div>

          <!-- buttons example -->
          <q-card-actions class="col-auto" align="right">
            <q-btn
              color="positive"
              type="submit"
              label="Save"
              icon="check"
              :loading="saveLoading"
              :disabled="Object.keys(config).length < 1 || !hasChanges"
            >
              <q-tooltip v-if="!hasChanges">
                There are no changes to save.
              </q-tooltip>
            </q-btn>
            <q-btn
              color="primary"
              icon="cancel"
              label="Cancel"
              @click="onCancelClick"
            />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { Application } from 'store/juju/state';

import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
import { FilledModel } from 'store/juju/state/utils';
const juju = namespace('juju');

async function sleep(interval: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(function() {
      resolve();
    }, interval);
  });
}

@Component
export default class AppConfigDialog extends Vue {
  // The controller to edit. If null, we are creating a new controller
  @Prop({ type: Object, default: null })
  readonly app!: Application;

  @juju.Getter('currentControllerModelsFilled')
  controllerModels!: FilledModel[];

  // Indicates whether the save button is loading
  saveLoading = false;

  // Indicates whether or not there have been changes to the config
  hasChanges = false;
  // The application config
  config: {
    [key: string]: {
      default?: any;
      type: string;
      value: any;
      description: string;
    };
  } = {};

  @Watch('config', { deep: true })
  onConfigChange(): void {
    this.hasChanges = true;
  }

  get inputColor(): string {
    return this.$q.dark.isActive ? 'secondary' : 'primary';
  }

  get model(): FilledModel {
    const modelUuid = this.app['model-uuid'];
    return this.controllerModels.filter(x => x['model-uuid'] == modelUuid)[0];
  }

  /** Stricter int parse function that won't allow letters in the input */
  strictCheckInt(value: string) {
    return /^[-+]?(\d+)$/.test(value);
  }

  /** Stricter float parse function that won't allow letters in the input */
  strictCheckFloat(value: string) {
    return /^[-+]?(\d+(\.\d+)?)$/.test(value);
  }

  // Skeleton example for Quasar Dialog plugin compatible dialog taken from
  // Quasar docs:
  // https://quasar.dev/quasar-plugins/dialog#Invoking-custom-component

  // following method is REQUIRED
  // (don't change its name --> "show")
  async show() {
    // postgresql charm config.
    (this.$refs.dialog as any).show();

    // Wait for model connection
    while (true) {
      if (!this.model.conn) {
        await sleep(500);
      } else {
        break;
      }
    }

    // Set the config
    this.config = (
      await this.model.conn.conn.facades.application.getConfig({
        entities: [{ tag: `application-${this.app.name}` }]
      })
    ).results[0].config;

    // Set the config as unchanged
    Vue.nextTick(() => {
      this.hasChanges = false;
    });
  }

  // following method is REQUIRED
  // (don't change its name --> "hide")
  hide() {
    (this.$refs.dialog as any).hide();
  }

  onDialogHide() {
    // required to be emitted
    // when QDialog emits "hide" event
    this.$emit('hide');
  }

  onSubmit() {
    // Create KV mapping of config values
    const configKv: { [key: string]: any } = {};
    for (const key of Object.keys(this.config)) {
      configKv[key] = (this.config[key].value || '').toString();
    }

    this.saveLoading = true;

    // Set the application config
    this.model.conn.conn.facades.application
      .setApplicationsConfig({
        args: [
          {
            application: this.app.name,
            config: configKv
          }
        ]
      })
      .then((result: any) => {
        // Report any erros
        if (result.results[0].error) {
          console.error(result.results[0].error);

          this.$q.notify({
            type: 'negative',
            message: `Error updating app config: ${result.results[0].error.message}`,
            position: 'bottom-right',
            timeout: 2000
          });

          this.hide();
          return;
        }

        // Report success
        this.$q.notify({
          type: 'positive',
          message: 'Application config updated',
          position: 'bottom-right',
          timeout: 1000
        });

        // Close the dialog
        this.hide();
      })
      .catch((err: any) => {
        // Report the error
        console.error(err);
        this.$q.notify({
          type: 'negative',
          message: `Error updating app config: ${err}`,
          position: 'bottom-right',
          timeout: 2000
        });

        // Close the dialog
        this.hide();
      });
  }

  onCancelClick() {
    // we just need to hide dialog
    this.hide();
  }
}
</script>
