<template>
  <!-- This is 'absolute fit' so that the loading overlow covers the whole page -->
  <div class="models absolute fit flex items-stretch" style="overflow: hidden;">
    <!-- The application info dialog box -->
    <q-dialog v-if="activeApplication" v-model="showAppInfo">
      <q-card style="width: 30em; max-width: 80vw;">
        <q-toolbar class="row q-my-sm">
          <!-- App icon -->
          <q-avatar>
            <charm-icon :src="activeApplication.charmIconUrl" />
          </q-avatar>
          <!-- App Name -->
          <q-toolbar-title>{{ activeApplication.name }}</q-toolbar-title>
        </q-toolbar>

        <q-card-section class="q-pt-none text-body1">
          <!-- Charm version -->
          <div class="row">
            <div class="col-auto text-weight-bold">
              Charm Version:&nbsp;
            </div>
            <div class="col-auto">
              <a
                target="_blank"
                :href="activeApplication.charmStoreUrl"
                style="text-decoration: none;"
              >
                {{ activeApplication['charm-url'] }}
                <q-icon name="open_in_new" />
              </a>
            </div>
          </div>
          <!-- App scale -->
          <div class="row">
            <div class="col-auto text-weight-bold">
              Scale:&nbsp;
            </div>
            <div class="col-auto">
              {{ activeApplication.units.length }}
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

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
        <!-- Add model button ( not used for now ) -->
        <!-- <q-btn color="positive" icon="fas fa-plus" @click="startCreate()" /> -->
      </q-toolbar>

      <div class="col relative-position">
        <!-- Content area resize observer -->
        <q-resize-observer @resize="onResizeContent" />

        <!-- Content scroll area -->
        <q-scroll-area
          ref="modelScrollArea"
          :style="{
            height: footerVisible ? `${100 - footerHeight}%` : '100%',
            transition: footerTransitioning
              ? `all ${footerTransitionDuration / 1000}s`
              : `unset`
          }"
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
                :key="model['model-uuid']"
              >
                <!-- Model toolbar -->
                <q-toolbar
                  v-ripple
                  class="bg-primary text-white full-width"
                  @click="
                    $set(
                      modelsExpanded,
                      model['model-uuid'],
                      !modelsExpanded[model['model-uuid']]
                    )
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
                    &nbsp;
                    <span class="text-weight-light" style="font-size: 1rem;">
                      {{ model.controller }}
                      <q-tooltip>Controller</q-tooltip>
                    </span>
                  </q-toolbar-title>
                  <div class="avatar-stack">
                    <q-avatar
                      v-for="application in model.applications"
                      :key="application.id"
                      size="2em"
                      @click.stop="
                        () => {
                          $set(modelsExpanded, model['model-uuid'], true);
                          activeApplicationId = application.lensId;
                          showFooter();
                        }
                      "
                    >
                      <charm-icon
                        :src="application.charmIconUrl"
                        style="width: 2em; height: 2em;"
                      />
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
                      transform: modelsExpanded[model['model-uuid']]
                        ? 'rotateZ(180deg)'
                        : 'none'
                    }"
                  />
                  <!-- Model Action Button ( Not used yet ) -->
                  <!-- <q-btn
                    round
                    dense
                    flat
                    icon="more_vert"
                    @click.stop="() => undefined"
                  /> -->
                </q-toolbar>
                <q-slide-transition>
                  <div v-if="modelsExpanded[model['model-uuid']]">
                    <q-tab-panels
                      animated
                      v-model="tab"
                      style="background-color: hsla(0, 0%, 0%, 0);"
                    >
                      <q-tab-panel
                        :id="`model-${model['model-uuid']}`"
                        name="applications"
                        class="q-pa-none"
                        style="overflow: hidden;"
                      >
                        <!-- Application Row -->
                        <q-list bordered separator>
                          <transition-group name="model-group-trans" tag="div">
                            <q-item
                              v-for="application in model.applications"
                              :key="application.lensId"
                              clickable
                              v-ripple
                              :id="`application-${application.lensId}`"
                              class="row"
                              @click="
                                activeApplicationId = application.lensId;
                                showFooter();
                              "
                              :class="{
                                'active-application-row':
                                  activeApplication &&
                                  activeApplication.lensId == application.lensId
                              }"
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
                              <q-item-section
                                avatar
                                style="width: 2.5em; height: 2.5em"
                              >
                                <charm-icon
                                  :src="application.charmIconUrl"
                                  style="width: 2.5em; height: 2.5em"
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
                                      {{ unit.name }}:
                                      {{
                                        unit['workload-status'].message ||
                                          unit['workload-status'].current
                                      }}
                                    </q-tooltip>
                                    <!-- Unit dot context menu -->
                                    <q-menu context-menu auto-close>
                                      <q-list>
                                        <q-item
                                          v-ripple
                                          clickable
                                          @click="openLogs(unit, application)"
                                        >
                                          <q-item-section avatar>
                                            <q-icon name="fas fa-file-alt" />
                                          </q-item-section>
                                          <q-item-section>
                                            Open Logs
                                          </q-item-section>
                                        </q-item>
                                        <q-item
                                          v-ripple
                                          clickable
                                          @click="
                                            openTerminal(unit, application)
                                          "
                                        >
                                          <q-item-section avatar>
                                            <q-icon name="fas fa-terminal" />
                                          </q-item-section>
                                          <q-item-section>
                                            Open Terminal
                                          </q-item-section>
                                        </q-item>
                                      </q-list>
                                    </q-menu>
                                  </div>
                                </div>
                              </q-item-section>
                              <q-item-section side>
                                <!-- App Action Button -->
                                <q-btn
                                  round
                                  dense
                                  flat
                                  icon="more_vert"
                                  @click.stop="() => undefined"
                                >
                                  <q-menu
                                    anchor="center right"
                                    self="center left"
                                    :offset="[10, 0]"
                                    style="font-size: 1em"
                                  >
                                    <q-list>
                                      <q-item
                                        clickable
                                        v-close-popup
                                        class="bg-primary text-white"
                                        @click="
                                          () => showAppConfigDialog(application)
                                        "
                                      >
                                        <q-item-section avatar>
                                          <q-icon name="edit" />
                                        </q-item-section>
                                        <q-item-section>Config</q-item-section>
                                      </q-item>
                                    </q-list>
                                  </q-menu>
                                </q-btn>
                              </q-item-section>
                            </q-item>
                          </transition-group>
                          <div
                            v-if="model.applications.length < 1"
                            class="text-center q-pa-sm text-body1"
                          >
                            This model has no applications.
                          </div>
                        </q-list>
                      </q-tab-panel>

                      <!-- Machines List -->
                      <q-tab-panel name="machines">
                        <div class="row items-start q-col-gutter-md">
                          <div
                            class="col-12 col-sm-6 col-md-4 col-lg-3"
                            v-for="machine in model.machines"
                            :key="machine.id"
                          >
                            <q-card>
                              <q-card-section>
                                <!-- FIXME: Determine the proper addresses to select for the public address -->
                                <div class="text-body1">
                                  <div class="text-weight-bold">
                                    Machine: {{ machine.id }}
                                  </div>
                                  {{ machine.addresses[0].value }}
                                </div>
                              </q-card-section>
                              <q-card-section
                                class="row q-pa-sm q-pb-md q-gutter-sm"
                              >
                                <charm-icon
                                  v-for="unit in machine.units"
                                  :key="unit.name"
                                  :src="unit.charmIconUrl"
                                  :style="
                                    `box-shadow: 0 0 4px ${unit.statusIcon.color}; border: 2px solid ${unit.statusIcon.color}; border-radius: 50%; width: 2.5em;`
                                  "
                                  class="hover-grow"
                                  @click.native="
                                    activeApplicationId = model.applications.filter(
                                      app => unit.name.startsWith(app.name)
                                    )[0].lensId;
                                    showFooter();
                                  "
                                >
                                  <q-tooltip
                                    anchor="top middle"
                                    self="bottom middle"
                                    content-style="font-size: 0.8em"
                                  >
                                    {{ unit.name }}:
                                    {{
                                      unit['workload-status'].message ||
                                        unit['workload-status'].current
                                    }}
                                  </q-tooltip>
                                </charm-icon>
                              </q-card-section>
                            </q-card>
                          </div>
                        </div>
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
          :style="{
            height: footerVisible ? `${footerHeight}%` : '0%',
            transition: footerTransitioning
              ? `all ${footerTransitionDuration / 1000}s`
              : `unset`
          }"
          class="relative-position"
        >
          <div
            v-if="activeApplication && (footerVisible || footerTransitioning)"
            class="absolute fit column overflow-hidden"
          >
            <!-- Top Resize Handle -->
            <div
              v-touch-pan.mouse.up.down.prevent="resizeFooter"
              style="position: absolute; left: 0; right: 0; top: 0; cursor: ns-resize; height: 0.7em;"
            ></div>

            <!-- Footer Top Bar -->
            <q-bar dense class="col-auto bg-primary text-white top-border">
              <!-- Status Icon -->
              <q-icon
                name="circle"
                :style="{
                  color: activeApplication.statusIcon.color
                }"
                size="1em"
                class="q-mr-xs"
                style="transition: color 0.3s"
              />

              <!-- App icon -->
              <charm-icon
                :src="activeApplication.charmIconUrl"
                style="width: 1em; height: 1em;"
              />

              <!-- App name -->
              <div class="text-weight-bold ellipsis on-right">
                {{ activeApplication.name }}
              </div>

              <!-- App info button ( for mobile ) -->
              <q-btn
                icon="info"
                round
                flat
                class="on-right lt-md"
                @click="showAppInfo = !showAppInfo"
              >
                <q-tooltip>Application Info</q-tooltip>
              </q-btn>

              <q-space />

              <!-- App info ( for desktop )-->
              <div class="gt-sm">
                <span class="on-left">
                  <span class="text-weight-bold">Charm version:</span>
                  <a
                    target="_blank"
                    :href="activeApplication.charmStoreUrl"
                    class="text-white"
                    style="text-decoration: none;"
                  >
                    {{ activeApplication['charm-url'] }}
                    <q-icon name="open_in_new" />
                  </a>
                </span>
                <span class="on-left">
                  <span class="text-weight-bold">Scale:</span>
                  {{ activeApplication.units.length }}
                </span>
              </div>

              <!-- Unit details column select -->
              <q-select
                class="app-details-footer__column-select on-left"
                dark
                :options-dark="$q.dark.isActive"
                filled
                dense
                multiple
                options-dense
                v-model="unitVisibleColumns"
                :options="unitVisibleColumnsOptions"
                display-value="Columns"
              >
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section side>
                      <q-checkbox
                        color="secondary"
                        v-model="unitVisibleColumns"
                        :val="scope.opt"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label v-html="scope.opt"></q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

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
            <div class="col-grow relative-position">
              <q-scroll-area
                :thumb-style="{ width: '5px' }"
                class="absolute fit"
              >
                <q-table
                  dense
                  hide-bottom
                  :data="activeApplication.units"
                  :columns="activeApplicationUnitsColumns"
                  :visible-columns="unitVisibleColumns"
                  :pagination="{ rowsPerPage: 0 }"
                  :grid="$q.screen.xs"
                  row-key="index"
                  style="border-radius: 0px; box-shadow: none; margin-bottom: -3em;"
                  virtual-scroll
                  binary-state-sort
                >
                  <!-- Custom cells for unit and agent statuses -->
                  <!-- Agent Status Cell -->
                  <template v-slot:body-cell-agent-status="props">
                    <q-td :props="props">
                      <div>
                        <q-badge
                          :color="
                            unitAgentStatusBadgeColor(props.value.current)
                          "
                          :label="props.value.current"
                        />
                      </div>
                    </q-td>
                  </template>
                  <!-- Actions Cell -->
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <q-btn
                        dense
                        flat
                        size="0.8em"
                        icon="fas fa-file-alt"
                        @click="openLogs(props.value, activeApplication)"
                      >
                        <q-tooltip>Open Logs</q-tooltip>
                      </q-btn>
                      <q-btn
                        dense
                        flat
                        size="0.8em"
                        icon="fas fa-terminal"
                        @click="openTerminal(props.value, activeApplication)"
                      >
                        <q-tooltip>Open Terminal</q-tooltip>
                      </q-btn>
                    </q-td>
                  </template>
                  <!-- Unit Status Cell -->
                  <template v-slot:body-cell-status="props">
                    <q-td :props="props">
                      <div>
                        <q-badge
                          :color="unitStatusSeverityBadgeColor(props.value)"
                          :label="props.value"
                        />
                      </div>
                    </q-td>
                  </template>
                  <!-- Moble card view for unit list table -->
                  <template v-slot:item="props">
                    <div class="column col-6">
                      <q-card class="q-ma-xs q-pb-xs">
                        <q-card-section>
                          <!-- Unit name -->
                          <div class="row">
                            <div
                              v-if="
                                props.cols.filter(col => col.name == 'name')
                                  .length > 0
                              "
                              class="col"
                            >
                              {{
                                props.cols.filter(col => col.name == 'name')[0]
                                  .value
                              }}
                            </div>
                            <div class="col" style="text-align: right;">
                              <div
                                v-if="
                                  props.cols.filter(col => col.name == 'status')
                                    .length > 0
                                "
                              >
                                <!-- Here we use v-for just to bind the status to a variable name -->
                                <q-badge
                                  :color="unitStatusSeverityBadgeColor(status)"
                                  v-for="status in [
                                    props.cols.filter(
                                      col => col.name == 'status'
                                    )[0].value
                                  ]"
                                  :key="status"
                                >
                                  {{ status }}
                                </q-badge>
                              </div>
                            </div>
                          </div>
                        </q-card-section>
                        <q-separator />
                        <q-list dense>
                          <q-item
                            v-for="col in props.cols.filter(
                              col =>
                                col.name !== 'name' &&
                                col.name !== 'status' &&
                                col.name
                            )"
                            :key="col.name"
                          >
                            <q-item-section>
                              <q-item-label>{{ col.label }}</q-item-label>
                              <q-item-label
                                v-if="col.name == 'message'"
                                caption
                              >
                                <div class="q-ml-xs">{{ col.value }}</div>
                              </q-item-label>
                            </q-item-section>
                            <q-item-section v-if="col.name != 'message'" side>
                              <q-item-label caption>
                                <span v-if="col.name == 'agent-status'">
                                  <q-badge
                                    :color="
                                      unitAgentStatusBadgeColor(
                                        col.value.current
                                      )
                                    "
                                  >
                                    {{ col.value.current }}
                                  </q-badge>
                                </span>
                                <span v-else-if="col.name != 'actions'">
                                  {{ col.value }}
                                </span>
                                <!-- Action buttons -->
                                <span v-else>
                                  <q-btn
                                    dense
                                    flat
                                    size="1em"
                                    icon="fas fa-file-alt"
                                    class="q-ma-xs"
                                    @click="
                                      openLogs(col.value, activeApplication)
                                    "
                                  >
                                    <q-tooltip>Open Logs</q-tooltip>
                                  </q-btn>
                                  <q-btn
                                    dense
                                    flat
                                    size="1em"
                                    icon="fas fa-terminal"
                                    class="q-ma-xs"
                                    @click="
                                      openTerminal(col.value, activeApplication)
                                    "
                                  >
                                    <q-tooltip>Open Terminal</q-tooltip>
                                  </q-btn>
                                </span>
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card>
                    </div>
                  </template>
                </q-table>
              </q-scroll-area>
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
import CharmIcon from 'components/CharmIcon.vue';
import AppConfigDialog from 'components/dialogs/AppConfigDialog.vue';

