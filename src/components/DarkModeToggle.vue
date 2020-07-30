<template>
  <!-- The old version was a button, but now we use a q-item. Leaving the button code
       here just in case. -->
  <!-- <q-btn
    v-ripple
    round
    dense
    color="secondary"
    :icon="btnIcon"
    @click="updateDarkMode"
  >
    <q-tooltip
      anchor="center left"
      self="center right"
      transition-show="jump-left"
      transition-hide="jump-right"
      >{{ btnTooltip }}</q-tooltip
    >
  </q-btn> -->
  <q-item clickable v-ripple @click="updateDarkMode">
    <q-item-section avatar>
      <q-icon :name="btnIcon" />
    </q-item-section>
    <q-item-section>
      {{ btnLabel }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class DarkModeToggle extends Vue {
  setDarkMode(mode: boolean | 'auto'): void {
    this.$q.dark.set(mode);
    try {
      window.appLocalStorage.setItem('darkMode', mode);
    } catch (e) {
      console.error(e);
    }
  }

  updateDarkMode(): void {
    const dark = this.$q.dark.isActive;

    if (dark === true) {
      this.setDarkMode(false);
    } else {
      this.setDarkMode(true);
    }
  }

  get btnIcon(): string {
    const dark = this.$q.dark.isActive;
    if (dark === true) {
      return 'fas fa-sun';
    } else {
      return 'fas fa-moon';
    }
  }

  get btnLabel(): string {
    const dark = this.$q.dark.isActive;
    if (dark === true) {
      return 'Light Mode';
    } else {
      return 'Dark Mode';
    }
  }
}
</script>
