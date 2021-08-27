<template>
    <q-page>
        <div class="row">
            <!-- User info -->
            <div class="q-pa-md col-md-4 col-xs-12">
               <users-profile />
            </div>
            <!-- ./ User info -->

            <!-- Posts list -->
            <div class="q-pa-md col-md-8 col-xs-12">
                <table-posts-list />
            </div>
            <!-- ./ Posts list -->
        </div>
    </q-page>
</template>

<script>
import TablePostsList from '../../../components/posts/TablePostsList.vue'
import UsersProfile from '../../../components/users/UsersProfile.vue'
import { mapState } from 'vuex'

export default {
    name:'AdminProfile',
    components: { TablePostsList, UsersProfile },

    computed : {
        /////////////////////////////
        /// Get user
        ...mapState('users', { authUserId:'uid' }),
    },

    async mounted(){

        await this.$store.dispatch('users/getUser', this.authUserId);
    }
   
}
</script>