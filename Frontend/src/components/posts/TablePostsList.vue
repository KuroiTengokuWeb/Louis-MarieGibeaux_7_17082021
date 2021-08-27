<template>
    <q-expansion-item
        class="shadow-1 overflow-hidden"
        label="Liste des posts"
        header-class="bg-primary text-white"
        expand-icon-class="text-white"
        default-opened>  
    
        <!-- Card -->
        <q-card >
            <!-- Title -->
            <q-card-section class="row align-center justify-bewteen">
                <div class="text-h6 col">Liste des posts</div>
                <div class="flex justify-end col">
                    <q-btn  push color="primary" aria-label="ajouter un post" size="sm" icon="fas fa-plus" @click="postsFormModel = true" >
                        <q-tooltip  class="bg-primary text-body2" anchor="center left" self="center right" :offset="[10, 10]">ajouter un post</q-tooltip> 
                    </q-btn>
                </div>
            </q-card-section>
            <!-- ./ Title -->

            <!-- Table -->
            <q-table  title=""  row-key="id" :rows="!isUserProfile ? postsList : usersPostList" :columns="columns" :visible-columns="visibleColumns" :filter="filter">

                <!-- Filters -->
                <template v-slot:top-right>
                    <div class="flex">
                        <!-- Search input -->
                        <div class="q-pl-sm">
                            <q-input dense debounce="300" v-model="filter" placeholder="Rechercher">
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
                        <q-td key="userId" :props="props" v-if="!isUserProfile">{{ props.row.User.firstname }} {{props.row.User.lastname}}</q-td>
                        <q-td key="title" :props="props">{{ props.row.title }}</q-td>
                        <q-td key="content" :props="props">{{ props.row.content }}</q-td>
                        <q-td key="created" :props="props">{{ formatDate(props.row.createdAt) }}</q-td>
                        
                        <q-td key="actions" :props="props">
                            <q-btn  push color="primary" aria-label="voir le post" size="sm" icon="far fa-eye" :to="{ name: !isAdminDashboard ? 'post' : 'adminPost', params:{id : props.row.id } }" >
                                <q-tooltip  class="bg-primary text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">voir le post</q-tooltip> 
                            </q-btn>
                            <q-btn  push color="purple-7" aria-label="éditer le post" class="q-mx-sm" size="sm" icon="edit" @click="postsFormModel = true; setPost(props.row)" >
                                <q-tooltip  class="bg-purple-7 text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">éditer le post</q-tooltip> 
                            </q-btn>
                            <q-btn  push color="negative" aria-label="supprimer le post" size="sm" icon="delete_outline"  @click="deleteConfirm = true; setPost(props.row)" >
                                <q-tooltip  class="bg-negative text-body2" anchor="top middle" self="bottom middle" :offset="[10, 10]">supprimer le post</q-tooltip> 
                            </q-btn>
                        </q-td>
                    </q-tr>
                </template>
                <!-- ./ Body slot -->

            </q-table>
            <!-- ./  Table -->
        
        </q-card>
        <!-- ./ Card -->

        <!-- Modal : Posts Form-->
        <q-dialog v-model="postsFormModel" persistent="persistent" @before-hide="selectedPost = null">
            <posts-form :selectedPost="selectedPost" @close-modal="closeModal"/>
        </q-dialog>
        <!-- ./ Modal : Posts Form -->   

        <!-- Modal : Confirm delete-->
        <q-dialog v-model="deleteConfirm" persistent @before-hide="selectedPost = null">
           <confirm-delete 
            @delete-entity="deletePostSubmit"
            title="Suppression d'un post" 
            :content="'Voulez-vous vraiment supprimer le post ' + selectedPost.title +' ?'" 
           />
        </q-dialog>
        <!-- ./ Modal : Confirm delete-->
    </q-expansion-item>
</template>

<script>
import PostsForm from './PostsForm.vue'
import ConfirmDelete from '../modals/ConfirmDelete.vue'
import { mapActions, mapState } from 'vuex'
import {date} from 'quasar'

export default {
    name:'AdminPostsList',

    data(){
		return {
            isAdminDashboard: false,
            isUserProfile : false,
            visibleColumns :['id', 'userId', 'title', 'content', 'created', 'actions'],
            /////////////////////////////
            /// selectedPost
            selectedPost : null,
            /////////////////////////////
            /// Form
            postsFormModel : false,
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
				{ name: 'userId', align: 'left', label: 'Utilisateur', field: 'userId', sortable: true,  },
				{ name: 'title', align: 'left', label: 'Titre', field: 'title', sortable: true },
                { name: 'content', align: 'left', label: 'Contenus', field: 'content', sortable: true },
                { name: 'created', align: 'left', label: 'Créé le', field: 'created', sortable: true },
			    { name: 'actions', align: 'left', label: 'Actions', field: '', sortable: false },
			],
		}
    },

    components : { PostsForm, ConfirmDelete },
    computed : {
        /////////////////////////////
        /// Get postsList state
        ...mapState('posts', { postsList :'postsList' }),
        ...mapState('users', { usersPostList :'usersPostList' }),
    },
    methods:{
         /////////////////////////////
        /// Actions from Store
        ...mapActions('posts', ['deletePost']),

        /////////////////////////////
        /// Set Post
        setPost(post){
            this.selectedPost = post
        },

        /////////////////////////////
        /// formatDate
        formatDate(dateToFormat){
            return date.formatDate(dateToFormat, 'DD-MM-YYYY HH:mm')
        },
        /////////////////////////////
        /// delete Post
        async deletePostSubmit(){
            try {
                await this.deletePost(this.selectedPost)

                this.$q.notify({ message: `L'élément à bien été supprimé`, color: 'positive' })
                this.closeModal()
            } catch (err) {
                this.$q.notify({ message: `Une erreur est survenu lors de la suppression`, color: 'negative' })
            } 
        },

        /////////////////////////////
        /// Event emit par le form
        closeModal(){
            this.postsFormModel = false;
            this.deleteConfirm = false;
            this.selectedPost = null;
        },
     
        
    },
    
    async mounted(){
        const isAdminProfile = this.$route.name == "adminUserProfile" || this.$route.name == "adminProfile"
        this.isUserProfile = this.$route.name == "userProfile" || isAdminProfile

        this.isAdminDashboard = this.$route.matched[0].path == '/admin'

        if(!this.isUserProfile)
            await this.$store.dispatch('posts/getAllPosts')
        else this.visibleColumns =  this.visibleColumns.filter(col => col != "userId")
    }
}
</script>