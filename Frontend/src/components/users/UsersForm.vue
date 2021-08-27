<template>
    <div class="full-width bg-white">
        <!-- TOOLBAR -->
        <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>{{formTitle}}</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <!-- ./ TOOLBAR -->

        <!-- Form -->
        <q-form class="full-height q-pa-md" ref="usersForm" @submit="saveData">
            <!-- FistName -->
            <q-input  v-model="firstname" label="Nom" name="firstname" color="primary"
                     lazy-rules :rules="[val => !!val || '*Champ requis !']">
            </q-input>
            <!-- ./ FirstName -->

            <!-- LastName -->
            <q-input  v-model="lastname" label="Prénom" name="lastname" color="primary"
                     lazy-rules :rules="[val => !!val || '*Champ requis !']">
            </q-input>
            <!-- ./ LastName -->

             <!-- Email -->
            <q-input   v-model="email" label="Email" name="email" type="email" 
                     color="primary" autocomplete="email" 
                     lazy-rules :rules="[ val =>  !!val || '*Champ requis !', val => val.includes('@') && val.includes('.') || '*L\'email est n\'est pas valide !']">
                <template v-slot:prepend>
                    <q-icon name="far fa-envelope" />
                </template>
            </q-input>
            <!-- ./ Email -->

            <!-- Password -->
            <q-input   v-model="password"  label="Mot de passe" name="password"
                     color="primary" autocomplete="current-password new-password" 
                      :type="isPwd ? 'password' : 'text'">
                <template v-slot:prepend>
                    <q-icon name="fas fa-lock" />
                </template>
                <template v-slot:append>
                    <q-icon class="cursor-pointer" :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" />
                </template>                
            </q-input>
            <!-- ./ Password -->

             <!-- Bio -->
            <q-input  v-model="bio" type="textarea" label="Bio" name="bio" color="primary" class="q-my-md">
            </q-input>
            <!-- ./ Bio -->

            <!-- file -->
            <q-file  class="q-mb-md" v-model="file">
                <template v-slot:prepend>
                     <q-icon name="attach_file" />
                </template>
            </q-file>
            <!-- ./file -->

            <!-- Admin -->
            <div class="q-pa-xs" v-if="!isMyProfileUrl">
                <q-toggle v-model="isAdmin" size="lg" color="green" label="Admin" right-label  
                          unchecked-icon="fas fa-user" checked-icon="fas fa-crown"/>
            </div>
            <!-- ./ Admin -->

            <q-separator horizontal class="q-my-md" />

            <!-- Actions -->
            <div class="row justify-end q-px-none ">
                <q-btn push color="grey-7 q-mr-md" label="Annuler" style="min-width:6em;" v-close-popup ></q-btn>
                <q-btn push color="primary" type="submit" label="Enregistrer" style="min-width:6em; "></q-btn>
            </div>
            <!-- ./ Actions -->
        </q-form>
        <!-- ./ Form -->
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import { ref } from 'vue'

export default {
    name:'UsersForm',
    data(){
        return {
            ////////////////////////////
            // Upload
            file: ref(null),
            ////////////////////////////
            // FormTitle
            formTitle: 'Ajouter un utilisateur',
            /////////////////////////////
            /// Form Fields
            id: this.selectedUser ? this.selectedUser.id : null,
            firstname: this.selectedUser ? this.selectedUser.firstname : null,
            lastname: this.selectedUser ? this.selectedUser.lastname : null,
            email: this.selectedUser ? this.selectedUser.email : null,
            isAdmin : this.selectedUser ? this.selectedUser.isAdmin : false,
            bio : this.selectedUser ? this.selectedUser.bio : null,
            password : null,
            isPwd: true,
            isRequiredField : this.selectedUser != null,
            imageUrl : this.selectedUser ? this.selectedUser.imageUrl :null,
            isMyProfileUrl : false
        }
    },
    
    props:['selectedUser'],

    computed:{ 
        ...mapState('users', {authUserRole:'role'})
    },
    methods : {
        /////////////////////////////
        /// Actions from Store
        ...mapActions('users', ['updateUser']),
        
        ////////////////////////////
        // Save data
        async saveData(){
            //Vars
            const { id, firstname, lastname, email, password, isAdmin, bio, imageUrl, file } = this

            try {
                // peut etre betise ici
                const UserObject = { 
                    id:id, 
                    firstname:firstname,
                    lastname:lastname, 
                    email:email,
                    password:password,
                    isAdmin:isAdmin, 
                    bio:bio,
                    imageUrl: imageUrl,
                    file: file
                };

                if(id != null || id != undefined) await this.updateUser(UserObject)
                else await this.createUser(UserObject)

                this.$q.notify({ message: `L'élément à bien été éditer`, color: 'positive' })
                this.$emit('close-modal')
            } catch (err) {
                this.$q.notify({ message: `Une erreur est survenu dans le formulaire `, color: 'negative' })
            } 
        }
    },

    created(){
        this.formTitle =  this.selectedUser ? 'Modifier un utilisateur': 'Ajouter un utilisateur';
        this.isMyProfileUrl = this.$route.name == "userProfile" || this.authUserRole == 0
    },
}
</script>