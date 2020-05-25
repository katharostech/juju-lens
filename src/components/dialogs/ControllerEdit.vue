<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <!-- Heading -->
      <q-card-section>
        <div class="text-h5 q-mb-sm flex items-center">
          <!-- Edit icon and text -->
          <q-icon v-if="editing" name="edit" class="on-left" />
          <span v-if="editing">Edit</span>

          <!-- Create icon and text -->
          <q-icon v-if="!editing" name="fas fa-plus" class="on-left" />
          <span v-if="!editing">Create</span>

          <span>&nbsp;Controller</span>
        </div>
        <p v-if="!editing">Deploy a new controller to a supported cloud.</p>

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
              :disable="editing"
              :rules="[val => !!val || 'Field is required']"
              class="col q-pr-xs"
            />
            <q-select
              label="Region"
              v-model="region"
              option-label="name"
              :disable="!cloud || editing"
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
            :disable="!cloud || editing"
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
              :icon="editing ? 'check' : 'fas fa-plus'"
              :loading="loading"
            />
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
  @juju.State clouds!: Cloud[];
  @juju.State cloudCredentials!: CloudCredential[];

  // Vuex mutation
  @juju.Mutation(mutationTypes.setCurrentController) setCurrentController!: (
    ctrlr: Controller
  ) => void;

  // Vuex action
  @juju.Action(actionTypes.addController) addController!: (
    ctrlr: Controller
  ) => Promise<undefined>;
  @juju.Action(actionTypes.updateController) updateController!: (
    ctrlr: Controller
  ) => Promise<undefined>;

  name: string | null = null;
  cloud: Cloud | null = null;
  region: string | null = null;
  cloudCredential: CloudCredential | null = null;

  get inputColor(): string {
    return this.$q.dark.isActive ? 'secondary' : 'primary';
  }

  // Get whether or not we are editing instead of creating
  get editing(): boolean {
    return this.controller != null;
  }

  // Skeleton example for Quasar Dialog plugin compatible dialog taken from
  // Quasar docs:
  // https://quasar.dev/quasar-plugins/dialog#Invoking-custom-component

  // following method is REQUIRED
  // (don't change its name --> "show")
  show() {
    if (this.controller) {
      this.name = this.controller.name;
      this.cloud = this.clouds.filter(x => x.id == this.controller!.cloudId)[0];
      this.region = this.controller.region;
      this.cloudCredential = this.cloudCredentials.filter(
        x => x.id == this.controller!.cloudCredentialId
      )[0];
    }

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
    // If we are not updating an existing controller
    if (!this.editing) {
      const controller: Controller = {
        name: this.name!,
        id: uid(),
        cloudId: this.cloud!.id,
        accessLevel: 'admin',
        region: this.region!,
        cloudCredentialId: this.cloudCredential!.id
      };

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

      // If we are editing an existing controller
    } else {
      const controller: Controller = {
        name: this.name!,
        id: this.controller!.id,
        cloudId: this.cloud!.id,
        accessLevel: this.controller!.accessLevel,
        region: this.region!,
        cloudCredentialId: this.cloudCredential!.id
      };

      // Update the controller
      this.loading = true;
      this.updateController(controller).then(() => {
        // on OK, it is REQUIRED to
        // emit "ok" event (with optional payload)
        // before hiding the QDialog
        this.$emit('ok', controller);

        // then hiding dialog
        this.hide();

        this.loading = false;
      });
    }
  }

  onCancelClick() {
    // we just need to hide dialog
    this.hide();
  }
}
</script>
