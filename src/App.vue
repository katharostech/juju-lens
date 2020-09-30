<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { loadLogFilter } from 'utils/logging';

import { actionTypes } from 'store/juju/actions';
import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component
export default class App extends Vue {
  @juju.Action(actionTypes.loadControllers) loadControllers!: () => Promise<
    undefined
  >;

  async created(): Promise<void> {
    // Set the dark theme from the local storage
    const darkMode = window.appLocalStorage.getItem('darkMode');
    if (
      darkMode != null &&
      (typeof darkMode == 'boolean' || darkMode == 'auto')
    ) {
      this.$q.dark.set(darkMode);
    }

    // Load the log filter
    loadLogFilter();

    // Load the controllers from the local store
    await this.loadControllers();
  }
}
</script>
