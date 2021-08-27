<template>
    <div v-if="selectedPost != null">
      <!-- Card -->
        <q-card>
            <!-- Card header -->
            <q-item>
                <q-item-section avatar>
                    <q-avatar>
                         <img :src="selectedPost.User.imageUrl ? selectedPost.User.imageUrl : require('assets/icon.svg')">
                    </q-avatar>
                </q-item-section>

                <q-item-section>
                    <q-item-label>{{selectedPost.User.firstname}} {{selectedPost.User.lastname}}</q-item-label>
                    <q-item-label caption>il y a {{ getDateDiff(selectedPost.createdAt) }}</q-item-label>
                </q-item-section>
            </q-item>
            <!-- Card header -->

            <q-separator />

            <!-- Card section content -->
            <q-card-section>
                <p class="text-h4">{{selectedPost.title}}</p>
                <p class="q-my-md">{{selectedPost.content}}</p>
                <q-img class="col-12" :src="selectedPost.imageUrl" />
            </q-card-section>
            <!-- ./ Card section content -->
            <q-separator />
            <!-- Card actions-->
            <q-card-actions class="flex items-center justify-between">
                <div>
                    <q-btn class="likebtn" push icon="far fa-thumbs-up" color="primary" @click.prevent="like(selectedPost, true)"> &nbsp; {{ getNbLike(selectedPost, true) }}</q-btn>
                    <q-btn  push icon="far fa-thumbs-down" color="negative" @click.prevent="like(selectedPost, false)" class="q-ml-sm likebtn"> &nbsp; {{ getNbLike(selectedPost, false) }}</q-btn>
                </div>

                <!-- Actions Btn -->
                <q-btn color="grey-7" round flat icon="more_vert" v-if="selectedPost.userId == authUserId || authUserRole == 1" @click.prevent="">
                    <q-menu transition-show="jump-down" transition-hide="jump-up" auto-close>
                        <q-list>
                            <q-item clickable @click="openPostModal" >
                                <q-item-section>Modifier</q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item clickable @click="openDeleteModal" >
                                <q-item-section >Supprimer</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
                <!-- ./ Actions Btn -->
            </q-card-actions>
            <!-- ./ Card actions -->
        </q-card>
        <!-- ./ Card -->

    </div>
</template>

<script>

import { date } from 'quasar'
import { mapActions, mapState } from 'vuex'

export default {
    name: 'Post',
    props:['selectedPost'],
    computed:{
        ...mapState('users', {authUserId: 'uid'}),
        ...mapState('users', {authUserRole: 'role'})
    },
    methods:{
         /////////////////////////////
        /// Actions from Store
        ...mapActions('posts', ['deletePost', 'likePost', 'deleteLikePost', 'updateLikePost']),

        /////////////////////////////
        /// Get nbLikePost
        getNbLike(post, isLiked){
            return isLiked ? 
                    post.likeposts.filter(like => like.liked == 1).length || 0 
                    : post.likeposts.filter(like => like.liked == 0).length || 0
        },

        /////////////////////////////
        /// Get user status like
        getUserLikeStatus(post){
            let currentLike = null;

            //Si l'utilisateur exist dans l'object des like du post
            if(post.likeposts.find(like => like.userId == this.$store.state.users.uid)) {
                //Si l'utilisateur a like on met 1 sinon 0
                return currentLike = post.likeposts.find(like => like.userId == this.$store.state.users.uid && like.liked == 1) ? true : false;    
            }
            else return currentLike     
        },

        /////////////////////////////
        /// Get user like id
        getUserLikeId(post){
            return post.likeposts.find(like => like.userId == this.$store.state.users.uid).id
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
                case diff >= 1440 && diff < 43800: return date.getDateDiff(now, d, 'days')+" jour(s)"; 
                case diff >= 43800 && diff < 525600 : return date.getDateDiff(now, d, 'months')+" mois";
                case diff >= 525600 : return date.getDateDiff(now, d, 'years')+" année(s)"; 
                
            }
        },

        /////////////////////////////
        /// like
        async like(post, likedValue){
            const currentLike = this.getUserLikeStatus(post)
            const idLike = currentLike != null ? this.getUserLikeId(post) : null;

            //Si il n'y a aucun like ou dislike
            if(currentLike == null)
                await this.likePost({postId : this.selectedPost.id, liked:+likedValue}).then(response => {
                    const isLiked = likedValue ? 'Liké' : 'Disliké'
                    // this.$q.notify({ message: `Post ${isLiked}`, color: 'positive' })
                }).catch(error => { this.$q.notify({ message: `Une erreur est survenu `, color: 'negative' }) })

            else if(currentLike == likedValue) // Si il reclick sur like/dislike
                await this.deleteLikePost({id: idLike, postId:this.selectedPost.id}).then(response => {
                    const isLiked = likedValue ? 'Like' : 'Dislike'
                    // this.$q.notify({ message: `${isLiked} supprimé`, color: 'positive' })
                }).catch(error => {  this.$q.notify({ message: `Une erreur est survenu `, color: 'negative' }) })

            else //Sinon on update
                await this.updateLikePost({id: idLike, postId : this.selectedPost.id, liked:+likedValue}).then(response => {
                    const isLiked = likedValue ? 'Liké' : 'Disliké'
                    // this.$q.notify({ message: `${isLiked} `, color: 'positive' })
                }).catch(error => { this.$q.notify({ message: `Une erreur est survenu `, color: 'negative' }) })
            
        },

        /////////////////////////////
        /// Emit parent event
        openPostModal(){
            this.$emit('open-post-modal', this.selectedPost)
        },
        openDeleteModal(){
            this.$emit('open-delete-modal', this.selectedPost)
        },
     
        
    },
}
</script>
