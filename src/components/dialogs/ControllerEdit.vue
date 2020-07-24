<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin">
      <!-- Heading -->
      <q-card-section>
        <div class="text-h5 q-mb-sm flex items-center justify-center">
          <!-- Edit icon and text -->
          <q-icon v-if="editing" name="edit" class="on-left" />
          <span v-if="editing">Edit</span>

          <!-- Create icon and text -->
          <q-icon v-if="!editing" name="fas fa-plus" class="on-left" />
          <span v-if="!editing">Add</span>

          <span>&nbsp;Controller</span>
        </div>
        <p v-if="!editing" class="text-center">
          Add an existing controller to Juju Lens
        </p>
        <p v-else class="text-center">Edit controller connection</p>

        <!-- Edit form-->
        <q-form class="q-gutter-md" @submit="onSubmit">
          <q-input
            label="Controller name"
            v-model="name"
            :color="inputColor"
            :rules="[val => !!val || 'Field is required']"
            lazy-rules
          />
          <div class="row">
            <q-input
              class="col-8"
              label="Host"
              v-model="host"
              :color="inputColor"
              :rules="[val => !!val || 'Field is required']"
              lazy-rules
            />
            <q-input
              class="col-4"
              label="Port"
              v-model.number="port"
              type="number"
              :color="inputColor"
              :rules="[val => !!val || 'Field is required']"
              lazy-rules
            />
          </div>
          <q-input
            label="Username"
            v-model="username"
            :color="inputColor"
            :rules="[val => !!val || 'Field is required']"
            lazy-rules
          />
          <q-input
            label="Password"
            v-model="password"
            :color="inputColor"
            :rules="[val => !!val || 'Field is required']"
            lazy-rules
            type="password"
          />

          <!-- buttons example -->
          <q-card-actions align="center">
            <q-btn
              color="positive"
              type="submit"
              :label="controller ? 'Update' : 'Add'"
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
import { Controller } from 'store/juju/state';
import { actionTypes } from 'store/juju/actions';

import { Vue, Component, Prop } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component
export default class ControllerEdit extends Vue {
  // The controller to edit. If null, we are creating a new controller
  @Prop({ type: Object, default: null })
  readonly controller!: Controller | null;
  @Prop({ type: String, default: null })
  readonly controllerName!: string | null;

  loading = false;

  // Vuex state
  @juju.State currentController!: 'All' | string;

  // Vuex actions
  @juju.Action(actionTypes.setCurrentController) setCurrentController!: (
    name: string
  ) => void;
  @juju.Action(actionTypes.deleteController) deleteController!: (
    name: string
  ) => void;

  @juju.Action(actionTypes.updateController) updateController!: ({
    name,
    controller
  }: {
    name: string;
    controller: Controller;
  }) => Promise<undefined>;

  name: string | null = null;
  host: string | null = null;
  port = 443;
  username: string | null = null;
  password: string | null = null;

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
      this.name = this.controllerName;
      this.host = this.controller.host;
      this.port = this.controller.port;
      this.username = this.controller.username;
    }

    (this.$refs.dialog as any).show();
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
    const controller: Controller = {
      host: this.host!,
      port: this.port,
      username: this.username!,
      password: this.password!,
      models: {},
      machines: {},
      applications: {},
      units: {},
      charms: {}
    };

    // If the controller has been re-named, just delete the old one and
    // create a new one
    if (this.controllerName && this.controllerName != this.name) {
      // If the controller is the current controller, set the current controller to
      // the new name
      if (this.currentController == this.controllerName) {
        this.setCurrentController(this.name!);
      }

      // Delete the old controller
      this.deleteController(this.controllerName);
    }

    // Update the controller
    this.loading = true;
    this.updateController({ name: this.name!, controller }).then(() => {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok', controller);

      // then hiding dialog
      this.hide();

      this.loading = false;

      this.$q.notify({
        type: 'positive',
        message: this.editing
          ? `successfully updated controller: ${this.name!}.`
          : `Successfully added controller: ${this.name!}`,
        position: 'bottom-right',
        timeout: 2000
      });
    });
  }

  onCancelClick() {
    // we just need to hide dialog
    this.hide();
  }
}
</script>
