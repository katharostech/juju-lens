<template>
  <!-- This is 'absolute fit' so that the loading overlow covers the whole page -->
  <div class="models absolute fit flex items-stretch">
    <div class="fit column">
      <!-- Controllers Toolbar -->
      <q-toolbar class="col-auto row q-mb-sm">
        <!-- Tabs -->
        <q-tabs
          inline-label
          v-model="tab"
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
            <!-- Model toolbar -->
            <q-toolbar
              v-ripple
              class="bg-primary text-white full-width"
              @click="$set(modelsExpanded, model.id, !modelsExpanded[model.id])"
            >
              <!-- Model Status -->
              <q-icon
                :name="model.statusIcon.icon"
                :style="{
                  color: model.statusIcon.color
                }"
                size="1.7em"
              />
              <q-toolbar-title style="flex: 1 1 0%">
                {{ model.name }}
              </q-toolbar-title>
              <div class="avatar-stack">
                <q-avatar
                  v-for="application in model.applications"
                  :key="application.id"
                  size="2em"
                >
                  <q-img :src="application.charm.imageUrl" />
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
                icon="arrow_downward"
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
                icon="more_vert"
                @click.stop="() => undefined"
              />
            </q-toolbar>
            <q-slide-transition>
              <div v-if="modelsExpanded[model.id]">
                <!-- Application Row -->
                <q-list bordered separator>
                  <q-item
                    v-for="application in model.applications"
                    :key="application.id"
                    clickable
                    v-ripple
                    :id="application.id"
                    class="row"
                  >
                    <!-- App Status -->
                    <q-item-section avatar>
                      <q-icon
                        :name="application.statusIcon.icon"
                        :style="{
                          color: application.statusIcon.color
                        }"
                        size="1.7em"
                      />
                    </q-item-section>

                    <!-- App Logo -->
                    <q-item-section avatar>
                      <q-img :src="application.charm.imageUrl" />
                    </q-item-section>

                    <q-item-section>
                      <!-- App Name -->
                      <div>
                        {{ application.name }}
                      </div>
                      <!-- Unit Preview -->
                      <div class="row reverse">
                        <div v-for="unit in application.units" :key="unit.id">
                          <q-icon
                            :name="unit.statusIcon.icon"
                            :style="{
                              color: unit.statusIcon.color
                            }"
                            size="1.em"
                            class="q-ma-xs"
                          />
                          <q-tooltip anchor="top middle" self="bottom middle">
                            {{ application.name }}/{{ unit.index }}
                          </q-tooltip>
                        </div>
                      </div>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        round
                        dense
                        flat
                        icon="more_vert"
                        @click.stop="() => undefined"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-slide-transition>
          </div>
        </q-tab-panel>

        <!-- Machines View -->
        <q-tab-panel name="machines" class="q-pa-sm">
          Helo World!!!!
        </q-tab-panel>
      </q-tab-panels>

      <!-- TODO: Unit info Footer -->
      <div style="height: 2em;" class="bg-dark text-white">
        <q-bar dense>
          <img
            src="/statics/charmIcons/spark.svg"
            style="height: 1em;"
            :ratio="1"
          />

          <div class="text-weight-bold ellipsis">my-app</div>

          <q-space />

          <!-- Minimize button -->
          <q-btn
            v-ripple
            dense
            flat
            icon="fas fa-window-minimize"
            @click="$emit('minimize')"
          >
            <q-tooltip
              transition-show="jump-up"
              transition-hide="jump-down"
              anchor="top middle"
              self="bottom middle"
              :delay="300"
            >
              Hide
            </q-tooltip>
          </q-btn>
        </q-bar>
      </div>
    </div>

    <juju-loading :loading="loading" />
  </div>
</template>

<script lang="ts">
import JujuLoading from 'components/JujuLoading.vue';

import {
  Model,
  Application,
  Charm,
  Unit,
  UnitStatusSeverity
} from 'store/juju/state';
import { FilledApplication, FilledModel } from 'store/juju/state/utils';
import { unitStatusSeverityIcon } from 'store/juju/state/utils';
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
  @juju.State('models') rawModels!: Model[];
  @juju.State('store') charmStore!: Charm[];
  @juju.State applications!: Application[];
  @juju.State units!: Unit[];

  @juju.Action(actionTypes.loadAllState) loadAllState!: () => Promise<
    undefined
  >;

  // Get a model list with additional fiels that prevent having to lookup related components by
  // id every time they must be accessed.
  get models(): FilledModel[] {
    const filledModels: FilledModel[] = [];

    for (const model of this.rawModels) {
      // Fill extra application information for the model
      const filledApplications: FilledApplication[] = this.applications
        .filter(app => app.modelId == model.id)
        .map(app => {
          // Fill extra unit information for the application
          const filledUnits = this.units
            .filter(unit => unit.applicationId == app.id)
            .map(unit => {
              return {
                statusIcon: unitStatusSeverityIcon(unit.status.severity, true),
                ...unit
              };
            });

          // The severity for the app is the "worst" severity out of its units
          const severity = filledUnits
            .map(x => x.status.severity)
            .sort((a, b) => UnitStatusSeverity[b] - UnitStatusSeverity[a])[0];

          return {
            charm: this.charmStore.filter(charm => charm.id == app.charmId)[0],
            units: filledUnits,
            statusIcon: unitStatusSeverityIcon(severity),
            severity,
            ...app
          };
        });

      filledModels.push({
        applications: filledApplications,
        statusIcon: unitStatusSeverityIcon(
          filledApplications
            .map(x => x.severity)
            .sort((a, b) => UnitStatusSeverity[b] - UnitStatusSeverity[a])[0]
        ),
        ...model
      });
    }

    return filledModels;
  }

  loading = false;
  tab = 'models';
  activeApplication: Application | null = null;

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
