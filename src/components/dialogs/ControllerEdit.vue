<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!-- Heading -->
      <q-card-section>
        <div class="text-h5">
          <span v-if="controller">Edit</span>
          <span v-else>Create</span>
          Controller
        </div>
        <p>Deploy a new controller to a supported cloud.</p>

        <!-- Edit form-->
        <q-form class="q-gutter-md" @submit="onSubmit">
          <q-input
            label="Controller name"
            v-model="name"
            :color="inputColor"
            :rules="[val => !!val || 'Field is required']"
          />
          <div class="row">
            <q-select
              label="Cloud"
              v-model="cloud"
              option-label="name"
              :options="clouds"
              :color="inputColor"
              :rules="[val => !!val || 'Field is required']"
              class="col q-pr-xs"
            />
            <q-select
              label="Region"
              v-model="region"
              option-label="name"
              :disabled="!cloud"
              :options="cloud ? cloud.availableRegions : []"
              :color="inputColor"
              :rules="[val => !!val || 'Field is required']"
              class="col"
            />
          </div>
          <q-select
            label="Cloud Credential"
            v-model="cloudCredential"
            option-label="name"
            :disabled="!cloud"
            :options="
              cloud ? cloudCredentials.filter(x => x.cloudId == cloud.id) : []
            "
            :color="inputColor"
            :rules="[val => !!val || 'Field is required']"
          />

          <!-- buttons example -->
          <q-card-actions align="right">
            <q-btn
              color="positive"
              type="submit"
              :label="controller ? 'Update' : 'Create'"
              :loading="loading"
            />
            <q-btn color="primary" label="Cancel" @click="onCancelClick" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Controller, CloudCredential, Cloud } from 'store/juju/state';
import { mutationTypes } from 'store/juju/mutations';
import { actionTypes } from 'store/juju/actions';

import { uid } from 'quasar';
import { Vue, Component, Prop } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component
export default class ControllerEdit extends Vue {
  // The controller to edit. If null, we are creating a new controller
  @Prop({ type: Object, default: null })
  readonly controller!: Controller | null;

  loading = false;

  // Vuex state
  @juju.State clouds!: Controller[];
  @juju.State cloudCredentials!: CloudCredential[];

  // Vuex mutation
  @juju.Mutation(mutationTypes.setCurrentController) setCurrentController!: (
    ctrlr: Controller
  ) => void;

  // Vuex action
  @juju.Action(actionTypes.addController) addController!: (
    ctrlr: Controller
  ) => Promise<undefined>;

  // TODO: Cloud validator
  name: string | null = null;
  cloud: Cloud | null = null;
  region: string | null = null;
  cloudCredential: CloudCredential | null = null;

  get inputColor(): string {
    return this.$q.dark.isActive ? 'secondary' : 'primary';
  }

  created() {
    if (this.controller == null) {
    }
  }

  // Skeleton example for Quasar Dialog plugin compatible dialog taken from
  // Quasar docs:
  // https://quasar.dev/quasar-plugins/dialog#Invoking-custom-component

  // following method is REQUIRED
  // (don't change its name --> "show")
  show() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.$refs.dialog as any).show();
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
    const controller: Controller = {
      name: this.name!,
      id: uid(),
      cloudId: this.cloud!.id,
      accessLevel: 'admin',
      region: this.region!,
      cloudCredentialId: this.cloudCredential!.id
    };

    // If we are not updating an existing controller
    if (!this.controller) {
      // Create the controller
      this.loading = true;
      this.addController(controller).then(() => {
        // on OK, it is REQUIRED to
        // emit "ok" event (with optional payload)
        // before hiding the QDialog
        this.$emit('ok', controller);

        // then hiding dialog
        this.hide();

        this.loading = false;

        // Switch to the new controller
        this.setCurrentController(controller);
      });
    }
  }

  onCancelClick() {
    // we just need to hide dialog
    this.hide();
  }
}
</script>
