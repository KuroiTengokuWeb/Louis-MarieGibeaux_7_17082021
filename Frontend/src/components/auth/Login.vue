<template>
  <div>
    <h5 class="q-my-sm">Vous avez déjà un compte ?</h5>
    <h6 class="q-my-sm">Se connecter</h6>

    <q-form
      class="authentication q-ma-none"
      ref="emailAuthenticationForm"
      @submit="loginSubmit"
    >

      <!-- Email -->
      <q-input  v-model="email" label="Email" name="email" type="email" color="primary" autocomplete="email" lazy-rules
        :rules="[
          (val) => !!val || '*Champ requis !',
          (val) =>
            (val.includes('@') && val.includes('.')) ||
            '*L\'email est n\'est pas valide !',
        ]"
      >
        <template v-slot:prepend>
          <q-icon name="far fa-envelope" />
        </template>
      </q-input>
      <!-- ./ Email -->

      <!-- Password -->
      <q-input v-model="password" label="Mot de passe" name="password" color="primary" autocomplete="current-password new-password" 
              lazy-rules :rules="[(val) => !!val || '*Champ requis !']" :type="isPwd ? 'password' : 'text'">
        <template v-slot:prepend>
          <q-icon name="fas fa-lock" />
        </template>
        <template v-slot:append>
          <q-icon
            class="cursor-pointer"
            :name="isPwd ? 'visibility_off' : 'visibility'"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <!-- ./ Password -->

      <!-- Actions -->
      <div class="flex justify-end align-center">
        <q-btn
          outlined
          label="Se connecter"
          color="positive"
          type="submit"
          class="self-end"
        />
      </div>
      <!-- ./ Actions -->

      <!-- Forgot password & register Links-->
      <div class="flex column">

        <!-- Register -->
        <a
          href="javascript:void(0)"
          class="text-primary"
          @click="changeFormType('Register')"
          align="center"
          >Vous n'avez pas de compte, inscrivez vous</a
        >
        <!-- ./ Register -->
      </div>
      <!-- ./ Forgot password & register Links -->
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Login",
  data() {
    return {

      email: null,
      isPwd: true,
      password: null,
    };
  },
  props: ["formType"],
  computed:{
    ...mapState('users', { authRole:'role' }),
  },
  methods: {
    ...mapActions("users", ["login"]),

    changeFormType: function (value) {
      this.$emit("toggle-form", value);
    },

    async loginSubmit() {
      const { email, password } = this;
      this.login({ email, password }).then(
        response => {
          this.$q.notify({
            message: `Connexion réussi`,
            color: "positive",
          });
          
          
          this.$router.push({ path: this.authRole == 1 ? '/admin/dashboard': '/posts'  })
          
        },
        error => {
          this.$q.notify({
            message: `Une erreur de connexion est survenue, le mot de passe ou l'email est incorrect.`,
            color: "negative",
          });
      });
    },

  },
};

</script>