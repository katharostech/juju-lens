<template>
  <q-scroll-area class="absolute fit" :thumb-style="{ width: '5px' }">
    <div class="row justify-center">
      <q-card
        class="column items-center col q-mx-md q-my-lg q-pa-lg shadow-10"
        style="max-width: 60em"
      >
        <div class="text-center text-h3 q-mb-md">Juju Lens</div>
        <a href="https://katharostech.com" class="logo-banner">
          <q-img src="/statics/katharostech-banner.svg" />
        </a>
        <p class="q-ma-md text-body1">
          Welcome to Juju Lens, a Juju GUI developed by
          <a href="https://katharostech.com">Katharos Technology</a>. Juju Lens
          is currently under heavy development and many features are not
          finished yet, but you are free to try it out!
        </p>
        <p class="q-ma-md text-body1">
          Juju Lens allows you to connect to any number of different Juju
          controllers and it will give you a live view into the state of your
          Juju cluster. You can use this instance of Juju Lens without even
          having to deploy anything! Everything runs locally in your browser.
        </p>
        <p class="q-ma-md text-body1">
          You can add controllers to Juju lens in the
          <router-link :to="{ name: 'controllers' }">Controllers</router-link>
          tab by specifying the host and port of the server to connect to along
          with your user credentials. Once you add your controller, Juju Lens
          will connect and start displaying the models, applications, and units
          in the
          <router-link :to="{ name: 'models' }">Models</router-link> tab.
        </p>
        <p class="q-ma-md text-body1">
          Currently, controller connection information, including user
          credentials, are stored in your browser window and persisted across
          restarts. Eventually there will be a convenient way to login and
          logout, but for now you must delete the controller from the
          <router-link :to="{ name: 'controllers' }">Controllers</router-link>
          tab if you want to "logout" of a controller.
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
