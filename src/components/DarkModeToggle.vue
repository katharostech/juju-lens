<template>
  <q-btn
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
  </q-btn>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class DarkModeToggle extends Vue {
  setDarkMode(mode: boolean | 'auto'): void {
    this.$q.dark.set(mode);
    try {
      this.$q.localStorage.set('darkMode', mode);
    } catch (e) {
      console.error(e);
    }
  }

  updateDarkMode(): void {
    const mode = this.$q.dark.mode;

    if (mode === 'auto') {
      this.setDarkMode(true);
    } else if (mode === false) {
      this.setDarkMode('auto');
    } else {
      this.setDarkMode(false);
    }
  }

  get btnIcon(): string {
    const mode = this.$q.dark.mode;
    if (mode === 'auto') {
      return 'brightness_4';
    } else if (mode === false) {
      return 'fas fa-sun';
    } else {
      return 'fas fa-moon';
    }
  }

  get btnTooltip(): string {
    const mode = this.$q.dark.mode;
    if (mode === 'auto') {
      return 'Auto Dark Mode';
    } else if (mode === false) {
      return 'Light Mode';
    } else {
      return 'Dark Mode';
    }
  }
}
</script>
