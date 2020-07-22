<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin">
      <!-- Heading -->
      <q-card-section>
        <div class="text-h5 q-mb-sm flex items-center justify-left">
          <!-- Edit icon and text -->
          <q-icon name="edit" class="on-left" />
          <span>App Config</span>
        </div>

        <!-- Edit form-->
        <q-form class="q-gutter-md" @submit="onSubmit">
          <!-- buttons example -->
          <q-card-actions align="right">
            <q-btn
              color="positive"
              type="submit"
              label="Save"
              icon="check"
              :loading="loading"
              :disabled="true"
            >
              <q-tooltip content-style="font-size: 0.86em">
                Updating config is not supported yet. Comming soon!
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
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Application } from 'store/juju/state';
import { actionTypes } from 'store/juju/actions';

import { Vue, Component, Prop } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component
export default class AppConfigDialog extends Vue {
  // The controller to edit. If null, we are creating a new controller
  @Prop({ type: Object, default: null })
  readonly app!: Application;

  loading = false;

  get inputColor(): string {
    return this.$q.dark.isActive ? 'secondary' : 'primary';
  }

  // Skeleton example for Quasar Dialog plugin compatible dialog taken from
  // Quasar docs:
  // https://quasar.dev/quasar-plugins/dialog#Invoking-custom-component

  // following method is REQUIRED
  // (don't change its name --> "show")
  show() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.dialog as any).show();

    console.log(this.app);
  }

  // following method is REQUIRED
  // (don't change its name --> "hide")
  hide() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.dialog as any).hide();
  }

  onDialogHide() {
    // required to be emitted
    // when QDialog emits "hide" event
    this.$emit('hide');
  }

  onSubmit() {
    console.warn('TODO');
  }

  onCancelClick() {
    // we just need to hide dialog
    this.hide();
  }
}
</script>
