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
            <!-- content -->
            <q-input filled v-model="content" label="Contenus" name="content" color="primary" type="textarea"
                     lazy-rules :rules="[val => !!val || '*Champ requis !']">
            </q-input>
            <!-- ./ content -->

            <!-- file -->
            <q-file filled class="q-mb-md" v-model="file">
                <template v-slot:prepend>
                     <q-icon name="attach_file" />
                </template>
            </q-file>
            <!-- ./file -->

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
    name:'CommentsForm',
    data(){
        return {
            ////////////////////////////
            // Upload
            file: ref(null),
            ////////////////////////////
            // FormTitle
            formTitle: 'Ajouter un commentaire',
            /////////////////////////////
            /// Form Fields
            id : this.selectedComment ? this.selectedComment.id : null,
            content: this.selectedComment ? this.selectedComment.content : null,
            postId: this.selectedComment ? this.selectedComment.postId : null,   
            user: this.selectedComment ? this.selectedComment.User : null,
            imageUrl : this.selectedComment ? this.selectedComment.imageUrl :null,
            createdAt: this.selectedComment ? this.selectedComment.createdAt : null,  
        }
    },
    
    props:['selectedComment'],

    created(){
        this.formTitle =  this.selectedComment ? 'Modifier un commentaire': 'Ajouter un commentaire';
    },

    methods : {
        /////////////////////////////
        /// Actions from Store
        ...mapActions('comments', ['updateComment', 'createComment']),
        
        ////////////////////////////
        // Save data
        async saveData(){
            //Vars
            const { id, content, user, file, imageUrl, createdAt } = this

            const CommentObject = { 
                id:id, 
                content:content, 
                file: file,
                postId:this.$route.params.id,
                User: user,
                imageUrl: imageUrl,
            };

            if(id != null || id != undefined) await this.updateComment(CommentObject).then((res) => {
                 this.$q.notify({ message: `L'élément à bien été éditer`, color: 'positive' })
            }, (err) => {
                this.$q.notify({ message: `Une erreur est survenu`, color: 'negative' })
            })
            else await this.createComment(CommentObject).then((res) => {
                this.$q.notify({ message: `L'élément à bien été éditer`, color: 'positive' })
            }, (err) => {
                this.$q.notify({ message: `Une erreur est survenu, veuillez réésayer !`, color: 'negative' })
            })
               
            this.$emit('close-modal')
        }
    }
}
</script>