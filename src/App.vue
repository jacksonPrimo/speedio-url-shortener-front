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
  font-weight: normal;
}
</style>
