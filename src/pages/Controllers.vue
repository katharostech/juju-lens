<template>
  <!-- This is 'absolute fit' so that the loading overlow covers the whole page -->
  <div class="controllers absolute fit flex items-stretch">
    <div class="q-pa-xs fit column">
      <!-- Controllers Toolbar -->
      <q-toolbar class="col-auto row">
        <!-- Tabs -->
        <q-tabs
          inline-label
          v-model="tab"
          shrink
          class="q-pa-xs ctrlr-cred-tabs"
        >
          <q-tab label="Controllers" icon="fas fa-server" name="controllers" />
          <q-tab
            label="Cloud Credentials"
            icon="fas fa-address-card"
            name="credentials"
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
          transition-next="tab-trans"
          transition-prev="tab-trans"
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
            <q-card>
              <q-card-section>
                <!-- Card Heading -->
                <div class="row items-center">
                  <div class="col-grow" style="flex: 1 1 0%">
                    <!-- Controller name -->
                    <div class="text-h6 ellipsis">
                      <q-icon name="fas fa-server" class="on-left" />
                      {{ controller.name }}
                    </div>
                    <div class="text-subtitle2 row">
                      <!-- Controller cloud -->
                      <div class="q-mr-sm">
                        <q-icon name="cloud" size="1em" class="q-ma-xs" />
                        {{ controllersCloud(controller) }}
                      </div>
                      <!-- Controller credential -->
                      <div v-if="cloudCredentials" class="q-mr-sm">
                        <q-icon
                          name="fas fa-address-card"
                          size="1em"
                          class="q-ma-xs"
                        />
                        {{ controllersCredential(controller) }}
                      </div>
                      <!-- Controller access level -->
                      <div class="q-mr-sm">
                        <q-icon name="person" size="1em" class="q-ma-xs" />
                        {{ controller.accessLevel }}
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-btn flat round icon="more_vert">
                      <!-- Card action menu -->
                      <q-menu
                        anchor="center right"
                        self="center left"
                        :offset="[10, 0]"
                        style="font-size: 1em"
                      >
                        <q-item
                          clickable
                          v-close-popup
                          class="bg-primary text-white"
                          @click="startEditController(controller)"
                        >
                          <q-item-section avatar>
                            <q-icon name="edit" />
                          </q-item-section>
                          <q-item-section>Edit</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          class="bg-negative text-white"
                          @click="deleteController(controller)"
                        >
                          <q-item-section avatar>
                            <q-icon name="delete" />
                          </q-item-section>
                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section> </q-card-section>
              <juju-loading :loading="loadingControllers[controller.id]" />
            </q-card>
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
            <q-card>
              <q-card-section>
                <!-- Card Heading -->
                <div class="row items-center">
                  <div class="col-grow" style="flex: 1 1 0%">
                    <!-- Credential name -->
                    <div class="text-h6 ellipsis">
                      <q-icon name="fas fa-address-card" class="on-left" />
                      {{ credential.name }}
                    </div>
                    <div class="text-subtitle2 row">
                      <!-- Credential cloud -->
                      <div class="q-mr-sm">
                        <q-icon name="cloud" size="1em" class="q-ma-xs" />
                        {{ credentialsCloud(credential) }}
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-btn flat round icon="more_vert">
                      <!-- Card action menu -->
                      <q-menu
                        anchor="center right"
                        self="center left"
                        :offset="[10, 0]"
                        style="font-size: 1em"
                      >
                        <q-item
                          clickable
                          v-close-popup
                          class="bg-primary text-white"
                        >
                          <q-item-section avatar>
                            <q-icon name="edit" />
                          </q-item-section>
                          <q-item-section>Edit</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          class="bg-negative text-white"
                          @click="deleteCredential(credential)"
                        >
                          <q-item-section avatar>
                            <q-icon name="delete" />
                          </q-item-section>
                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </q-menu>
                    </q-btn>
                  </div>
                </div>
              </q-card-section>
              <juju-loading :loading="loadingCredentials[credential.id]" />
            </q-card>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <juju-loading :loading="loading" />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import JujuLoading from 'components/JujuLoading.vue';
import ControllerEdit from 'components/dialogs/ControllerEdit.vue';

import { Component, Vue } from 'vue-property-decorator';

import { Controller, CloudCredential, Cloud } from 'store/juju/state';
import { actionTypes } from 'store/juju/actions';
import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component({
  components: {
    JujuLoading
  }
})
export default class Controllers extends Vue {
  // State
  @juju.State controllers!: Controller[];
  @juju.State cloudCredentials!: CloudCredential[];
  @juju.State clouds!: Cloud[];

  // Load actions
  @juju.Action(actionTypes.loadControllers) loadControllers!: () => Promise<
    undefined
  >;
  @juju.Action(actionTypes.loadCloudCredentials)
  loadCloudCredentials!: () => Promise<undefined>;
  @juju.Action(actionTypes.loadCloudList)
  loadCloudList!: () => Promise<undefined>;

  // Delete actions
  @juju.Action(actionTypes.deleteController) runDeleteController!: (
    name: string
  ) => Promise<undefined>;
  @juju.Action(actionTypes.deleteCloudCredential) runDeleteCredential!: (
    name: string
  ) => Promise<undefined>;

  tab = 'controllers';

  loading = false;
  // The list of controllers that are loading
  loadingControllers: { [key: string]: boolean } = {};
  loadingCredentials: { [key: string]: boolean } = {};

  created(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    Promise.all([
      this.loadControllers(),
      this.loadCloudCredentials(),
      this.loadCloudList()
    ]).then(() => {
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
            message: `Seccessfully deleted controller: ${controller.name}.`,
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
            message: `Seccessfully deleted credential: ${credential.name}.`,
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
    .ctrlr-cred-tabs
      .q-tab__icon
        display none

    .ctrl-cred-tabs-alt-heading
      display: none

.tab-trans-enter-active,
.tab-trans-leave-active
  transition all .4s ease
  overflow hidden

.tab-trans-enter
  transform TranslateY(-100vh)

.tab-trans-leave-to
  transform TranslateX(-100vw)
</style>
