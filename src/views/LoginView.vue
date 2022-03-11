<template>
  <div class="row q-px-md q-pt-md justify-around">
    <q-card class="col-12 col-md-4 q-pa-md">
      <q-card-section>
        <div class="text-h6 text-primary">Já é um usuário? Faça login:</div>
      </q-card-section>
      <q-form
        data-test-id="form-signin"
        @submit="login"
        class="q-gutter-md"
        ref="formSignin"
      >
        <q-input
          data-test-id="email-signin"
          v-model="formSignin.email"
          label="Email"
          lazy-rules
          :rules="[
            () =>
              !v$.formSignin.email.required.$invalid ||
              'Email é um campo obrigatório',
            () =>
              !v$.formSignin.email.email.$invalid ||
              'Preencha com um email valido',
          ]"
        />
        <q-input
          v-model="formSignin.password"
          data-test-id="password-signin"
          label="Senha"
          :type="showSigninPassword ? 'password' : 'text'"
          :rules="[
            () =>
              !v$.formSignin.password.required.$invalid ||
              'Senha é um campo obrigatório',
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="showSigninPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showSigninPassword = !showSigninPassword"
            />
          </template>
        </q-input>
        <q-btn
          data-test-id="btn-submit-signin"
          label="Entrar"
          outline
          color="primary"
          type="submit"
        />
      </q-form>
    </q-card>
    <q-card class="col-12 col-md-6 q-pa-md">
      <q-card-section>
        <div class="text-h6 text-primary">
          Ainda não é um usuário? Não perca tempo cadastre-se agora:
        </div>
      </q-card-section>
      <q-form @submit="register">
        <div class="row">
          <div class="col">
            <q-input
              data-test-id="email-signup"
              v-model="formSignup.email"
              label="Email"
              lazy-rules
              :rules="[
                () =>
                  !v$.formSignup.email.required.$invalid ||
                  'Email é um campo obrigatório',
                () =>
                  !v$.formSignup.email.email.$invalid ||
                  'Preencha com um email valido',
              ]"
            />
          </div>
        </div>
        <div class="row justify-between">
          <div class="col-6">
            <q-input
              data-test-id="name-signup"
              v-model="formSignup.name"
              label="Nome"
              :rules="[
                () =>
                  !v$.formSignup.name.required.$invalid ||
                  'Nome é um campo obrigatório',
              ]"
            />
          </div>
          <div class="col-5">
            <q-input
              data-test-id="password-signup"
              v-model="formSignup.password"
              :type="showSignupPassword ? 'password' : 'text'"
              label="Senha"
              :rules="[
                () =>
                  !v$.formSignup.password.required.$invalid ||
                  'Senha é um campo obrigatório',
                () =>
                  !v$.formSignup.password.minLength.$invalid ||
                  'Use uma senha maior por questão de segurança',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="showSignupPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showSignupPassword = !showSignupPassword"
                />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-mt-lg">
          <q-btn
            data-test-id="btn-submit-signup"
            label="Cadastrar"
            outline
            color="primary"
            type="submit"
          />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script lang="ts">
import useVuelidate from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { AuthStore } from "../stores/auth";
export default {
  setup() {
    const store = AuthStore();
    return {
      v$: useVuelidate(),
      store,
    };
  },
  data: () => ({
    formSignin: {
      email: "",
      password: "",
    },
    showSigninPassword: false,
    formSignup: {
      email: "",
      name: "",
      password: "",
    },
    showSignupPassword: false,
  }),
  validations: () => ({
    formSignin: {
      email: { required, email },
      password: { required },
    },
    formSignup: {
      email: { required, email },
      name: { required },
      password: { required, minLength: minLength(6) },
    },
  }),
  methods: {
    login() {
      if (this.v$.formSignin.$invalid) {
        this.$swal.fire("Preencha todos os dados corretamente", "", "error");
        this.$refs.formSignin.validate();
      } else {
        this.$axios
          .post("/auth/signin", this.formSignin)
          .then((resp) => {
            this.store.signIn(resp.data);
            this.$router.push("/");
          })
          .catch((error) => {
            let message = "";
            switch (error.response.data.message) {
              case "Password or email invalid":
                message = "Email ou senha incorreto(a)";
                break;
              case "Internal server error":
                message =
                  "Ocorreu um erro inesperado, por favor tente mais tarde";
                break;
            }
            this.$swal.fire(message, "", "error");
          });
      }
    },
    register() {
      if (this.v$.formSignup.$invalid) {
        this.$swal.fire("Preencha todos os dados corretamente", "", "error");
        this.$refs.formSignup.validate();
      } else {
        this.$axios
          .post("auth/signup", this.formSignup)
          .then(() => {
            this.$swal.fire(
              "Cadastro efetuado com sucesso",
              "Agora efetue login para prosseguir",
              "success"
            );
          })
          .catch((e) => {
            let message = "";
            switch (e.response.data.message) {
              case "Email already in use":
                message = "Este email já está e uso";
                break;
              case "Internal server error":
                message =
                  "Ocorreu um erro inesperado, por favor tente mais tarde";
                break;
            }
            this.$swal.fire(message, "", "error");
          });
      }
    },
  },
};
</script>
