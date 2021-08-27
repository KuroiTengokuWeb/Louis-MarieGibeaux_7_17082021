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
            <!-- title -->
            <q-input  v-model="title" label="Titre" name="title" color="primary"
                     lazy-rules :rules="[val => !!val || '*Champ requis !']">
            </q-input>
            <!-- ./ title -->

            <!-- file -->
            <q-file  class="q-mb-md" v-model="file" :rules="[isRequired]"  lazy-rules>
                <template v-slot:prepend>
                     <q-icon name="attach_file" />
                </template>
            </q-file>
            <!-- ./file -->

            <!-- content -->
            <q-input  v-model="content" label="Contenus" name="content" color="primary" type="textarea"
                     lazy-rules >
            </q-input>
            <!-- ./ content -->

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
import {mapActions} from 'vuex'
import { ref } from 'vue'

export default {
    name:'PostsForm',
    data(){
        return {
            ////////////////////////////
            // Upload
            file: ref(null),
            ////////////////////////////
            // FormTitle
            formTitle: 'Ajouter un post',
            /////////////////////////////
            /// Form Fields
            id : this.selectedPost ? this.selectedPost.id : null,
            title: this.selectedPost ? this.selectedPost.title : null,
            content: this.selectedPost ? this.selectedPost.content : null, 
            user : this.selectedPost ? this.selectedPost.User : null ,
            imageUrl : this.selectedPost ? this.selectedPost.imageUrl :null, 
            
        }
    },
    
    props:['selectedPost'],

    created(){
        this.formTitle =  this.selectedPost ? 'Modifier un post': 'Ajouter un post';
    },

    methods : {
        /////////////////////////////
        /// Custom Rules validation 

        isRequired(val){
            return this.selectedPost ? true : (!!val || "* Champs requis");
        },

        /////////////////////////////
        /// Actions from Store
        ...mapActions('posts', ['updatePost', 'createPost']),
        
        ////////////////////////////
        // Save data
        async saveData(){
            //Vars
            const { id, title, content, file, imageUrl } = this

            try {
                const PostObject = { 
                    id:id, 
                    title:title,
                    content:content, 
                    file: file,
                    imageUrl : imageUrl
                };

                if(id != null || id != undefined) await this.updatePost(PostObject)
                else await this.createPost(PostObject)

                this.$q.notify({ message: `L'élément à bien été éditer`, color: 'positive' })
                this.$emit('close-modal')
            } catch (err) {
                this.$q.notify({ message: `Une erreur est survenu dans le formulaire`, color: 'negative' })
            } 
        }
    }
}
</script>