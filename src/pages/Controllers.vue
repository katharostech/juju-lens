<template>
  <!-- This is 'absolute fit' so that the loading overlow covers the whole page -->
  <div class="controllers absolute fit flex items-stretch">
    <div class="q-pa-xs fit column no-wrap">
      <!-- Controllers Toolbar -->
      <q-toolbar class="col-auto row q-mt-sm">
        <q-toolbar-title style="font-size: 1.5rem">Controllers</q-toolbar-title>
        <q-btn
          color="positive"
          icon="fas fa-plus"
          @click="startCreateController()"
        >
          <q-tooltip>Add a new controller</q-tooltip>
        </q-btn>
        <q-btn
          color="primary"
          icon="fas fa-upload"
          @click="loadFromCli()"
          class="on-right"
        >
          <q-tooltip>Load controllers from Juju CLI</q-tooltip>
        </q-btn>
      </q-toolbar>

      <div class="row content-start q-ma-sm q-col-gutter-sm">
        <!-- Controller Card -->
        <div
          v-for="(controller, name) in controllers"
          :key="name"
          class="col-12 col-sm-6 col-md-4"
        >
          <resource-card
            :heading="name"
            :heading-link="{ name: 'models', query: { controller: name } }"
            headingIcon="gamepad"
            :infoItems="[
              {
                icon: 'fas fa-server',
                label: Object.keys(controller.machines).length,
                tooltip: 'Machines'
              },
              {
                icon: 'fas fa-share-alt',
                label: Object.keys(controller.models).length,
                tooltip: 'Models'
              },
              {
                icon: 'fas fa-play-circle',
                label: Object.keys(controller.applications).length,
                tooltip: 'Applications'
              },
              {
                icon: 'fas fa-boxes',
                label: Object.keys(controller.units).length,
                tooltip: 'Units'
              }
            ]"
            @delete="deleteController(name)"
            @edit="startEditController(name, controller)"
          />
        </div>
      </div>
    </div>

    <!-- TODO: Hook up to real loading status and store loading state in Vuex store -->
    <juju-loading :loading="false" />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import ResourceCard from 'components/ResourceCard.vue';
import JujuLoading from 'components/JujuLoading.vue';
import ControllerEdit from 'components/dialogs/ControllerEdit.vue';

import { Component, Vue } from 'vue-property-decorator';

import { Controller } from 'store/juju/state';
import { actionTypes } from 'store/juju/actions';
import { namespace } from 'vuex-class';
const juju = namespace('juju');

import { Dir, readTextFile } from 'tauri/api/fs';
import Yaml from 'js-yaml';

@Component({
  components: {
    JujuLoading,
    ResourceCard
  }
})
export default class Controllers extends Vue {
  // State
  @juju.State currentController!: 'All' | string;
  @juju.State controllers!: { [key: string]: Controller };

  // Delete actions
  @juju.Action(actionTypes.deleteController) runDeleteController!: (
    name: string
  ) => void;

  @juju.Action(actionTypes.updateController) updateController!: ({
    name,
    controller
  }: {
    name: string;
    controller: Controller;
  }) => Promise<undefined>;

  get tab(): string {
    return 'controllers';
  }

  // Create a controller or a credential ( based on the current tab )
  startCreateController(): void {
    this.$q.dialog({
      component: ControllerEdit,
      parent: this
    });
  }

  // Show the dialog to edit a controller
  startEditController(controllerName: string, controller: Controller): void {
    this.$q.dialog({
      component: ControllerEdit,
      parent: this,
      controllerName,
      controller
    });
  }

  deleteController(name: string): void {
    // Prompt for controller deletion
    this.$q
      .dialog({
        title: 'Are you sure?',
        message: `Are you sure you want to delete controller ${name}?`,
        persistent: true,
        cancel: true,
        ok: {
          label: 'delete',
          color: 'negative'
        }
      })
      .onOk(() => {
        this.runDeleteController(name);
        this.$q.notify({
          type: 'positive',
          message: `successfully deleted controller: ${name}.`,
          position: 'bottom-right',
          timeout: 2000
        });
      });
  }

  async loadFromCli(): Promise<void> {
    try {
      console.debug('Loading `juju/accounts.yaml');
      const accounts: any = Yaml.safeLoad(
        await readTextFile('juju/accounts.yaml', { dir: Dir.LocalData })
      );
      console.debug('Loading `juju/controllers.yaml');
      const controllers: any = Yaml.safeLoad(
        await readTextFile('juju/controllers.yaml', { dir: Dir.LocalData })
      );

      for (const name in controllers.controllers) {
        const controller = controllers.controllers[name];
        // TODO: We only support one endpoint right now
        const endpoint = controller['api-endpoints'][0];
        const [host, port] = endpoint.split(':');

        const username = accounts.controllers[name].user;
        const password = accounts.controllers[name].password;

        // If the controller doesn't already exist
        if (
          !Object.values(this.controllers).find(
            x => x.host == host && x.port == port
          )
        ) {
          console.debug(
            'Adding controller:',
            name,
            host,
            port,
            username,
            password
          );

          const controller: Controller = {
            host,
            port: parseInt(port),
            username,
            password,
            // Set insecure to the selected value, or false if not in a Tauri app
            insecure: port != '443',
            models: {},
            machines: {},
            applications: {},
            units: {},
            charms: {}
          };

          this.updateController({ name, controller });
        }
      }

      this.$q.notify({
        type: 'positive',
        message: 'Successfully imported Juju controllers from the CLI',
        position: 'bottom-right',
        timeout: 2000
      });
    } catch (e) {
      console.log(e);

      this.$q.notify({
        type: 'negative',
        message: 'Could not load local Juju controller information',
        position: 'bottom-right',
        timeout: 2000
      });
    }
  }
}
</script>
