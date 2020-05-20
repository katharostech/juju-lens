<template>
  <q-btn round dense color="secondary" :icon="btnIcon" @click="updateDarkMode">
    <q-tooltip>{{ btnTooltip }}</q-tooltip>
  </q-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Todo, Meta } from './models';

@Component
export default class DarkModeToggle extends Vue {
  updateDarkMode(): void {
    const mode = this.$q.dark.mode;

    if (mode === 'auto') {
      this.$q.dark.set(true);
    } else if (mode === false) {
      this.$q.dark.set('auto');
    } else {
      this.$q.dark.set(false);
    }
  }

  get btnIcon(): string {
    const mode = this.$q.dark.mode;
    if (mode === 'auto') {
      return 'brightness_4';
    } else if (mode === false) {
      return 'brightness_5';
    } else {
      return 'brightness_3';
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
