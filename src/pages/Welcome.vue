<template>
  <q-scroll-area class="absolute fit" :thumb-style="{ width: '5px' }">
    <div class="row justify-center">
      <q-card
        class="column items-center col q-mx-md q-my-lg q-pa-lg shadow-10"
        style="max-width: 60em"
      >
        <div class="text-center text-h3 q-mb-md">Juju Lens</div>
        <div class="text-center text-h6 q-mb-md">By <a href="https://katharostech.com" target="_blank">Katharos Technology</a></div>
        <a href="https://katharostech.com" class="logo-banner" target="_blank">
          <img src="/katharostech-banner.svg" width="100%" height="100%" />
        </a>
        <p class="q-ma-md text-body1">
          Welcome to Juju Lens! Juju Lens is an Open Source
          <a href="https://jaas.ai" target="_blank">Juju</a> web and desktop application by
          <a href="https://katharostech.com" target="_blank">Katharos Technology</a>.
        </p>
        <p class="q-ma-md text-body1">
          Juju Lens allows you to connect to any number of different Juju
          controllers and it will give you a live view into the state of your
          Juju cluster. To get started all you have to do is add a controller!
        </p>
        <div class="flex justify-center q-gutter-md q-mt-md">
          <q-btn
            color="positive"
            icon="fas fa-location-arrow"
            label="Get Started!"
            :to="getStartedLink"
          />
          <q-btn
            type="a"
            target="_blank"
            href="https://github.com/katharostech/juju-lens"
            color="primary"
            icon="fab fa-github"
            label="GitHub Repo"
          />
        </div>
      </q-card>
    </div>
  </q-scroll-area>
</template>

<script lang="ts">
import { Location } from 'vue-router';

import { actionTypes as jujuActionTypes } from 'store/juju/actions';
import { namespace } from 'vuex-class';
const juju = namespace('juju');

import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Welcome extends Vue {
  @juju.Action(jujuActionTypes.logout) logout!: () => void;

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
      return { name: 'controllers' };
    }
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
