<template>
    <q-page >
        <div class="row">

            <!-- Posts list -->
            <div class="q-pa-md col-12">
                <table-posts-list />
            </div>
            <!-- ./ Posts list -->

        </div>
    </q-page>
</template>

<script>
import TablePostsList from '../../../components/posts/TablePostsList.vue'

export default {
    name:"Posts",
    data(){
        return {
          
            
        }
    },
    components: { TablePostsList },
    mounted () {
      
    },

    computed:{
        //...mapGetters('user', ['currentUser']),   
    },
    
    methods: {
       
    }
}
</script>