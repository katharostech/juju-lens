<template>
  <q-scroll-area class="absolute fit" :thumb-style="{ width: '5px' }">
    <div class="row justify-center">
      <q-card
        class="column items-center col q-mx-md q-my-lg q-pa-lg shadow-10"
        style="max-width: 60em"
      >
        <div class="text-center text-h3 q-mb-md">Juju Lens GUI Prototype</div>
        <a href="https://katharostech.com" class="logo-banner">
          <q-img src="/statics/katharostech-banner.svg" />
        </a>
        <p class="q-ma-md text-body1">
          Welcome to Juju Lens, a GUI prototype developed by
          <a href="https://katharostech.com">Katharos Technology</a>. This
          prototype has been developed as a concept of what we think the Juju
          GUI should be like. We are hoping that this can serve as a reference
          of what works well and what does not as well a test-bed for
          experimentation and feedback for the Juju GUI.
        </p>
        <p class="q-ma-md text-body1">
          This GUI is not connected to any real Juju controllers or models. All
          ineraction is mocked in the browser window without actually making any
          real requests. Request delay times and unit statuses and logs have
          been simulated to give a more real feel. Any changes you make will be
          persisted in the browser window, but can be cleared with the clear
          button below.
        </p>
        <p class="q-ma-md text-body1">
          You can get back to this screen at any time by clicking the info icon
          in the bottom left menu.
        </p>
        <div class="flex justify-center q-gutter-md">
          <q-btn color="primary" label="Get Started" :to="getStartedLink" />
          <q-btn
            color="negative"
            label="Clear Data"
            icon="cancel"
            @click="clearData"
          />
        </div>
      </q-card>
    </div>
  </q-scroll-area>
</template>

<script lang="ts">
import { Location } from 'vue-router';

import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Welcome extends Vue {
  get getStartedLink(): Location {
    const query = this.$route.query;
    const routeTo = query.welcomePageTo;

    if (typeof routeTo == 'string') {
      (query.welcomePageTo as unknown) = undefined;
      return {
        path: routeTo,
        query
      };
    } else {
      return { name: 'home' };
    }
  }

  clearData(): void {
    alert('TODO: Clear persited data');
  }
}
</script>

<style lang="stylus" scoped>
.logo-banner
  display flex;
  width 100%;

  @media(min-width: 800px)
    width 60%;
</style>
