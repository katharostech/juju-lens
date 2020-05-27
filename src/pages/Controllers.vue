<template>
  <!-- This is 'absolute fit' so that the loading overlow covers the whole page -->
  <div class="controllers absolute fit flex items-stretch">
    <div class="q-pa-xs fit column">
      <!-- Controllers Toolbar -->
      <q-toolbar class="col-auto row">
        <!-- Tabs -->
        <q-tabs
          inline-label
          :value="tab"
          shrink
          class="q-pa-xs ctrlr-cred-tabs"
        >
          <q-route-tab
            label="Controllers"
            icon="fas fa-server"
            name="controllers"
            :to="{ name: 'controllers' }"
          />
          <q-route-tab
            label="Cloud Credentials"
            icon="fas fa-address-card"
            name="credentials"
            :to="{ name: 'cloud-credentials' }"
          />
        </q-tabs>
        <q-space />
        <q-btn color="positive" icon="fas fa-plus" @click="startCreate()" />
      </q-toolbar>

      <!-- Tab panels -->
      <q-tab-panels
        animated
        v-model="tab"
        style="flex: 1 1 0%; background-color: hsla(0, 0%, 0%, 0);"
      >
        <!-- Controllers panel -->
        <q-tab-panel
          name="controllers"
          class="row content-start q-col-gutter-sm"
        >
          <!-- Mobile heading for tab panel -->
          <div
            class="text-h5 ctrl-cred-tabs-alt-heading col-12 q-mb-sm q-ml-xs"
          >
            Controllers
          </div>

          <!-- Controller Card -->
          <div
            v-for="controller in controllers"
            :key="controller.name"
            class="col-12 col-sm-6 col-md-4"
          >
            <resource-card
              :heading="controller.name"
              headingIcon="fas fa-server"
              :infoItems="[
                {
                  label: controllersCloud(controller),
                  icon: 'cloud'
                },
                {
                  label: controllersCredential(controller),
                  icon: 'fas fa-address-card'
                },
                {
                  label: controller.accessLevel,
                  icon: 'person'
                }
              ]"
              :loading="loadingControllers[controller.id]"
              @delete="deleteController(controller)"
              @edit="startEditController(controller)"
            />
          </div>
        </q-tab-panel>

        <!-- Cloud credentials panel -->
        <q-tab-panel
          name="credentials"
          class="row content-start q-col-gutter-sm"
        >
          <!-- Mobile heading for tab panel -->
          <div
            class="text-h5 ctrl-cred-tabs-alt-heading col-12 q-mb-sm q-ml-xs"
          >
            Cloud Credentials
          </div>

          <!-- Cloud Credential card -->
          <div
            class="col-12 col-sm-6 col-md-4"
            v-for="credential in cloudCredentials"
            :key="credential.name"
          >
            <resource-card
              :heading="credential.name"
              headingIcon="fas fa-address-card"
              :infoItems="[
                {
                  label: credentialsCloud(credential),
                  icon: 'cloud'
                }
              ]"
              :loading="loadingCredentials[credential.id]"
              @delete="deleteCredential(credential)"
              @edit="startEditCredential(credential)"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <juju-loading :loading="loading" />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import ResourceCard from 'components/ResourceCard.vue';
import JujuLoading from 'components/JujuLoading.vue';
import ControllerEdit from 'components/dialogs/ControllerEdit.vue';
import CloudCredentialEdit from 'components/dialogs/CloudCredentialEdit.vue';

import { Component, Vue } from 'vue-property-decorator';

import {
  Controller,
  CloudCredential,
  Cloud,
  UnitStatusSeverity,
  UnitStatusSeverityString
} from 'store/juju/state';
import { actionTypes } from 'store/juju/actions';
import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component({
  components: {
    JujuLoading,
    ResourceCard
  }
})
export default class Controllers extends Vue {
  // State
  @juju.State controllers!: Controller[];
  @juju.State cloudCredentials!: CloudCredential[];
  @juju.State clouds!: Cloud[];

  // Load actions
  @juju.Action(actionTypes.loadAllState) loadAllState!: () => Promise<
    undefined
  >;

