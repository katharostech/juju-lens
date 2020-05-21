<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  created(): void {
    // Set the dark theme from the local storage
    const darkMode = this.$q.localStorage.getItem('darkMode');
    if (
      darkMode != null &&
      (typeof darkMode == 'boolean' || darkMode == 'auto')
    ) {
      this.$q.dark.set(darkMode);
    }
  }
}
</script>
