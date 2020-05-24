<template>
  <div class="absolute fit">
    <div class="q-pa-md">
      <div class="row q-gutter-md">
        <q-card
          v-for="controller in controllers"
          :key="controller.name"
          class="col col-sm-6"
        >
          <q-card-section>
            <div class="row items-center">
              <div class="col-grow">
                <div class="text-h6">{{ controller.name }}</div>
                <div class="text-subtitle2">
                  <q-icon name="cloud" class="on-left" size="1em" />{{
                    controller.cloud
                  }}
                </div>
              </div>
              <div>
                <q-btn flat round icon="fas fa-ellipsis-v menu">
                  <q-menu
                    anchor="center left"
                    self="center right"
                    :offset="[10, 0]"
                  >
                    <q-item clickable v-close-popup>
                      <q-item-section>New tab</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup>
                      <q-item-section>New incognito tab</q-item-section>
                    </q-item>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section> </q-card-section>
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

  loading = false;

  created(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    this.loadControllers().then(() => {
      this.loading = false;
    });
  }
}
</script>
