import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { Quasar } from "quasar";
import VueSweetalert2 from "vue-sweetalert2";

import "sweetalert2/dist/sweetalert2.min.css";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import axiosPlugin from "./plugins/axios";

const app = createApp(App);

app.config.globalProperties.$axios = axiosPlugin;

app.use(Quasar, {
  plugins: {},
});

app.use(VueSweetalert2);
app.use(createPinia());
app.use(router);

app.mount("#app");