import { Component, Watch, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import {
  Application,
  Unit,
  Controller,
  UnitStatusSeverity,
  UnitStatusSeverityString
} from 'store/juju/state';
import { FilledModel, FilledApplication } from 'store/juju/state/utils';
const juju = namespace('juju');
import { actionTypes as jujuActionTypes } from 'store/juju/actions';

import { FloatingWindowKind } from 'store/app/state';
import { actionTypes as appActionTypes } from 'store/app/actions';
const app = namespace('app');

import { scroll, dom, QScrollArea } from 'quasar';
const { offset } = dom;
const { setScrollPosition } = scroll;

const SORT_MODELS_LOCAL_STORAGE_KEY = 'sortModelsBy';
const UNIT_VISIBLE_COLUMNS_STORAGE_KEY = 'unitVisibleColumns';

@Component({
  components: {
    JujuLoading,
    CharmIcon
  }
})
export default class Index extends Vue {
  @juju.State currentController!: 'All' | string;
  @juju.Action(jujuActionTypes.setCurrentController) setCurrentController!: (
    controller: 'All' | string
  ) => Promise<undefined>;
  @juju.State controllers!: { [key: string]: Controller };
  @juju.Getter('currentControllerModelsFilled')
  controllerModels!: FilledModel[];

  @app.Action(appActionTypes.addFloatingWindow) addFloatingWindow!: ({
    unit,
    app,
    kind
  }: {
    unit: Unit;
    app: Application;
    kind: FloatingWindowKind;
  }) => string;

  loading = false;

  readonly sortModelsByOptions = ['Status', 'Name'];
  sortModelsBy: 'Status' | 'Name' = 'Status';

  tab = 'applications';
  modelsExpanded: { [key: string]: boolean } = {};
  activeApplicationId: string | null = null;
  // The active application
  get activeApplication(): FilledApplication | null {
    if (this.activeApplicationId) {
      for (const model of this.controllerModels) {
        for (const app of model.applications) {
          if (app.lensId == this.activeApplicationId) {
            return app;
          }
        }
      }
    }

    return null;
  }
  // Whether or not to show the application info dialog box
  showAppInfo = false;

  // The total height for both the footer and the content list area
  pageHeight = 0; // This is updated by onResizeContent
  footerVisible = false;
  // Footer height percentage of content area ( the area of the page minus the page
  // header with the tabs and sort options )
  footerHeight = 50;
  footerTransitioning = false;
  readonly footerTransitionDuration = 300;

  get models(): FilledModel[] {
    return this.sortModelsBy == 'Status'
      ? this.controllerModels.sort(
          (a, b) =>
            UnitStatusSeverity[b.statusSeverity] -
            UnitStatusSeverity[a.statusSeverity]
        )
      : this.controllerModels.sort((a, b) => (b.name < a.name ? 1 : -1));
  }

  created(): void {
    // Filter by specific controller if the route has the `controller` query
    if (this.$route.query['controller']) {
      this.setCurrentController(this.$route.query['controller'] as string);
    }

    // Load the sort models preference
    const sortModelsBy = window.appLocalStorage.getItem(
      SORT_MODELS_LOCAL_STORAGE_KEY
    );

    if (sortModelsBy && (sortModelsBy == 'Status' || sortModelsBy == 'Name')) {
      this.sortModelsBy = sortModelsBy;
    }

    // Load the unitVisibleColuns preference
    const unitVisibleColumns = window.appLocalStorage.getItem(
      UNIT_VISIBLE_COLUMNS_STORAGE_KEY
    );
    if (unitVisibleColumns) {
      this.unitVisibleColumns = unitVisibleColumns;
    }

    // Scroll to the app for a unit specified by route if necessary
    this.scrollToApp();
  }

  // The columsn that are visible for the application's unit table
  unitVisibleColumnsOptions = [
    'name',
    'actions',
    'agent-status',
    'status',
    'machine',
    'public-ip',
    'exposed-ports',
    'series',
    'message'
  ];
  unitVisibleColumns = [
    'name',
    'actions',
    'agent-status',
    'status',
    'machine',
    'public-ip',
    'series',
    'exposed-ports',
    'message'
  ];

  @Watch('unitVisibleColumns')
  onUnitVisibleColumnsChange(): void {
    window.appLocalStorage.setItem(
      UNIT_VISIBLE_COLUMNS_STORAGE_KEY,
      this.unitVisibleColumns
    );
  }

  get activeApplicationUnitsColumns() {
    // TODO: Column widths are not taken into account for some reason
    return [
      {
        name: 'name',
        label: 'Unit',
        field: 'name',
        headerStyle: 'width: auto',
        align: 'left',
        sortable: true
      },
      // This is sort of a dummy column that we stick the log and terminal buttons
      // in using the template.
      {
        name: 'actions',
        label: 'Actions',
        alight: 'left',
        field: (row: Unit) => row
      },
      {
        name: 'agent-status',
        label: 'Agent',
        field: 'agent-status',
        headerStyle: 'width: 5em',
        align: 'left',
        sortable: true
      },
      {
        name: 'status',
        label: 'Status',
        field: (row: Unit) => row['workload-status'].current,
        sort: (a: UnitStatusSeverityString, b: UnitStatusSeverityString) =>
          UnitStatusSeverity[b] - UnitStatusSeverity[a],
        headerStyle: 'width: 5em',
        align: 'left',
        sortable: true
      },
      {
        name: 'machine',
        label: 'Machine',
        field: 'machine-id',
        align: 'left',
        headerStyle: 'width: 5em',
        sortable: true
      },
      {
        name: 'public-ip',
        label: 'Public IP',
        field: 'public-address',
        align: 'left',
        headerStyle: 'width: 10em',
        sortable: true
      },
      {
        name: 'exposed-ports',
        label: 'Exposed Ports',
        field: (unit: Unit): string => {
          const ports = [
            unit.ports.map(x => `${x.number}/${x.protocol}`).join(', '),
            (unit['port-ranges'] || [])
              .filter(x => x['from-port'] != x['to-port'])
              .map(x => `${x['from-port']}-${x['to-port']}/${x.protocol}`)
              .join(', ')
          ];
          if (ports[1] != '') {
            return ports.join(', ');
          } else {
            return ports[0];
          }
        },
        align: 'left',
        headerStyle: 'width: auto',
        sortable: true
      },
      {
        name: 'series',
        label: 'Series',
        align: 'left',
        headerStyle: 'width: auto',
        field: 'series'
      },
      {
        name: 'message',
        label: 'Message',
        align: 'left',
        headerStyle: 'width: 100%',
        field: (row: Unit) => row['workload-status'].message
      }
    ];
  }

  // TODO: Create agent status enum similar to UnitStatusSeverity ( maybe that is
  // unnecessary )
  unitAgentStatusBadgeColor(agentStatus: string): string {
    if (agentStatus == 'idle') {
      return 'positive';
    } else if (
      agentStatus == 'active' ||
      agentStatus == 'executing' ||
      agentStatus == 'allocating'
    ) {
      return 'warning';
    } else if (agentStatus == 'error') {
      return 'negative';
    } else {
      return 'grey';
    }
  }

  unitStatusSeverityBadgeColor(severity: UnitStatusSeverityString): string {
    const sev = UnitStatusSeverity[severity];

    if (sev == UnitStatusSeverity.active) {
      return 'positive';
    } else if (
      UnitStatusSeverity.active < sev &&
      sev < UnitStatusSeverity.blocked
    ) {
      return 'warning';
    } else {
      return 'negative';
    }
  }

  // Handles the content area resizing and sets `this.pageHeight`
  onResizeContent({ height }: { width: number; height: number }): void {
    this.pageHeight = height;
  }

  // Resizes the footer
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
      this.activeApplicationId = null;
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
    window.appLocalStorage.setItem(SORT_MODELS_LOCAL_STORAGE_KEY, value);
  }

  scrollToElement(el: HTMLElement) {
    const scrollArea = this.$refs.modelScrollArea as QScrollArea;
    const target = scrollArea.getScrollTarget();
    const current = scrollArea.getScrollPosition();
    const diff = offset(el).top;
    const newScroll = current + diff - 122;

    const duration = 100;

    setScrollPosition(target as any, newScroll, duration);
  }

  // Scroll to the unit specified by the route
  @Watch('$route')
  scrollToApp(): void {
    const unitId: string | null = this.$route.query.unitId as string | null;
    // Skip if unit is not specified
    if (!unitId) {
      return;
    }

    // Find the unit
    // let unit;
    let app: FilledApplication | null = null;
    let found = false;
    for (const model of this.models) {
      if (found == true) break;
      for (const candidateApp of model.applications) {
        if (found == true) break;
        for (const candidateUnit of candidateApp.units) {
          if (candidateUnit.lensId == unitId) {
            // unit = candidateUnit;
            app = candidateApp;

            found = true;
            break;
          }
        }
      }
    }

    if (!app) return;

    // Expand the app
    this.$set(this.modelsExpanded, app['model-uuid'], true);

    // Scroll to application after waiting for it's dom element to exist
    setTimeout(
      function check(this: any) {
        if (!app) return;
        const el = document.getElementById(`application-${app.lensId}`);
        if (el) {
          this.scrollToElement(el);
        } else {
          setTimeout(check, 100);
        }
        // This 1200 milisecond wait is here to wait for the expansion of the
        // model animation if necessary.
        // TODO: Make this smarter by tracking the animation status of the
        // model expansion items and forgoeing the delay if it is allready
        // expanded?
        // Or maybe we use the some visibility/screen offset tracker of some sort?
        // Either way we need to fix this for sure.
      }.bind(this),
      1200
    );

    // Show the app details
    this.footerVisible = true;
    this.activeApplicationId = app.lensId;

    // TODO: Hightlight individual unit?
  }

  openLogs(unit: Unit, app: Application): void {
    this.addFloatingWindow({ unit, app, kind: FloatingWindowKind.log });
  }

  openTerminal(unit: Unit, app: Application): void {
    this.addFloatingWindow({ unit, app, kind: FloatingWindowKind.terminal });
  }

  showAppConfigDialog(app: Application): void {
    this.$q.dialog({
      component: AppConfigDialog,
      parent: this,
      app
    });
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

  .hover-grow
    transition all 0.2s

    &:hover
      transform scale(1.1)

  .avatar-stack
    .q-avatar
      transition margin-left 0.2s

    .q-avatar:not(:first-child)
      margin-left -0.4em

    &:hover
      .q-avatar:not(:first-child)
        margin-left inherit

  // This is slightly tricky, and unfortunately may not be stable across Quasar updates,
  // but these styles make sure that the q-select looks fine at a height of only 1.7em
  .app-details-footer__column-select
      height 1.7em

      .q-field__control
        height 1.7em
        min-height 1.7em !important

      .q-field__control-container
        margin 0

      .q-field__native
        min-height 1.7em !important
        height 1.7em !important
        padding-top 0
        padding-bottom 0

      .q-field__append
        min-height 1em !important
        height 1em !important
        padding-top 0
        padding-bottom 0

  .active-application-row
    .body--light &
      background-color $grey-4
    .body--dark &
      background-color $grey-10

  // Small screen use only icons without labels
  @media(max-width: $model-machine-tabs-breakpoint)
    .model-machine-tabs
      .q-tab__label
        display none

  .body--light & .q-bar.top-border
    border-top 1px solid lighten($primary, 10%)

  .body--dark & .q-bar.top-border
    border-top 1px solid darken($primary, 20%)

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
  transition: transform 0.5s
</style>
