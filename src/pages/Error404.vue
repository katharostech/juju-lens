<template>
  <div class="fixed-center text-center">
    <q-icon name="fas fa-ghost" size="10em" class="q-ma-xl" />
    <p class="text-faded">
      Seems this page doesn't exist! <strong>(404)</strong>
    </p>
    <q-btn
      color="secondary"
      style="width:200px;"
      to="/"
      label="Get Back to Awesomeness"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Error404'
});
</script>
