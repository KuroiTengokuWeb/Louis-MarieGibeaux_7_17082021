<template>
    <q-page >
        
        <div class="row justify-center">
            <div class="q-pa-md col-md-6 offset-md-1 col-12" v-for="post in postsList" :key="post.id">
                <router-link :to="{name:'post', params:{id: post.id}}" tag="div" class="post-link">
                    <post :selectedPost="post"  @open-post-modal="openPostFormModal"  @open-delete-modal="openDeleteModal" />
                </router-link>
            </div>
        </div>

        <q-btn class="fixed-bottom-left q-ml-md q-mb-md" round color="primary" icon="add" @click="postsFormModel = true">
            <q-tooltip class="bg-primary text-body2" anchor="center right" self="center left">Ajouter un post</q-tooltip>
        </q-btn>

        <!-- Modal : Posts Form-->
        <q-dialog v-model="postsFormModel" persistent="persistent" @before-hide="selectedPost = null">
            <posts-form :selectedPost="selectedPost"  @close-modal="closeModal"/>
        </q-dialog>
        <!-- ./ Modal : Posts Form -->   

        <!-- Modal : Confirm delete-->
        <q-dialog v-model="deleteConfirm" @before-hide="selectedPost = null">
           <confirm-delete 
            @delete-entity="deletePostSubmit"
            title="Suppression d'un post" 
            :content="'Voulez-vous vraiment supprimer le post ?'" 
           />
        </q-dialog>
        <!-- ./ Modal : Confirm delete-->
    </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Post from '../../components/posts/Post'
import PostsForm from '../../components/posts/PostsForm.vue'
import ConfirmDelete from '../../components/modals/ConfirmDelete.vue'

export default {
    name:'PagePostsList',
    data(){
        return {
            /////////////////////////////
            /// Form
            postsFormModel : false,
            deleteConfirm : false,
			/////////////////////////////
            selectedPost: null,
        }
    },
    computed:{
        ...mapState('posts', {postsList:'postsList'})
    },

    components : {
        Post, PostsForm, ConfirmDelete
    },

    methods:{ 
           /////////////////////////////
        /// Actions from Store
        ...mapActions('posts', ['deletePost']),
        /////////////////////////////
        /// delete Post
        async deletePostSubmit(){
            try {
                await this.deletePost(this.selectedPost)

                this.$q.notify({ message: `L'élément à bien été supprimé`, color: 'positive' })
                this.closeModal()
                this.$router.push('/admin/posts')
            } catch (err) {
                this.$q.notify({ message: `Une erreur est survenu lors de la suppression :`, color: 'negative' })
            } 
        },

        /////////////////////////////
        /// Event emit par le form
        closeModal(){
            this.postsFormModel = false;
            this.deleteConfirm = false;
        },

        /////////////////////////////
        /// Event emit par le form
        openPostFormModal(post){
            this.postsFormModel = true
            this.selectedPost = post
        },
        /// Event emit par le form
        openDeleteModal(post){
            this.deleteConfirm = true;
             this.selectedPost = post
        },

                   
    },

    async mounted(){
        await this.$store.dispatch('posts/getAllPosts');
    },
}
</script>

<style scoped>
.post-link  {
    text-decoration:none;
    color:inherit
}

.add-post {
    z-index:200;
}
</style>