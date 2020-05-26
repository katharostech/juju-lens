<template>
  <!-- This is 'absolute fit' so that the loading overlow covers the whole page -->
  <div class="models absolute fit flex items-stretch">
    <div class="q-pa-xs fit column">
      <!-- Controllers Toolbar -->
      <q-toolbar class="col-auto row">
        <!-- Tabs -->
        <q-tabs inline-label :value="tab" shrink class="q-pa-xs">
          <q-route-tab
            label="Models"
            icon="fas fa-share-alt"
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
        <q-btn color="positive" icon="fas fa-plus" @click="startCreate()" />
      </q-toolbar>
    </div>

    <juju-loading :loading="loading" />
  </div>
</template>

<script lang="ts">
import JujuLoading from 'components/JujuLoading.vue';

import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    JujuLoading
  }
})
export default class Index extends Vue {
  loading = false;
  tab = 'models';
}
</script>
