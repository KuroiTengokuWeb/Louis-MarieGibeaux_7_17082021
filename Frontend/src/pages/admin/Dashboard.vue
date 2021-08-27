<template>
    <q-page >
        <div class="row">
            <!-- Users list -->
            <div class="q-pa-md col-md-6 col-xs-12">
                <table-users-list  />
            </div>
            <!-- ./ Users list -->

            <!-- ./ Users list -->
            <!-- Posts list -->
            <div class="q-pa-md col-md-6 col-xs-12">
                <table-posts-list  />
            </div>
            <!-- ./ Posts list -->
        </div>
    </q-page>
</template>

<script>
import TableUsersList from '../../components/users/TableUsersList.vue'
import TablePostsList from '../../components/posts/TablePostsList.vue'

export default {
    name:"Dashboard",
    data(){
        return {
            
        }
    },
    components: { TableUsersList, TablePostsList,  },
    
    mounted () {
    },

    computed:{
        //...mapGetters('user', ['currentUser']),   
    },
    
    methods: {
     
    }
}
</script>