<template>
    <q-page >
        <div class="row justify-center">
            <div class="q-pa-md col-md-6 col-12">
                <post :selectedPost="selectedPost" @open-post-modal="openPostFormModal"  @open-delete-modal="openDeleteModal" />
            </div>
        </div>

        <div class="row justify-center">
            <div class="q-pa-md col-md-6 col-12">
                <!-- List Comments -->
                <comments-list />
                <!-- ./ List Comments -->
            </div>
        </div>

        <!-- Modal : Posts Form-->
        <q-dialog v-model="postsFormModel" persistent="persistent" >
            <posts-form :selectedPost="selectedPost"  @close-modal="closeModal"/>
        </q-dialog>
        <!-- ./ Modal : Posts Form -->   

        <!-- Modal : Confirm delete-->
        <q-dialog v-model="deleteConfirm">
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

import CommentsList from '../../components/comments/CommentsList.vue'
import Post from '../../components/posts/Post'
import PostsForm from '../../components/posts/PostsForm.vue'
import ConfirmDelete from '../../components/modals/ConfirmDelete.vue'

export default {
    name:'PagePost',
    data(){
        return {
            /////////////////////////////
            /// Form
            postsFormModel : false,
            deleteConfirm : false,
			/////////////////////////////
        }
    },

    computed:{
        ...mapState('posts', {selectedPost:'selectedPost'})
    },

    components : {
        Post, CommentsList, PostsForm, ConfirmDelete
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
                this.$q.notify({ message: `Une erreur est survenu lors de la suppression `, color: 'negative' })
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
        openPostFormModal(){
            this.postsFormModel = true
        },
        /// Event emit par le form
        openDeleteModal(){
            this.deleteConfirm = true;
        },

                   
    },

    async mounted(){
        await this.$store.dispatch('posts/getPost', this.$route.params.id);
    },
}
</script>