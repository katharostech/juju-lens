<template>
  <div id="q-app">
    <transition name="router-trans">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
};
</script>

<style lang="stylus">
// Make sure transitioning routes dont cause scroll bar
#q-app
  overflow hidden
  max-height 100vh
  max-width 100vw

// Router transition
.router-trans-enter-active,
.router-trans-leave-active
  transition all .4s ease
  overflow hidden

.router-trans-enter
  opacity 0.3

.router-trans-leave-to
  opacity 0
  transform TranslateY(100%) ScaleX(0.1)
</style>
