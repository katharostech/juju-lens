<template>
  <div class="absolute fit">
    <div class="q-pa-md">
      <div class="row q-gutter-md">
        <!-- Controllers Toolbar -->
        <q-toolbar>
          <q-toolbar-title>
            Controllers
          </q-toolbar-title>
          <q-btn color="positive" icon="fas fa-plus" />
        </q-toolbar>

        <!-- Controller Card -->
        <q-card
          v-for="controller in controllers"
          :key="controller.name"
          class="col col-sm-6 col-md-4"
        >
          <q-card-section>
            <!-- Card Heading -->
            <div class="row items-center">
              <div class="col-grow" style="flex: 1 1 0%">
                <div class="text-h6 ellipsis">
                  {{ controller.name }}
                </div>
                <div class="text-subtitle2">
                  <q-icon name="cloud" class="on-left" size="1em" />{{
                    controller.cloud
                  }}
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
                      @click="deleteController(controller.name)"
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
          <juju-loading :loading="loadingControllers[controller.name]" />
        </q-card>
      </div>
    </div>

    <juju-loading :loading="loading" />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import JujuLoading from 'components/JujuLoading.vue';

import { Component, Vue } from 'vue-property-decorator';

import { Controller } from 'store/juju/state';
import { actionTypes } from 'store/juju/actions';
import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component({
  components: {
    JujuLoading
  }
})
export default class Controllers extends Vue {
  @juju.State controllers!: Controller[];
  @juju.Action(actionTypes.loadControllers) loadControllers!: () => Promise<
    undefined
  >;
  @juju.Action(actionTypes.deleteController) runDeleteController!: (
    name: string
  ) => Promise<undefined>;

  loading = false;
  // The list of controllers that are loading
  loadingControllers: { [key: string]: boolean } = {};

  created(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    this.loadControllers().then(() => {
      this.loading = false;
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
        this.$set(this.loadingControllers, name, true);
        this.runDeleteController(name).then(() => {
          this.$set(this.loadingControllers, name, false);
          this.$q.notify({
            type: 'positive',
            message: `Seccessfully deleted controller: ${name}.`,
            position: 'bottom-right',
            timeout: 2000
          });
        });
      });
  }
}
</script>
