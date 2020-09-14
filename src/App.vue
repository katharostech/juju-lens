<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { actionTypes } from 'store/juju/actions';
import { namespace } from 'vuex-class';
const juju = namespace('juju');

@Component
export default class App extends Vue {
  @juju.Action(actionTypes.loadControllers) loadControllers!: () => Promise<
    undefined
  >;

  mounted(): void {
    this.fixEdgeBug();
  }

  updated(): void {
    this.fixEdgeBug();
  }

  fixEdgeBug() {
    if (window.navigator.userAgent.includes('Edge/')) {
      //
      // Microsoft Edge Bug fix: go and "jiggle" all of the q-img spacer divs in
      // order to make edge re-evaluate their size and properly position the
      // image.
      //

      console.log('"touching" q-img elements to fix Edge rendering bug"');
      // Get all q-img elements
      const els = this.$el.querySelectorAll('.q-img div:first-child');
      // For each q-img element
      els.forEach((x: any) =>
        // Wait one millisecond
        setTimeout(() => {
          // Add one hundredth of a percent to the padding to cause re-evaluation
          x.style.paddingBottom =
            parseFloat(x.style.paddingBottom.replace('%', '')) + 0.01 + '%';
        }, 50)
      );
    }
  }

  async created(): Promise<void> {
    // Set the dark theme from the local storage
    const darkMode = window.appLocalStorage.getItem('darkMode');
    if (
      darkMode != null &&
      (typeof darkMode == 'boolean' || darkMode == 'auto')
    ) {
      this.$q.dark.set(darkMode);
    }

    // Load the controllers from the local store
    await this.loadControllers();
  }
}
</script>
