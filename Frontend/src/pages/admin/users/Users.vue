<template>
    <q-page >
        <div class="row">
            <!-- Users list -->
            <div class="q-pa-md col-12">
                <table-users-list />
            </div>
            <!-- ./ Users list -->
        </div>
    </q-page>
</template>

<script>
import TableUsersList from '../../../components/users/TableUsersList.vue'

export default {
    name:"Users",
    data(){
        return {
          
            
        }
    },
    components: { TableUsersList },
    mounted () {
      
    },

    computed:{
        //...mapGetters('user', ['currentUser']),   
    },
    
    methods: {
       
    }
}
</script>