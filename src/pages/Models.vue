<template>
  <!-- This is 'absolute fit' so that the loading overlow covers the whole page -->
  <div class="models absolute fit flex items-stretch" style="overflow: hidden;">
    <div class="fit column">
      <!-- Controllers Toolbar -->
      <q-toolbar class="col-auto row items-center">
        <!-- Tabs -->
        <q-tabs
          inline-label
          v-model="tab"
          shrink
          class="model-machine-tabs q-pa-xs"
        >
          <q-route-tab
            label="Applications"
            icon="share"
            name="applications"
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
        <!-- Sort Models select -->
        <div style="flex: 0.1 0.5 10em;" id="sort-models-select">
          <q-select
            dense
            v-model="sortModelsBy"
            label="Sort By"
            :options="sortModelsByOptions"
            :color="$q.dark.isActive ? 'secondary' : 'primary'"
            filled
            class="on-left"
          />
        </div>
        <q-btn color="positive" icon="fas fa-plus" @click="startCreate()" />
      </q-toolbar>

      <div class="col-grow column relative-position">
        <!-- Content area resize observer -->
        <q-resize-observer @resize="onResizeContent" />

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
                {{ tab == 'applications' ? 'Applications' : 'Machines' }}
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
                  :color="$q.dark.isActive ? 'secondary' : 'primary'"
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

                  <q-separator vertical class="on-right" color="grey-6" />

                  <q-toolbar-title style="flex: 1 1 0%">
                    <span>
                      {{ model.name }}
                      <q-tooltip anchor="top middle" self="bottom middle">
                        {{ model.name }}
                      </q-tooltip>
                    </span>
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
                        name="applications"
                        class="q-pa-none"
                        style="overflow: hidden;"
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
                            @click="
                              activeApplication = application;
                              showFooter();
                            "
                          >
                            <!-- App Status -->
                            <q-item-section avatar>
                              <q-icon
                                :name="application.statusIcon.icon"
                                :style="{
                                  color: application.statusIcon.color
                                }"
                                size="1.4em"
                              />
                            </q-item-section>

                            <!-- App Logo -->
                            <q-item-section avatar>
                              <q-img
                                :src="application.charm.imageUrl"
                                style="width: 2.5em"
                              />
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

        <!-- Application info Footer -->
        <div
          v-if="tab == 'applications'"
          :style="{
            height: footerVisible ? `${footerHeight}%` : '0%',
            transition: footerTransitioning
              ? `all ${footerTransitionDuration / 1000}s`
              : `unset`
          }"
          class="column bg-dark text-white relative-position"
          style="overflow: hidden"
        >
          <div
            v-if="activeApplication && (footerVisible || footerTransitioning)"
            class="col-grow column overflow-hidden"
          >
            <!-- Top Resize Handle -->
            <div
              v-touch-pan.mouse.up.down.prevent="resizeFooter"
              style="position: absolute; left: 0; right: 0; top: 0; cursor: ns-resize; height: 0.7em;"
            ></div>

            <!-- Footer Top Bar -->
            <q-bar dense class="col-auto">
              <img
                :src="activeApplication.charm.imageUrl"
                style="height: 1em;"
                :ratio="1"
              />

              <div class="text-weight-bold ellipsis">
                {{ activeApplication.name }}
              </div>

              <q-space />

              <!-- Minimize button -->
              <q-btn
                v-ripple
                dense
                flat
                icon="fas fa-window-minimize"
                @click="hideFooter()"
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
            <div class="col">
              <q-table
                hide-bottom
                dense
                :data="activeApplication.units"
                :columns="activeApplicationUnitsColumns"
                row-key="index"
                class="fit"
                style="border-radius: 0px;"
                virtual-scroll
              />
            </div>
          </div>
        </div>
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

import { scroll, dom, QScrollArea, LocalStorage } from 'quasar';
const { offset } = dom;
const { setScrollPosition } = scroll;

const SORT_MODELS_LOCAL_STORAGE_KEY = 'sortModelsBy';

@Component({
  components: {
    JujuLoading
  }
})
export default class Index extends Vue {
  @juju.State currentController!: Controller | 'All';
  @juju.Getter controllerModels!: Model[];
  @juju.State('store') charmStore!: Charm[];
  @juju.State applications!: Application[];
  @juju.State units!: Unit[];

