<template>
<!-- List Comments -->
<q-list bordered separator>
    <!-- List Header -->
    <q-item-label header>
        <div class="row align-center justify-bewteen">
            <div class="col"><q-icon name="far fa-comments" style="font-size: 24px" /> &nbsp; {{commentsList.length}} Commentaire(s)</div>
            <div class="flex justify-end col"><q-btn round push color="primary" size="sm" icon="fas fa-plus" @click="commentsFormModel = true" /></div>
        </div>
    </q-item-label>
   
    <q-separator />
    <!-- ./ List Header -->

    <!-- Comment  -->
    <q-item v-for="comment in commentsList" :key="comment.id">
        <q-item-section avatar side top>
            <q-avatar>  <img :src="comment.User.imageUrl ? comment.User.imageUrl : require('assets/icon.svg')"></q-avatar>
        </q-item-section>

        <q-item-section>
            <q-item-label class="q-py-sm">{{comment.User.firstname}} {{comment.User.lastname}} &nbsp; <small class="textcaption text-weight-light">il y a {{ getDateDiff(comment.createdAt) }}</small></q-item-label>

            <q-item-label class="text-body2 q-py-sm text-justify">{{comment.content}}</q-item-label>
            <q-img class="q-mb-md" v-if="comment.imageUrl" :src="comment.imageUrl" />

            <q-separator />

            <!-- Action footer -->
            <div class="flex q-py-xs items-center justify-between">
                <!-- Like btn -->
                <div>
                    <q-btn push icon="far fa-thumbs-up" color="primary" size="sm"  @click="like(comment, true)"> &nbsp; {{ getNbLike(comment, true) }}</q-btn>
                    <q-btn push icon="far fa-thumbs-down" color="negative" size="sm" @click="like(comment, false)" class="q-ml-sm"> &nbsp; {{ getNbLike(comment, false) }}</q-btn>

                </div>
                <!-- ./ Like btn -->

                <!-- Actions Btn -->
                <q-btn color="grey-7" round flat icon="more_vert" v-if="comment.userId == authUserId || authUserRole == 1" >
                    <q-menu transition-show="jump-down" transition-hide="jump-up" auto-close>
                        <q-list>
                            <q-item clickable @click="commentsFormModel = true; setComment(comment)">
                                <q-item-section>Modifier</q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item clickable @click="deleteConfirm = true; setComment(comment)">
                                <q-item-section>Supprimer</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
                <!-- ./ Actions Btn -->
            </div>
            <!-- ./ Action footer -->
        </q-item-section>
    </q-item>
    <!-- Comment  -->

      <!-- Modal : Comments Form-->
        <q-dialog v-model="commentsFormModel" persistent="persistent" @before-hide="selectedComment = null">
            <comments-form :selectedComment="selectedComment" @close-modal="closeModal"/>
        </q-dialog>
        <!-- ./ Modal : Comments Form -->   

        <!-- Modal : Confirm delete-->
        <q-dialog v-model="deleteConfirm" persistent @before-hide="selectedComment = null">
           <confirm-delete 
            @delete-entity="deleteCommentSubmit"
            title="Suppression d'un post" 
            :content="'Voulez-vous vraiment supprimer le commentaire ' + selectedComment.id +' ?'" 
           />
        </q-dialog>
        <!-- ./ Modal : Confirm delete-->
</q-list>
<!-- ./ List Comments -->
</template>

<script>
import { date } from 'quasar'
import CommentsForm from './CommentsForm.vue'
import ConfirmDelete from '../modals/ConfirmDelete.vue'
import {mapState, mapActions} from 'vuex'


