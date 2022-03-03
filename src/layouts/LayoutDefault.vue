<script lang="ts">
import { authStore } from "../stores/auth";
import axios from "../services/axiosService";
import { storeToRefs } from "pinia";
export default {
  setup() {
    const store = authStore();
    const { authenticated, userAuthenticated, tokens } = storeToRefs(store);
    const { signOut } = store;
    return {
      authenticated,
      userAuthenticated,
      tokens,
      signOut,
    };
  },
  name: "LayoutDefault",
  data: () => ({
    tab: "Home",
  }),
  methods: {
    logout() {
      axios.delete(`auth/signout/${this.tokens.refreshToken}`);
      this.signOut();
    },
  },
};
</script>
<template>
  <q-layout style="height: 100vh">
    <q-header elevated class="bg-white text-primary">
      <q-toolbar>
        <img src="@/assets/img/logo-speedio.svg" />
      </q-toolbar>

      <q-tabs v-model="tab">
        <q-route-tab name="Home" label="Home" icon="home" to="/" exact />
        <q-tab name="Top 100" label="Top 100" icon="whatshot" />
        <q-route-tab
          v-if="!authenticated"
          name="Login"
          label="Login"
          icon="person"
          to="/login"
          exact
        />

        <q-btn-dropdown
          v-if="authenticated"
          auto-close
          stretch
          flat
          icon="person"
          :label="userAuthenticated.email"
        >
          <q-list>
            <q-item clickable @click="logout">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-tabs>
    </q-header>

    <q-page-container>
      <q-page>
        <slot></slot>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
