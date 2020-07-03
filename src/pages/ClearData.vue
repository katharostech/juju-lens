<template>
  <!-- Doesn't need anything -->
  <div></div>
</template>

<script lang="ts">
// TODO: We don't want this page to permanently need to be here, but we need
// a convenient way to clear your local storage for now.
import { LocalStorage } from 'quasar';
import { SEEN_JUJU_GUI_LOCAL_STORAGE_KEY } from '../router/index';
import { JUJU_LOCAL_STORE_NAME } from 'store/juju/actions';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ClearData extends Vue {
  created() {
    LocalStorage.remove(SEEN_JUJU_GUI_LOCAL_STORAGE_KEY);
    LocalStorage.remove(JUJU_LOCAL_STORE_NAME);
    this.$router.replace({ name: 'home' });
    location.reload();
  }
}
</script>
