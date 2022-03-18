<template>
  <div class="q-px-lg q-py-md">
    <div
      data-test-id="waiting-api-response"
      v-if="!urls.length && !notFoundUrls"
      class="text-center"
    >
      <q-spinner-hourglass color="primary" size="8em" />
    </div>
    <q-timeline
      :layout="layout"
      color="primary"
      data-test-id="list-of-urls"
      v-else-if="urls.length && !notFoundUrls"
    >
      <q-timeline-entry heading>
        <h4 class="text-primary">Confira abaixo os 100 links mais acessados</h4>
      </q-timeline-entry>

      <q-timeline-entry
        v-for="(url, index) in ordenedFavorites"
        :key="index"
        class="text-primary"
        data-test-id="favorite-of-list"
        :side="index % 2 == 0 ? 'left' : 'right'"
      >
        <template v-slot:title>
          <a :href="url.id" target="_blank" @click="url.views += 1">
            {{ url.id }}
          </a>
        </template>
        <template v-slot:subtitle>
          {{ index + 1 }}
        </template>
        <div
          class="text-white bg-primary text-center rounded-borders q-py-md q-px-md"
          style="word-break: break-all"
        >
          <q-item>
            <q-item-section avatar>
              <q-icon
                color="white"
                name="star"
                @click="removeFavorite(url.id, url.favorite)"
              />
            </q-item-section>
            <q-item-section>
              <p>visualizações: {{ url.views }}</p>
              <p>link original: {{ url.originalUrl }}</p>
            </q-item-section>
          </q-item>
        </div>
      </q-timeline-entry>
      <q-timeline-entry heading v-if="ordenedFavorites.length">
        <h6 class="text-primary">Favoritos</h6>
      </q-timeline-entry>

      <q-timeline-entry
        v-for="(url, index) in ordenedUrls"
        :key="index"
        class="text-primary"
        data-test-id="url-of-list"
        :side="index % 2 == 0 ? 'left' : 'right'"
      >
        <template v-slot:title>
          <a :href="url.id" target="_blank">
            {{ url.id }}
          </a>
        </template>
        <template v-slot:subtitle>
          {{ index + 1 }}
        </template>
        <div
          class="text-white bg-primary text-center rounded-borders q-py-md q-px-md"
          style="word-break: break-all"
        >
          <q-item>
            <q-item-section avatar v-if="authStore.authenticated">
              <q-icon
                color="white"
                name="star_outline"
                data-test-id="btn-favorite"
                @click="addFavorite(url.id)"
              />
            </q-item-section>
            <q-item-section>
              <p>visualizações: {{ url.views }}</p>
              <p>link original: {{ url.originalUrl }}</p>
            </q-item-section>
          </q-item>
        </div>
      </q-timeline-entry>
    </q-timeline>
    <div v-else data-test-id="not-found-url" class="text-center text-negative">
      <h5>Ainda não foram cadastradas urls no momento</h5>
      <q-icon size="xl" name="sentiment_very_dissatisfied" />
    </div>
  </div>
</template>

<script lang="ts">
import { AuthStore } from "../stores/auth";
export default {
  setup() {
    const authStore = AuthStore();
    return {
      authStore,
    };
  },
  data: () => ({
    urls: [],
    notFoundUrls: false,
    disableBtnFavorite: false,
  }),
  mounted() {
    this.$axios
      .get("url/mostViewed")
      .then((resp) => {
        this.urls = resp.data;
      })
      .catch((e) => {
        this.notFoundUrls = true;
        this.$swal.fire(
          "Erro durante a listagem",
          "Por favor tente novamente mais tarde",
          "error"
        );
      });
  },
  methods: {
    async addFavorite(urlId: string) {
      if (!this.disableBtnFavorite) {
        this.disableBtnFavorite = true;
        const index = this.urls.findIndex((url) => url.id == urlId);
        try {
          const response = await this.$axios.post("/favorite", { urlId });
          this.urls[index].favorite = response.data.id;
        } catch (e) {
          this.urls[index].favorite = null;
          this.$swal.fire(
            "Ocorreu um erro ao favoritar esta url",
            "por favor tente novamente mais tarde",
            "error"
          );
        }
        this.disableBtnFavorite = false;
      }
    },
    async removeFavorite(id: string, favoriteId: string) {
      if (!this.disableBtnFavorite) {
        this.disableBtnFavorite = true;
        const index = this.urls.findIndex((url) => url.id == id);
        try {
          this.urls[index].favorite = null;
          await this.$axios.delete(`/favorite/${favoriteId}`);
        } catch (e) {
          this.urls[index].favorite = id;
          this.$swal.fire(
            "Ocorreu um erro ao remover a url dos favoritos",
            "por favor tente novamente mais tarde",
            "error"
          );
        }
        this.disableBtnFavorite = false;
      }
    },
  },
  computed: {
    layout() {
      return this.$q.screen.lt.sm
        ? "dense"
        : this.$q.screen.lt.md
        ? "comfortable"
        : "loose";
    },
    ordenedUrls() {
      return this.urls.filter((url) => !url.favorite);
    },
    ordenedFavorites() {
      return this.urls.filter((url) => url.favorite);
    },
  },
};
</script>
