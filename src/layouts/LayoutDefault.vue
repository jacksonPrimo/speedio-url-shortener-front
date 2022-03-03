<script lang="ts">
export default {
  name: "LayoutDefault",
  data: () => ({ tab: "images" }),
};
</script>
<template>
  <q-layout style="height: 100vh">
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <img src="@/assets/img/logo-speedio.svg" />
      </q-toolbar>

      <q-tabs v-model="tab">
        <q-tab name="Home" label="Home" icon="home" />
        <q-tab name="Login" label="Login" icon="person" />
        <q-tab name="Top 100" label="Top 100" icon="whatshot" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <q-page>
        <slot></slot>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
