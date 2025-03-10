<script setup lang="ts">
import { RouterView } from 'vue-router'

import projectModal from './components/modals/projectModal.vue';
import taskModal from './components/modals/taskModal.vue';

</script>

<template>
  <projectModal/> <!-- Модальное окно -->
  <taskModal/> <!-- Модальное окно -->

  <RouterView /> <!-- Страница роута -->
</template>

<style lang="scss">
  body {
    background: #fff;
    margin: 0;
  }
  h1 {
    margin: 0;
  }
  h2 {
    margin: 0;
  }
</style>