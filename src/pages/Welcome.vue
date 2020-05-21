<template>
  <q-page class="row justify-center content-start">
    <q-card
      class="col q-mx-md q-mt-lg q-pa-lg shadow-10"
      style="max-width: 60em"
    >
      <div class="text-center text-h3 q-mb-md">Juju GUI Prototype</div>
      <p class="q-ma-md text-body1">
        This is a Juju GUI prototype developed by
        <a href="https://katharostech.com">Katharos Technology</a>. All
        interaction with the GUI is mocked without going to any real Juju
        controller.
      </p>
      <p class="q-ma-md text-body1">
        The purpose of this GUI prototype is to demonstrate our ideas for a Juju
        GUI interface and provide a practical area in which we can experiment
        with the Juju GUI user experience.
      </p>
      <p class="q-ma-md text-body1">
        You are free to interact with anything in this GUI mock-up and the
        results will be persisted inside of your browser window.
      </p>
      <div class="flex justify-center">
        <q-btn color="primary" label="Get Started" :to="getStartedLink" />
      </div>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import DarkModeToggle from 'components/DarkModeToggle.vue';
import { Location } from 'vue-router';

import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    DarkModeToggle
  }
})
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
}
</script>
