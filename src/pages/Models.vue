<template>
  <!-- This is 'absolute fit' so that the loading overlow covers the whole page -->
  <div class="models absolute fit flex items-stretch">
    <div class="q-pa-xs fit column">
      <!-- Controllers Toolbar -->
      <q-toolbar class="col-auto row q-mb-md">
        <!-- Tabs -->
        <q-tabs
          inline-label
          :value="tab"
          shrink
          class="model-machine-tabs q-pa-xs"
        >
          <q-route-tab
            label="Models"
            icon="share"
            name="models"
            :to="{ name: 'models' }"
          />
          <q-route-tab
            label="Machines"
            icon="fas fa-server"
            name="machines"
            :to="{ name: 'machines' }"
          />
        </q-tabs>
        <q-space />
        <q-btn color="positive" icon="fas fa-plus" @click="startCreate()" />
      </q-toolbar>

      <!-- Tab content -->
      <q-tab-panels
        animated
        v-model="tab"
        class="fit"
        style="flex: 1 1 0%; background-color: hsla(0, 0%, 0%, 0);"
      >
        <!-- Model list -->
        <q-tab-panel name="models" class="q-pa-sm">
          <!-- Mobile heading for tab panel -->
          <div class="text-h5 q-mb-md xs">
            Models
          </div>

          <!-- Model -->
          <div
            class="q-mb-md full-width"
            v-for="model in models"
            :key="model.id"
          >
            <q-toolbar
              v-ripple
              class="bg-primary text-white full-width"
              @click="$set(modelsExpanded, model.id, !modelsExpanded[model.id])"
            >
              <q-avatar icon="share" />
              <q-toolbar-title style="flex: 1 1 0%">{{
                model.name
              }}</q-toolbar-title>
              <div class="avatar-stack">
                <q-avatar
                  v-for="application in modelApplications(model)"
                  :key="application.id"
                >
                  <q-img :src="applicationCharm(application).imageUrl" />
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    content-style="font-size: 0.8em;"
                  >
                    {{ application.name }}
                  </q-tooltip>
                </q-avatar>
              </div>
              <q-btn
                round
                dense
                flat
                icon="fas fa-arrow-down"
                style="transition: transform 0.2s;"
                :style="{
                  transform: modelsExpanded[model.id]
                    ? 'rotateZ(180deg)'
                    : 'none'
                }"
              />
              <q-btn
                round
                dense
                flat
                icon="fas fa-ellipsis-v"
                @click.stop="() => undefined"
              />
            </q-toolbar>
            <q-slide-transition>
              <div v-if="modelsExpanded[model.id]">
                <q-list bordered>
                  <q-item
                    v-for="application in modelApplications(model)"
                    :key="application.id"
                    clickable
                    v-ripple
                  >
                    <q-item-section avatar>
                      <q-img :src="applicationCharm(application).imageUrl" />
                    </q-item-section>
                    <q-item-section>
                      {{ application.name }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-slide-transition>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <juju-loading :loading="loading" />
  </div>
</template>

<script lang="ts">
import JujuLoading from 'components/JujuLoading.vue';

import { Model, Application, Charm } from 'store/juju/state';
import { actionTypes } from 'store/juju/actions';
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component({
  components: {
    JujuLoading
  }
})
export default class Index extends Vue {
  @juju.State models!: Model[];
  @juju.State store!: Charm[];
  @juju.State applications!: Application[];

  @juju.Action(actionTypes.loadAllState) loadAllState!: () => Promise<
    undefined
  >;

  //
  // FIXME Tomorrow!!!!!!!!!
  // Set up cached "filled in" way to get model data
  //

  loading = false;
  tab = 'models';

  modelsExpanded: { [key: string]: boolean } = {};

  created(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    this.loadAllState().then(() => {
      this.loading = false;
    });
  }

  // Get the applications for a particular model
  modelApplications(model: Model): Application[] {
    return this.applications.filter(x => x.modelId == model.id);
  }

  // Get the charm for a given application
  applicationCharm(app: Application): Charm {
    return this.store.filter(x => x.id == app.charmId)[0];
  }
}
</script>

<style lang="stylus">
.models
  $model-machine-tabs-breakpoint=476px

  .avatar-stack
    .q-avatar
      transition margin-left 0.2s

    .q-avatar:not(:first-child)
      margin-left -0.4em

    &:hover
      .q-avatar:not(:first-child)
        margin-left inherit

  // Small screen use only icons without labels
  @media(max-width: $model-machine-tabs-breakpoint)
    .model-machine-tabs
      .q-tab__label
        display none
</style>
