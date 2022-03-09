<template>
  <div v-if="notFound" class="img-not-found">
    <img
      src="@/assets/img/content-not-found.jpg"
      alt="not-found"
      class="not-found"
      data-test-id="img-not-found"
    />
  </div>
</template>
<script lang="ts">
import axios from "../services/axiosService";
export default {
  data: () => ({
    notFound: false,
    url: null,
  }),
  mounted() {
    axios
      .get(`/url/${this.$route.params.urlId}`)
      .then((resp) => {
        this.url = resp.data;
        window.location.href = this.url.originalUrl;
      })
      .catch((e) => {
        this.notFound = true;
      });
  },
};
</script>
<style scoped>
.img-not-found {
  width: 65%;
  margin: 0 auto;
}

.not-found {
  width: 100%;
}
</style>
