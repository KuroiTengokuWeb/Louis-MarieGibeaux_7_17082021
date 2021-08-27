<template>
    <div v-if="selectedUser">
        <!-- Card -->
        <q-card class="my-card">
            <!-- Header Card-->
            <q-item class="bg-primary">
                <!-- Avatar -->
                <q-item-section avatar>
                    <q-avatar>
                        <img :src="selectedUser.imageUrl ? selectedUser.imageUrl : require('assets/icon.svg')">
                    </q-avatar>
                </q-item-section>
                <!-- ./ Avatar -->

                <!-- Informations -->
                <q-item-section>
                    <q-item-label class="text-white">
                        {{selectedUser.firstname}} {{selectedUser.lastname}}  <small class="text-caption text-italic text-weight-light">( {{selectedUser.isAdmin ? 'Admin' : 'Utilisateur'}} )</small>
                   </q-item-label>
                    <q-item-label caption class="text-white text-weight-light"><q-icon name="far fa-envelope" />  {{selectedUser.email}}</q-item-label>
                </q-item-section>
                <!-- ./ Informations -->
            </q-item>
            <!-- ./ Header Card-->
                    
             <q-separator />
                    
            <!-- Card section -->
            <q-card-section>
                <q-banner dense class="bg-grey-3 ">{{selectedUser.bio}}</q-banner>
            </q-card-section>
            <!-- ./ Card Section -->

            <q-separator />

            <!-- Card Action -->
            <q-card-actions class="flex items-center justify-between">
                <!-- Created at -->
                <div class="q-ma-none flex items-center">
                    <q-icon name="far fa-calendar" /> <p class="text-overline q-my-none q-ml-sm">{{formatDate(selectedUser.createdAt)}}</p>
                </div>
                <!-- ./ Created at -->

                <!-- Actions Btn -->
                <q-btn color="grey-7" round flat icon="more_vert">
                    <q-menu transition-show="jump-down" transition-hide="jump-up" auto-close>
                        <q-list>
                            <q-item clickable @click="usersFormModel = true;">
                                <q-item-section>Modifier</q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item clickable @click="deleteConfirm = true;" >
                                <q-item-section >Supprimer</q-item-section>
                               </q-item>
                        </q-list>
                    </q-menu>
                   </q-btn>
                <!-- ./ Actions Btn -->
            </q-card-actions>
             <!-- ./ Card Action -->
        </q-card>
        <!-- ./ Card -->

      
        <!-- Modal : Users Form-->
        <q-dialog v-model="usersFormModel" persistent >
            <users-form :selectedUser="selectedUser" @close-modal="closeModal"/>
        </q-dialog>
        <!-- ./ Modal : Users Form -->   

        <!-- Modal : Confirm delete-->
        <q-dialog v-model="deleteConfirm" persistent>
           <confirm-delete 
            @delete-entity="deleteUserSubmit"
            title="Suppression d'un utilisateur" 
            :content="'Voulez-vous vraiment supprimer l\'utilisateur ' + selectedUser.id +' ?'" 
           />
        </q-dialog>
        <!-- ./ Modal : Confirm delete-->
    </div>
</template>

<script>
import UsersForm from './UsersForm.vue'
import ConfirmDelete from '../modals/ConfirmDelete.vue'
import { mapState, mapActions } from 'vuex'
import {date} from 'quasar'

export default {
    name:'UserProfile',
    components: { UsersForm, ConfirmDelete },
    data(){
        return {
            /////////////////////////////
            /// Form
            usersFormModel : false,
            deleteConfirm : false,
        }
    },

    computed : {
        /////////////////////////////
        /// Get user
        ...mapState('users', { selectedUser:'selectedUser' }),
        ...mapState('users', { authUserId:'uid' }),
    },

    methods:{
        /////////////////////////////
        /// Actions from Store
        ...mapActions('users', ['deleteUser', 'logout']),

        /////////////////////////////
        /// formatDate
       formatDate(dateToFormat){
           return  date.formatDate(dateToFormat, 'DD-MM-YYYY')
       },
        /////////////////////////////
        /// delete Post
        async deleteUserSubmit(){
            try {
                await this.deleteUser(this.selectedUser)

                this.$q.notify({ message: `Le compte à bien été supprimé`, color: 'positive' })
                this.closeModal()
                if(this.selectedUser.id == this.authUserId){
                   this.logout()
                   this.$router.push('/')
                }
                else this.$router.push('/admin/dashboard')
            } catch (err) {
                this.$q.notify({ message: `Une erreur est survenu lors de la suppression`, color: 'negative' })
            } 
        },

        /////////////////////////////
        /// Event emit par le form
        closeModal(){
            this.usersFormModel = false;
            this.deleteConfirm = false;
        },
    },

 
}
</script>