<template>
  <div class="q-pa-md" v-if="inProgress">
    <q-linear-progress
      data-test-id="load-bar"
      stripe
      size="15px"
      :color="color"
      :value="progress"
    />
  </div>
</template>
<script lang="ts">
export default {
  data: () => ({
    color: "primary",
    progress: 0.0,
    timer: null,
    inProgress: false,
  }),
  methods: {
    init() {
      this.inProgress = true;
      this.timer = setInterval(() => {
        if (this.progress < 1) {
          this.progress += 0.01;
        }
      }, 10);
    },
    success() {
      clearInterval(this.timer);
      this.progress = 1.0;
      this.color = "positive";
    },
    fail() {
      clearInterval(this.timer);
      this.progress = 0.0;
      this.color = "negative";
    },
    reset() {
      this.progress = 0.0;
      this.timer = null;
      this.inProgress = false;
      this.color = "primary";
    },
  },
};
</script>
