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
        v-for="(url, index) in urls"
        :key="index"
        class="text-primary"
        data-test-id="url-of-list"
        :side="index % 2 == 0 ? 'left' : 'right'"
      >
        <template v-slot:title>
          <a :href="url.id">
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
          <p>visualizações: {{ url.views }}</p>
          <p>link original: {{ url.originalUrl }}</p>
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
export default {
  data: () => ({
    urls: [],
    notFoundUrls: false,
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
  computed: {
    layout() {
      return this.$q.screen.lt.sm
        ? "dense"
        : this.$q.screen.lt.md
        ? "comfortable"
        : "loose";
    },
  },
};
</script>
