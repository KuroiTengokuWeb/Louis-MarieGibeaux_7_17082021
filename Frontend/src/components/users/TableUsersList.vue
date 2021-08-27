<template>
    <q-expansion-item
        class="shadow-1 overflow-hidden"
        label="Liste des utilisateurs"
        header-class="bg-primary text-white"
        expand-icon-class="text-white"
        default-opened>  

        <!-- Card -->
        <q-card v-if="usersList">
            <!-- Title -->
            <q-card-section class="row align-center justify-bewteen">
                <div class="text-h6 col">Liste des utilisateurs</div>
            </q-card-section>
            <!-- ./ Title -->
            
            <!-- Table -->
            <q-table title=""  row-key="firstname" :rows="usersList" :columns="columns" :filter="filter">

                <!-- Filters -->
                <template v-slot:top-right>
                    <div class="flex">
                        <!-- Search input -->
                        <div class="q-pl-sm">
                            <q-input  dense debounce="300" v-model="filter" placeholder="Rechercher">
                                <template v-slot:append>
                                    <q-icon name="search" />
                                </template>
                            </q-input>
                        </div>
                        <!-- ./ Search input -->
                    </div>
                </template>
                <!-- ./ Filters -->

                <!-- Body slot -->
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="id" :props="props">{{ props.row.id }}</q-td>
                        <q-td key="firstname" :props="props">{{ props.row.firstname }}</q-td>
                        <q-td key="lastname" :props="props">{{ props.row.lastname }}</q-td>
                        <q-td key="email" :props="props">{{ props.row.email }}</q-td>
                        <q-td key="role" :props="props">  
                            <q-icon v-if="props.row.isAdmin" name="fas fa-crown" /> 
                            <q-icon v-if="!props.row.isAdmin" name="fas fa-user" /> 
                        </q-td>

                        <q-td key="actions" :props="props">
                            <q-btn  push color="primary" aria-label="voir le post" size="sm" icon="far fa-eye" :to="{ name: 'adminUserProfile', params:{id : props.row.id } }" >
                                <q-tooltip  class="bg-primary text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">voir le profil</q-tooltip> 
                            </q-btn>
                            <q-btn  push class="q-mx-sm" aria-label="éditer le post" color="purple-7" size="sm" icon="edit" @click="usersFormModel = true; setUser(props.row)"  >
                                 <q-tooltip  class="bg-purple-7 text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">éditer l'utilisateur</q-tooltip> 
                            </q-btn>
                            <q-btn  push color="negative" aria-label="supprimer le post" size="sm" icon="delete_outline"  @click="deleteConfirm = true; setUser(props.row)"  >
                                 <q-tooltip  class="bg-negative text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">supprimer le profil</q-tooltip> 
                            </q-btn>
                        </q-td>
                    </q-tr>
                </template>
                <!-- ./ Body slot -->

            </q-table>
            <!-- ./  Table -->
        
        </q-card>
        <!-- ./ Card -->

        <!-- Modal : Users Form-->
        <q-dialog v-model="usersFormModel" persistent="persistent"  @before-hide="selectedUser = null">
            <users-form :selectedUser="selectedUser" @close-modal="closeModal"/>
        </q-dialog>
        <!-- ./ Modal : Users Form -->   

        <!-- Modal : Confirm delete-->
        <q-dialog v-model="deleteConfirm" persistent @before-hide="selectedUser = null">
           <confirm-delete 
            @delete-entity="deleteUserSubmit"
            title="Suppression d'un utilisateur" 
            :content="'Voulez-vous vraiment supprimer l\'utilisateur ' + selectedUser.id +' ?'" 
           />
        </q-dialog>
        <!-- ./ Modal : Confirm delete-->
    </q-expansion-item>
</template>

<script>
import UsersForm from './UsersForm.vue'
import ConfirmDelete from '../modals/ConfirmDelete.vue'
import { mapActions, mapState } from 'vuex'

export default {
    name:'AdminUsersList',
    
    data(){
		return {
            /////////////////////////////
            /// selectedUser 
            selectedUser : null,
            /////////////////////////////
            /// Form
            usersFormModel : false,
            deleteConfirm : false,
			/////////////////////////////
			/////////////////////////////
			/// Table
			filter:'',
			loading: false,
			pagination: {
				sortBy: 'desc',
				descending: false,
				page: 1,
				rowsPerPage: 3,
				rowsNumber: 10
			},
			//Columns
			columns: [
				{ name: 'id', align: 'left', label: '#', field: 'id', sortable: true },
				{
					name: 'firstname',
					required: true,
					label: 'Nom',
					align: 'left',
					field: row => row.firstname,
					format: val => `${val}`,
					sortable: true
				},
                {
					name: 'lastname',
					required: true,
					label: 'Prénom',
					align: 'left',
					field: row => row.lastname,
					format: val => `${val}`,
					sortable: true
				},
                { name: 'email', align: 'left', label: 'Email', field: 'email', sortable: true },
                { name: 'role', align: 'left', label: 'Role', field: 'isAdmin', sortable: true },
			    { name: 'actions', align: 'left', label: 'Actions', field: '', sortable: false },
			],
            // data
           // usersList: tabDatas
		}
    },

    components : { UsersForm, ConfirmDelete },
    computed : {
        /////////////////////////////
        /// Get userList state
        ...mapState('users', { usersList:'usersList' }),
    },

    methods:{
         /////////////////////////////
        /// Actions from Store
        ...mapActions('users', ['deleteUser']),
        

        /////////////////////////////
        /// Set User
        setUser(user){
            this.selectedUser = user
        },
        /////////////////////////////
        /// delete User
        async deleteUserSubmit(){
            try {
                await this.deleteUser(this.selectedUser)

                this.$q.notify({ message: `L'élément à bien été supprimé`, color: 'positive' })
                this.closeModal()
            } catch (err) {
                this.$q.notify({ message: `Une erreur est survenu lors de la suppression`, color: 'negative' })
            } 
        },

        /////////////////////////////
        /// Event emit par le form
        closeModal(){
            this.usersFormModel = false;
            this.deleteConfirm = false;
            this.selectedUser = null;
        }
    },

    created(){
        this.$store.dispatch('users/getAllUsers')
    }
}
</script>