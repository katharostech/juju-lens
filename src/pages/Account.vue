<template>
  <q-scroll-area class="absolute fit" :thumb-style="{ width: '5px' }">
    <div class="row justify-center">
      <q-card
        class="column items-center col q-mx-md q-my-lg q-pa-lg shadow-10"
        style="max-width: 60em"
      >
        <q-card-section>
          <div class="text-center text-h3 q-mb-md">My Account Interface</div>
        </q-card-section>
        <q-card-section>
          <q-banner class="bg-warning text-black">
            <template v-slot:avatar>
              <q-icon name="fas fa-exclamation-triangle" class="q-mt-sm" />
            </template>
            We haven't created a concept for this portion of the GUI yet, but we
            would imagine this being the place to access and change your user
            and account settings.
          </q-banner>
        </q-card-section>
      </q-card>
    </div>
  </q-scroll-area>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Account extends Vue {}
</script>
