<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="~assets/logo.svg" />
          </q-avatar>
          Juju Lens
        </q-toolbar-title>
        <q-space />
        <dark-mode-toggle />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-card
        class="welcome-block fixed-center shadow-10 q-pa-lg column items-center justify-center"
      >
        <div class="text-h3 q-mb-md col">Juju GUI Prototype</div>
        <p class="col text-body1">
          This is a Juju GUI prototype developed by
          <a href="https://katharostech.com">Katharos Technology</a>. All
          interaction with the GUI is mocked without going to any real Juju
          controller.
        </p>
        <p class="col text-body1">
          The purpose of this GUI prototype is to demonstrate our ideas for a
          Juju GUI interface and provide a practical area in which we can
          experiment with the Juju GUI user experience.
        </p>
        <p class="col text-body1">
          You are free to interact with anything in this GUI mock-up and the
          results will be persisted inside of your browser window.
        </p>
        <q-btn color="primary" label="Get Started" :to="{ name: 'home' }" />
      </q-card>
    </q-page-container>
  </q-layout>
</template>

<script>
import DarkModeToggle from 'components/DarkModeToggle';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    DarkModeToggle
  }
})
export default class Welcome extends Vue {}
</script>

<style lang="stylus"></style>
