<template>
  <main>
    <div class="row q-px-md q-pt-md justify-around">
      <q-card class="col-12 col-md-8 q-pa-md" data-test-id="main-card">
        <q-card-section class="text-center">
          <div class="text-h4 text-primary">
            Gere sua url simplificada agora:
          </div>
          <span class="text-primary text-justify">
            Compartilhe links de redes sociais, artigos, videos entre outros de
            forma simplificada.
          </span>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit.prevent="createUrl"
            data-test-id="form-url"
            class="q-gutter-md"
            ref="formUrl"
          >
            <q-input
              bottom-slots
              v-model="formUrl.url"
              label="Cole aqui seu link"
              :dense="false"
              :rules="[
                () => !v$.formUrl.url.required.$invalid || 'Cole aqui seu link',
                () => !v$.formUrl.url.url.$invalid || 'Use um link válido',
              ]"
            >
              <template v-slot:append>
                <q-btn round dense flat icon="link" @click="createUrl" />
              </template>
            </q-input>
          </q-form>
          <div class="q-pa-md">
            <LoadBar ref="loadbar"></LoadBar>
          </div>
          <div ref="progress"></div>
        </q-card-section>
        <div class="q-pa-md" v-if="urlStore.getUrls.length">
          <q-list bordered padding separator class="rounded-borders">
            <q-item
              clickable
              v-ripple
              v-for="(url, index) in urlStore.getUrls"
              :key="index"
            >
              <q-item-section>
                <p>
                  url gerada:
                  <router-link
                    data-test-id="link-generated-url"
                    target="_blank"
                    :to="{ name: 'redirect', params: { urlId: url.id } }"
                  >
                    {{ url.id }}
                  </router-link>
                </p>
                <p>
                  url original:
                  <a
                    data-test-id="link-original-url"
                    target="_blank"
                    style="word-break: break-all"
                    :href="url.originalUrl"
                    >{{ url.originalUrl }}</a
                  >
                </p>
              </q-item-section>
              <q-item-section top side>
                <div class="text-grey-8 q-gutter-xs column">
                  <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="content_copy"
                    data-test-id="copy-btn"
                    @click="copyLink(`${baseUrl}/${url.id}`)"
                  >
                    <q-popup-proxy>
                      <q-banner>
                        <template v-slot:avatar>
                          <q-icon name="content_copy" color="primary" />
                        </template>
                        Link copiado
                      </q-banner>
                    </q-popup-proxy>
                  </q-btn>
                  <q-btn
                    color="red"
                    size="12px"
                    flat
                    dense
                    round
                    icon="delete_outline"
                    data-test-id="delete-btn"
                    v-if="url.userId"
                    @click="deleteUrl(url.id, index)"
                  />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card>
    </div>
  </main>
</template>
<script lang="ts">
import { UrlStore } from "../stores/urls";
import useVuelidate from "@vuelidate/core";
import { required, url } from "@vuelidate/validators";
import axios from "../services/axiosService";
import { AuthStore } from "../stores/auth";
import { copyToClipboard } from "quasar";
import LoadBar from "../components/loadBar.vue";
export default {
  name: "HomeView",
  components: { LoadBar },
  setup() {
    const authStore = AuthStore();
    const urlStore = UrlStore();
    return {
      v$: useVuelidate(),
      authStore,
      urlStore,
    };
  },
  data: () => ({
    formUrl: {
      link: "",
    },
  }),
  validations: () => ({
    formUrl: {
      url: { required, url },
    },
  }),
  computed: {
    baseUrl() {
      return window.location.origin;
    },
  },
  mounted() {
    if (this.authStore.authenticated) {
      axios.get("url").then((resp) => {
        this.urlStore.add(resp.data);
      });
    }
  },
  methods: {
    async createUrl() {
      if (this.v$.formUrl.$invalid) {
        this.$swal.fire("Preencha com um link válido", "", "error");
        this.$refs.formUrl.validate();
      } else {
        this.$refs.loadbar.init();
        try {
          const resp = await axios.post("/url", {
            originalUrl: this.formUrl.url,
          });
          this.urlStore.add(resp.data, !this.authStore.authenticated);
          this.$refs.loadbar.success();
          await this.$swal.fire("Sucesso", "", "success");
        } catch (e) {
          this.$refs.loadbar.fail();
          await this.$swal.fire(
            "Erro durante a criação da url",
            "Tente novamente mais tarde",
            "error"
          );
        }
        this.$refs.loadbar.reset();
      }
    },
    async deleteUrl(id: number, index: number) {
      const proceed = await this.$swal.fire({
        title: "Deseja realmente apagar esta url?",
        showCancelButton: true,
        confirmButtonText: `Deletar`,
        cancelButtonText: `Cancelar`,
      });
      if (proceed.isConfirmed) {
        axios
          .delete(`/url/${id}`)
          .then(() => {
            this.$swal.fire("Url removida com sucesso!", "", "success");
            this.urlStore.remove(index, false);
          })
          .catch((e) => {
            let msg: string;
            if (e.status == 404) {
              msg = "url não encontrada";
            } else {
              msg = "tente novamente mais tarde";
            }
            this.$swal.fire("Erro ao deletar url!", msg, "error");
          });
      }
    },
    copyLink(link: string) {
      copyToClipboard(link);
    },
  },
};
</script>
