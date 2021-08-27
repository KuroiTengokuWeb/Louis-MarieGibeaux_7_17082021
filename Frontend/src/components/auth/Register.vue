<template>
  <div>
    <h5 class="q-my-sm">Vous n'êtes pas encore inscrit ?</h5>
    <h6 class="q-my-sm">S'inscrire</h6>

    <q-form
      class="authentication q-ma-none"
      ref="emailAuthenticationForm"
      @submit="onSubmit"
    >
      <!-- NAME -->
      <div class="row">
        <!-- firstname -->
        <q-input v-model="firstname" label="Nom" name="firstname" class="col q-pr-sm" color="primary" 
        :rules="[
          (val) => !!val || '*Champ requis !',
        ]"></q-input>
        <!-- ./ firstname -->

       <!-- lastname -->
        <q-input v-model="lastname" label="Prénom" name="lastname" class="col q-pr-sm" color="primary"  
        :rules="[
          (val) => !!val || '*Champ requis !',
        ]"></q-input>
        <!-- ./ lastname -->
      </div>
      <!-- ./ NAME -->


      <!-- Email -->
      <q-input
        
        v-model="email"
        label="Email"
        name="email"
        type="email"
        color="primary"
        autocomplete="email"
        lazy-rules
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

      <!-- Passwords -->
      <div class="row">
        <!-- Password -->
        <q-input v-model="password" label="Mot de passe" name="password" class="col q-pr-sm" color="primary" autocomplete="current-password new-password" lazy-rules
          :rules="[
            (val) => !!val || '*Champ requis !', 
            (val) => val.match(/(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/) || '* le mot de passe doit contenir 6 caractères min dont, 1 Maj, 1 Minuscule, 1 chiffre'
          ]"
          :type="isPwd ? 'password' : 'text'"
        >
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

        <!-- Password Verif -->
        <q-input
          
          v-model="passwordMatch"
          label="Vérification de mot de passe"
          name="passwordMatch"
          class="col q-pl-sm"
          color="primary"
          autocomplete="new-password"
          lazy-rules
          :rules="[
            (val) => !!val || '*Champ requis',
            (val) =>
              val === password || '*Les mots de passe ne correspondent pas',
          ]"
          :type="isPwd ? 'password' : 'text'"
        >
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
        <!-- ./ Password Verif-->
      </div>

      <!-- ./ Passwords -->

      <!-- Actions -->
      <div class="flex justify-end">
        <q-btn outlined label="S'inscrire" color="positive" type="submit" />
      </div>
      <!-- ./ Actions -->

      <!-- Login -->
      <div class="flex column">
        <!-- Login -->
        <a
          href="javascript:void(0)"
          class="text-primary"
          @click="changeFormType('Login')"
          align="center"
          >Vous avez déjà un compte, connectez vous</a
        >
        <!-- ./ Login -->
      </div>
      <!-- ./ Login -->
    </q-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { QSpinnerGears } from "quasar";

export default {
  name: "Register",
  data() {
    return {
     firstname: null,
      lastname: null,
      email: null,
      isPwd: true,
      password: null,
      passwordMatch: null,
    };
  },
  props: ["formType"],
  methods: {
    ...mapActions("users", ["register"]),
    changeFormType: function (value) {
      this.$emit("toggle-form", value);
    },
    onSubmit() {
      const { email, password, firstname, lastname } = this;
      this.register({ email, password, firstname, lastname }).then(
        (response) => {
         this.$q.notify({
              message: `Compte crée`,
              color: "positive",
          });
        }, (error) => {
          console.log(error)
          this.$q.notify({
            message: `Une erreur est surevenue, le formulaire est mal renseigné`,
            color: "negative",
          });
        }
      );
    },
  },
};
</script>