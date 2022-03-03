<script setup lang="ts">
import { RouterView } from "vue-router";
import LayoutDefault from "./layouts/LayoutDefault.vue";
</script>

<template>
  <LayoutDefault>
    <RouterView />
  </LayoutDefault>
</template>

<style>
@import "@/assets/base.css";

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}
</style>
