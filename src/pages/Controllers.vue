<template>
  <!-- This is 'absolute fit' so that the loading overlow covers the whole page -->
  <div class="controllers absolute fit flex items-stretch">
    <div class="q-pa-xs fit column no-wrap">
      <!-- Controllers Toolbar -->
      <q-toolbar class="col-auto row q-mt-sm">
        <q-toolbar-title style="font-size: 1.5rem">Controllers</q-toolbar-title>
        <q-space />
        <q-btn
          color="positive"
          icon="fas fa-plus"
          @click="startCreateController()"
        />
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
}
</script>
