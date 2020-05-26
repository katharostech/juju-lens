<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
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

          <span>&nbsp;Cloud Credential</span>
        </div>
        <p v-if="!editing">Add a new cloud credential.</p>

        <!-- Edit form-->
        <q-form class="q-gutter-md" @submit="onSubmit">
          <q-input
            label="Credential name"
            v-model="name"
            :color="inputColor"
            :rules="[val => !!val || 'Field is required']"
          />
          <q-select
            label="Cloud"
            v-model="cloud"
            option-label="name"
            :options="clouds"
            :color="inputColor"
            :disable="editing || !!forceCloud"
            :rules="[val => !!val || 'Field is required']"
            lazy-rules
          />

          <p v-if="editing" style="font-size: 0.8rem">
            Leave credentials blank if you only want to change the name. In that
            case the credentials will not be changed.
          </p>

          <q-input
            ref="credentialData"
            v-for="cred in cloud ? cloud.requiredCredentials : []"
            :value="credentialData[cred.key] ? credentialData[cred.key] : ''"
            :key="cred.key"
            :label="cred.label"
            :color="inputColor"
            :rules="[
              val =>
                !(credentialsRequired && !val) ? true : 'Field is required'
            ]"
            :type="cred.isPassword ? 'password' : 'text'"
            :hint="cred.description"
            @input="value => $set(credentialData, cred.key, value)"
            lazy-rules
          />

          <!-- buttons example -->
          <q-card-actions align="right">
            <q-btn
              color="positive"
              type="submit"
              :label="editing ? 'Update' : 'Create'"
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
import { CloudCredential, Cloud } from 'store/juju/state';
import { actionTypes } from 'store/juju/actions';

import { uid } from 'quasar';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component
export default class CloudCredentialEdit extends Vue {
  // The controller to edit. If null, we are creating a new controller
  @Prop({ type: Object, default: null })
  readonly credential!: CloudCredential | null;
  // Force specifying a certain cloud
  @Prop({ type: Object, default: null }) readonly forceCloud!: Cloud | null;

  loading = false;

  // Vuex state
  @juju.State clouds!: Cloud[];
  @juju.State cloudCredentials!: CloudCredential[];

  // Vuex action
  @juju.Action(actionTypes.addCloudCredential) addCloudCredential!: (
    ctrlr: CloudCredential
  ) => Promise<undefined>;
  @juju.Action(actionTypes.updateCloudCredential) updateCloudCredential!: (
    ctrlr: CloudCredential
  ) => Promise<undefined>;

  name: string | null = null;
  cloud: Cloud | null = null;
  credentialData: { [key: string]: string } = {};

  get inputColor(): string {
    return this.$q.dark.isActive ? 'secondary' : 'primary';
  }

  // Get whether or not we are editing instead of creating
  get editing(): boolean {
    return this.credential != null;
  }

  // Clear credentials when you switch the cloud
  @Watch('cloud')
  onCloudChange(): void {
    this.credentialData = {};
  }

  // Helper to check whether or not the credentials are required
  get credentialsRequired(): boolean {
    // credentials are not required if we are editing and you have only changed the name
    return !(
      this.editing &&
      Object.keys(this.credentialData).filter(
        x => !(this.credentialData[x] in ['', null, undefined])
      ).length == 0
    );
  }

  // Skeleton example for Quasar Dialog plugin compatible dialog taken from
  // Quasar docs:
  // https://quasar.dev/quasar-plugins/dialog#Invoking-custom-component

  // following method is REQUIRED
  // (don't change its name --> "show")
  show() {
    if (this.credential) {
      this.name = this.credential.name;
      this.cloud = this.clouds.filter(x => x.id == this.credential!.cloudId)[0];
    } else {
      if (this.forceCloud) {
        this.cloud = this.forceCloud;
      }
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
    // If we are not updating an existing credential
    if (!this.editing) {
      const credential: CloudCredential = {
        name: this.name!,
        id: uid(),
        cloudId: this.cloud!.id,
        credentialData: this.credentialData
      };

      // Create the cloud credential
      this.loading = true;
      this.addCloudCredential(credential).then(() => {
        // on OK, it is REQUIRED to
        // emit "ok" event (with optional payload)
        // before hiding the QDialog
        this.$emit('ok', credential);
        // then hiding dialog
        this.hide();
        this.loading = false;

        this.$q.notify({
          type: 'positive',
          message: `Seccessfully created credential: ${credential.name}.`,
          position: 'bottom-right',
          timeout: 2000
        });
      });

      // If we are editing an existing credentail
    } else {
      const credential: CloudCredential = {
        name: this.name!,
        id: this.credential!.id,
        cloudId: this.credential!.cloudId,
        credentialData: this.credentialsRequired
          ? this.credentialData
          : this.credential!.credentialData
      };

      // Update the controller
      this.loading = true;
      this.updateCloudCredential(credential).then(() => {
        // on OK, it is REQUIRED to
        // emit "ok" event (with optional payload)
        // before hiding the QDialog
        this.$emit('ok', credential);
        // then hiding dialog
        this.hide();
        this.loading = false;

        this.$q.notify({
          type: 'positive',
          message: `Seccessfully updated credential: ${credential.name}.`,
          position: 'bottom-right',
          timeout: 2000
        });
      });
    }
  }

  onCancelClick() {
    // we just need to hide dialog
    this.hide();
  }
}
</script>
