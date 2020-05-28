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
        <div style="flex: 0.1 0.5 10em;" id="sort-models-select">
          <q-select
            v-model="sortModelsBy"
            label="Sort By"
            :options="sortModelsByOptions"
            filled
            class="on-left"
          />
        </div>
        <q-btn color="positive" icon="fas fa-plus" @click="startCreate()" />
      </q-toolbar>

      <!-- Content scroll area -->
      <q-scroll-area
        ref="modelScrollArea"
        class="col-grow"
        :thumb-style="{ width: '5px' }"
      >
        <div class="q-pa-sm">
          <div class="row">
            <!-- Mobile heading for tab panel -->
            <div class="col-grow text-h5 q-mb-md xs">
              Models
            </div>

            <!-- Mobile sort selection -->
            <div
              style="flex: 0.1 0.5 10em; position: relative; top: -0.5em;"
              id="sort-models-select-mobile"
            >
              <q-select
                dense
                v-model="sortModelsBy"
                label="Sort By"
                :options="sortModelsByOptions"
                filled
                class="on-left"
              />
            </div>
          </div>

          <!-- Model -->
          <transition-group name="model-group-trans" tag="div">
            <div
              class="q-mb-md full-width"
              v-for="model in models"
              :key="model.id"
            >
              <!-- Model toolbar -->
              <q-toolbar
                v-ripple
                class="bg-primary text-white full-width"
                @click="
                  $set(modelsExpanded, model.id, !modelsExpanded[model.id])
                "
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
                  <!-- Tab content -->
                  <q-tab-panels
                    animated
                    v-model="tab"
                    style="background-color: hsla(0, 0%, 0%, 0);"
                  >
                    <!-- Model list -->
                    <q-tab-panel
                      :id="`model-${model.id}`"
                      name="models"
                      class="q-pa-none"
                    >
                      <!-- Application Row -->
                      <q-list bordered separator>
                        <q-item
                          v-for="application in model.applications"
                          :key="application.id"
                          clickable
                          v-ripple
                          :id="`application-${application.id}`"
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
                              <div
                                v-for="unit in application.units"
                                :key="unit.id"
                              >
                                <q-icon
                                  :name="unit.statusIcon.icon"
                                  :style="{
                                    color: unit.statusIcon.color
                                  }"
                                  size="1.em"
                                  class="q-ma-xs"
                                />
                                <q-tooltip
                                  anchor="top middle"
                                  self="bottom middle"
                                  content-style="font-size: 0.8rem;"
                                >
                                  {{
                                    unit.status.message ||
                                      `status: ${unit.status.severity}`
                                  }}
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
                    </q-tab-panel>

                    <!-- Machines List -->
                    <q-tab-panel name="machines">
                      <div class="text-h5">Machine List Comming Soon!</div>
                    </q-tab-panel>
                  </q-tab-panels>
                </div>
              </q-slide-transition>
            </div>
          </transition-group>
        </div>
      </q-scroll-area>

      <!-- TODO: Unit info Footer -->
      <div
        style="height: 2em;"
        v-if="tab == 'models'"
        class="bg-dark text-white"
      >
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
  Controller,
  UnitStatusSeverity
} from 'store/juju/state';
import { FilledApplication, FilledModel } from 'store/juju/state/utils';
import { unitStatusSeverityIcon } from 'store/juju/state/utils';
import { actionTypes } from 'store/juju/actions';
import { Component, Watch, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
const juju = namespace('juju');

import { scroll, dom, QScrollArea } from 'quasar';
const { offset } = dom;
const { setScrollPosition } = scroll;

@Component({
  components: {
    JujuLoading
  }
})
export default class Index extends Vue {
  @juju.State currentController!: Controller | null;
  @juju.State('models') rawModels!: Model[];
  @juju.State('store') charmStore!: Charm[];
  @juju.State applications!: Application[];
  @juju.State units!: Unit[];

  @juju.Action(actionTypes.loadAllState) loadAllState!: () => Promise<
    undefined
  >;

  readonly sortModelsByOptions = ['Status', 'Name'];
  sortModelsBy: 'Status' | 'Name' = 'Status';

  scrollToElement(el: HTMLElement) {
    const scrollArea = this.$refs.modelScrollArea as QScrollArea;
    const target = scrollArea.getScrollTarget();
    const current = scrollArea.getScrollPosition();
    const diff = offset(el).top;
    const newScroll = current + diff - 122;
    console.log(current, diff, newScroll);

    const duration = 100;

    setScrollPosition(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target as any,
      newScroll,
      duration
    );
  }

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
          const statusSeverity = filledUnits
            .map(x => x.status.severity)
            .sort((a, b) => UnitStatusSeverity[b] - UnitStatusSeverity[a])[0];

          return {
            charm: this.charmStore.filter(charm => charm.id == app.charmId)[0],
            units: filledUnits,
            statusIcon: unitStatusSeverityIcon(statusSeverity),
            statusSeverity,
            ...app
          };
        });

      const statusSeverity = filledApplications
        .map(x => x.statusSeverity)
        .sort((a, b) => UnitStatusSeverity[b] - UnitStatusSeverity[a])[0];

      filledModels.push({
        applications: filledApplications,
        statusIcon: unitStatusSeverityIcon(statusSeverity),
        statusSeverity,
        ...model
      });
    }

    return filledModels.sort((a, b) => {
      if (this.sortModelsBy == 'Status') {
        return (
          UnitStatusSeverity[b.statusSeverity] -
          UnitStatusSeverity[a.statusSeverity]
        );
      } else {
        return a.name > b.name ? 1 : -1;
      }
    });
  }

  loading = false;
  tab = 'models';
  activeApplication: Application | null = null;

  modelsExpanded: { [key: string]: boolean } = {};

  async created(): Promise<void> {
    await this.fetchData();

    // Scroll to the app for a unit specified by route if necessary
    this.scrollToApp();
  }

  async fetchData(): Promise<void> {
    this.loading = true;

    await this.loadAllState();
    this.loading = false;
  }

  // Scroll to the unit specified by the route
  @Watch('$route')
  scrollToApp(): void {
    const unitId: string | null = this.$route.query.unitId as string | null;
    // Skip if unit is not specified
    if (!unitId) {
      return;
    }

    // Make sure the unit's model has been expanded
    const unit = this.units.filter(unit => unit.id == unitId)[0];
    const app = this.applications.filter(
      app => app.id == unit.applicationId
    )[0];
    this.$set(this.modelsExpanded, app.modelId, true);

    // Scroll to application after waiting for it's dom element to exist
    setTimeout(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      function check(this: any) {
        const el = document.getElementById(`application-${app.id}`);
        if (el) {
          this.scrollToElement(el);
        } else {
          setTimeout(check, 100);
        }
        // This 400 milisecond wait is here to wait for the expansion of the
        // model animation if necessary.
        // TODO: Make this smarter by tracking the animation status of the
        // model expansion items and forgoeing the delay if it is allready
        // expanded?
      }.bind(this),
      400
    );

    // TODO: Show the footer with the unit details in it
  }
}
</script>

<style lang="stylus">
.models
  #sort-models-select
    @media(max-width: 376px)
      display none !important

  #sort-models-select-mobile
    @media(min-width: 376px)
      display none !important

  .model-group-trans-move
    transition: transform 0.5s;

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