  @juju.Action(actionTypes.loadAllState) loadAllState!: () => Promise<
    undefined
  >;

  loading = false;

  readonly sortModelsByOptions = ['Status', 'Name'];
  sortModelsBy: 'Status' | 'Name' = 'Status';

  tab = 'applications';
  modelsExpanded: { [key: string]: boolean } = {};
  activeApplication: FilledApplication | null = null;
  // The total height for both the footer and the content list area
  pageHeight = 0; // This is updated by onResizeContent
  footerVisible = false;
  // Footer height percentage of content area ( the area of the page minus the page
  // header with the tabs and sort options )
  footerHeight = 50;
  footerTransitioning = false;
  readonly footerTransitionDuration = 300;

  get activeApplicationUnitsColumns() {
    return [
      {
        name: 'name',
        label: 'Units',
        field: 'index',
        align: 'left',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        format: (index: number) => `${this.activeApplication!.name}/${index}`,
        sortable: true
      }
    ];
  }

  // Handles the content area resizing and sets `this.pageHeight`
  onResizeContent({ height }: { width: number; height: number }): void {
    this.pageHeight = height;
  }

  // Resizes the footer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resizeFooter(event: any): void {
    const delta = event.delta.y;
    const deltaPercent = (delta / this.pageHeight) * 100;
    const height = this.footerHeight - deltaPercent;

    if (height > 100) {
      this.footerHeight = 100;
    } else if (height < 2) {
      // If footer gets tiny, collapse it completely and reset size
      this.footerVisible = false;
      this.footerHeight = 50;
    } else {
      this.footerHeight = height;
    }
  }

  // Functions to hide and show the footer ( used in button clicks )
  hideFooter(): void {
    this.footerTransitioning = true;
    this.footerVisible = false;
    setTimeout(
      () => (this.footerTransitioning = false),
      this.footerTransitionDuration
    );
  }
  showFooter(): void {
    this.footerTransitioning = true;
    this.footerVisible = true;
    setTimeout(
      () => (this.footerTransitioning = false),
      this.footerTransitionDuration
    );
  }

  @Watch('sortModelsBy')
  onSortModelsByChange(value: string): void {
    LocalStorage.set(SORT_MODELS_LOCAL_STORAGE_KEY, value);
  }

  scrollToElement(el: HTMLElement) {
    const scrollArea = this.$refs.modelScrollArea as QScrollArea;
    const target = scrollArea.getScrollTarget();
    const current = scrollArea.getScrollPosition();
    const diff = offset(el).top;
    const newScroll = current + diff - 122;

    const duration = 100;

    setScrollPosition(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target as any,
      newScroll,
      duration
    );
  }

  // Fill in application data such as units and statuses, etc. from the ids
  fillApp(app: Application): FilledApplication {
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
  }

  // Get a model list with additional fiels that prevent having to lookup related components by
  // id every time they must be accessed.
  get models(): FilledModel[] {
    const filledModels: FilledModel[] = [];

    for (const model of this.controllerModels) {
      // Fill extra application information for the model
      const filledApplications: FilledApplication[] = this.applications
        .filter(app => app.modelId == model.id)
        .map(this.fillApp.bind(this));

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

  async created(): Promise<void> {
    // Load the sort models preference
    const sortModelsBy = LocalStorage.getItem(SORT_MODELS_LOCAL_STORAGE_KEY);
    if (sortModelsBy && (sortModelsBy == 'Status' || sortModelsBy == 'Name')) {
      this.sortModelsBy = sortModelsBy;
    }

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
        // This 200 milisecond wait is here to wait for the expansion of the
        // model animation if necessary.
        // TODO: Make this smarter by tracking the animation status of the
        // model expansion items and forgoeing the delay if it is allready
        // expanded?
      }.bind(this),
      200
    );

    // Show the app details
    this.footerVisible = true;
    this.activeApplication = this.fillApp(app);

    // TODO: Hightlight individual unit?
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

  $model-machine-tabs-breakpoint=515px

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


// Model list transition

.model-group-trans-item
  display inline-block;
  margin-right 10px

.model-group-enter-trans-active, .model-group-trans-leave-active
  transition all 0.4s

// TODO: Figure out why entering model lists do not animate
.model-group-trans-enter, .model-group-trans-leave-to
  opacity 0 !important
  transform translateX(-100vw) !important

.model-group-trans-move
  transition: transform 0.5s;
</style>
