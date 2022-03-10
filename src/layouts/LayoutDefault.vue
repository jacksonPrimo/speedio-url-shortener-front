<script lang="ts">
import axios from "../services/axiosService";
import { AuthStore } from "../stores/auth";
import { UrlStore } from "../stores/urls";
export default {
  setup() {
    const authStore = AuthStore();
    const urlStore = UrlStore();
    return {
      authStore,
      urlStore,
    };
  },
  name: "LayoutDefault",
  data: () => ({
    tab: "Home",
  }),
  methods: {
    logout() {
      axios.delete(`auth/signout/${this.authStore.getRefreshToken}`);
      this.urlStore.reset();
      this.authStore.signOut();
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

      <q-tabs v-model="tab" inline-label>
        <q-route-tab name="Home" label="Home" icon="home" to="/" exact />
        <q-route-tab
          name="Top 100"
          label="Top 100"
          icon="whatshot"
          to="/top100"
          data-test-id="link-to-top100"
          exact
        />
        <q-route-tab
          v-if="!authStore.authenticated"
          name="Login"
          label="Login"
          icon="person"
          to="/login"
          exact
          data-test-id="link-to-login"
        />

        <q-btn-dropdown
          data-test-id="user-authenticated-email"
          v-else
          auto-close
          stretch
          flat
          icon="person"
          :label="authStore.userAuthenticated.email"
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