  // Delete actions
  @juju.Action(actionTypes.deleteController) runDeleteController!: (
    name: string
  ) => Promise<undefined>;
  @juju.Action(actionTypes.deleteCloudCredential) runDeleteCredential!: (
    name: string
  ) => Promise<undefined>;

  get tab(): string {
    if (this.$route.name == 'controllers') {
      return 'controllers';
    } else {
      return 'credentials';
    }
  }

  loading = false;
  // The list of controllers that are loading
  loadingControllers: { [key: string]: boolean } = {};
  loadingCredentials: { [key: string]: boolean } = {};

  created(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    this.loadAllState().then(() => {
      this.loading = false;
    });
  }

  // Create a controller or a credential ( based on the current tab )
  startCreate(): void {
    if (this.tab == 'controllers') {
      this.$q.dialog({
        component: ControllerEdit,
        parent: this
      });
    } else if (this.tab == 'credentials') {
      this.$q.dialog({
        component: CloudCredentialEdit,
        parent: this
      });
    }
  }

  // Show the dialog to edit a controller
  startEditController(controller: Controller): void {
    this.$q.dialog({
      component: ControllerEdit,
      parent: this,
      controller
    });
  }

  // Show the dialog to edit a credential
  startEditCredential(credential: CloudCredential): void {
    this.$q.dialog({
      component: CloudCredentialEdit,
      parent: this,
      credential
    });
  }

  deleteController(controller: Controller): void {
    // Prompt for controller deletion
    this.$q
      .dialog({
        title: 'Are you sure?',
        message: `Are you sure you want to delete controller ${controller.name}?`,
        persistent: true,
        cancel: true,
        ok: {
          label: 'delete',
          color: 'negative'
        }
      })
      .onOk(() => {
        this.$set(this.loadingControllers, controller.id, true);
        this.runDeleteController(controller.id).then(() => {
          this.$set(this.loadingControllers, controller.id, false);
          this.$q.notify({
            type: 'positive',
            message: `successfully deleted controller: ${controller.name}.`,
            position: 'bottom-right',
            timeout: 2000
          });
        });
      });
  }

  deleteCredential(credential: CloudCredential): void {
    // Prompt for credential deletion
    this.$q
      .dialog({
        title: 'Are you sure?',
        message: `Are you sure you want to delete credential ${credential.name}?`,
        persistent: true,
        cancel: true,
        ok: {
          label: 'delete',
          color: 'negative'
        }
      })
      .onOk(() => {
        this.$set(this.loadingCredentials, credential.id, true);
        this.runDeleteCredential(credential.id).then(() => {
          this.$set(this.loadingCredentials, credential.id, false);
          this.$q.notify({
            type: 'positive',
            message: `successfully deleted credential: ${credential.name}.`,
            position: 'bottom-right',
            timeout: 2000
          });
        });
      });
  }

  //
  // Helpers
  //

  // Get the name of a credential's cloud
  credentialsCloud(credential: CloudCredential): string {
    const filtered = this.clouds.filter(x => x.id == credential.cloudId);

    return filtered[0] ? filtered[0].name : '';
  }

  // Get the name of the controller's credential
  controllersCredential(controller: Controller): string {
    const filtered = this.cloudCredentials.filter(
      x => x.id == controller.cloudCredentialId
    );

    return filtered[0] ? filtered[0].name : '';
  }

  // Get the name of the controller's cloud
  controllersCloud(controller: Controller): string {
    const filtered = this.clouds.filter(x => x.id == controller.cloudId);

    return filtered[0] ? filtered[0].name : '';
  }
}
</script>

<style lang="stylus">
.controllers
  $ctrlr-cred-tabs-breakpoint=476px

  // Small screen use only icons without labels
  @media(max-width: $ctrlr-cred-tabs-breakpoint)
    .ctrlr-cred-tabs
      .q-tab__label
        display none

  // Large screen use only labels without tabs
  @media(min-width: $ctrlr-cred-tabs-breakpoint)
    // I think I changed my mind about hiding the icon on large screens
    // .ctrlr-cred-tabs
    //   .q-tab__icon
    //     display none

    .ctrl-cred-tabs-alt-heading
      display: none
</style>