export default {
    name:'CommentsList',
    data(){
        return {
            /////////////////////////////
            /// selectedComment
            selectedComment : null,
            /////////////////////////////
            /// Form
            commentsFormModel : false,
            deleteConfirm : false,
			/////////////////////////////
        }
    },
    components : { CommentsForm, ConfirmDelete },
    computed : {
        /////////////////////////////
        /// Get commentslist state
        ...mapState('comments', { commentsList:'commentsList' }),

        ...mapState('users', {authUserId: 'uid'}),
        ...mapState('users', {authUserRole: 'role'})
    },

    methods:{
        /////////////////////////////
        /// Actions from Store
        ...mapActions('comments', ['deleteComment','likeComment', 'deleteLikeComment', 'updateLikeComment']),

        /////////////////////////////
        /// Set Comment
        setComment(comment){
            this.selectedComment = comment
        },
        
        /////////////////////////////
        /// delete Comment
        async deleteCommentSubmit(){
      
                await this.deleteComment(this.selectedComment).then((res) => {
                    this.$q.notify({ message: `L'élément à bien été supprimer`, color: 'positive' })
                }, (err) => {
                    this.$q.notify({ message: `Une erreur est survenu lors de la suppression`, color: 'negative' })
                })

                // this.$q.notify({ message: `L'élément à bien été supprimé`, color: 'positive' })
                this.closeModal()
       
        },

        /////////////////////////////
        /// Get Date diff
        getDateDiff(dateToDiff){
            const now = new Date();
            const d = date.extractDate(dateToDiff);
            const units = 'minutes';
            const diff = date.getDateDiff(now, d, units)

            switch(true){
                case diff < 1 : return "moins d'une minute";
                case diff < 60 : return diff+" minute(s)";

                case diff >= 60 && diff < 1440 : return date.getDateDiff(now, d, 'hours')+" heure(s)";
                case diff >= 1440 && diff < 43800: return date.getDateDiff(now, d, 'days')+" jours(s)"; 
                case diff >= 43800 && diff < 525600 : return date.getDateDiff(now, d, 'months')+" mois(s)";
                case diff >= 525600 : return date.getDateDiff(now, d, 'years')+" année(s)"; 
                
            }
        },


        /////////////////////////////
        /// Get nbLike
        getNbLike(comment, isLiked){
            return isLiked ? 
                    comment.likecomments.filter(like => like.liked == 1).length || 0 
                    : comment.likecomments.filter(like => like.liked == 0).length || 0
        },

        /////////////////////////////
        /// Get user status like
        getUserLikeStatus(comment){
            let currentLike = null;

            //Si l'utilisateur exist dans l'object des like du post
            if(comment.likecomments.find(like => like.userId == this.$store.state.users.uid)) {
                //Si l'utilisateur a like on met 1 sinon 0
                return currentLike = comment.likecomments.find(like => like.userId == this.$store.state.users.uid && like.liked == 1) ? true : false;    
            }
            else return currentLike     
        },

        /////////////////////////////
        /// Get user like id
        getUserLikeId(comment){
            return comment.likecomments.find(like => like.userId == this.$store.state.users.uid).id
        },

        /////////////////////////////
        /// like
        async like(comment, likedValue){
            const currentLike = this.getUserLikeStatus(comment)
            const idLike = currentLike != null ? this.getUserLikeId(comment) : null;

            //Si il n'y a aucun like ou dislike
            if(currentLike == null)
                await this.likeComment({postId:comment.postId,  commentId : comment.id, liked:+likedValue}).then(response => {
                    const isLiked = likedValue ? 'Liké' : 'Disliké'
                    // this.$q.notify({ message: `Commentaire ${isLiked}`, color: 'positive' })
                }).catch(error => { this.$q.notify({ message: `Une erreur est survenu `, color: 'negative' }) })

            else if(currentLike == likedValue) // Si il reclick sur like/dislike
                await this.deleteLikeComment({id: idLike, commentId: comment.id}).then(response => {
                    const isLiked = likedValue ? 'Like' : 'Dislike'
                    // this.$q.notify({ message: `${isLiked} supprimé`, color: 'positive' })
                }).catch(error => {  this.$q.notify({ message: `Une erreur est survenu `, color: 'negative' }) })

            else //Sinon on update
                await this.updateLikeComment({id: idLike, commentId : comment.id, liked:+likedValue}).then(response => {
                    const isLiked = likedValue ? 'Liké' : 'Disliké'
                    // this.$q.notify({ message: `${isLiked} `, color: 'positive' })
                }).catch(error => { this.$q.notify({ message: `Une erreur est survenu `, color: 'negative' }) })
            
        },

        /////////////////////////////
        /// Event emit par le form
        closeModal(){
            this.commentsFormModel = false;
            this.deleteConfirm = false;
            this.selectedComment = null;
        },
     
    },
    created(){
        this.$store.dispatch('comments/getAllComments', this.$route.params.id)
    }
};
</script>
