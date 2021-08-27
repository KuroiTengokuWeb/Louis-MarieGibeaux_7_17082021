<template>
    <div class="bg-white full-width row" style="">
        <!-- TOOLBAR -->
        <q-toolbar class="bg-primary">
            <q-toolbar-title  class="text-white">Authentification</q-toolbar-title>
            <q-btn flat round dense icon="close" color="white" v-close-popup />
        </q-toolbar>
        <!-- ./ TOOLBAR -->

        <component :is="localFormType" class="col q-pa-md" @toggle-form="toggleFormType" ></component>
      
    </div>
</template>

<script>

import Login from './Login'
import Register from './Register'

export default {
    name:"Auth",
    data(){
        return {
            localFormType : 'Login'
        }
    },
    props:['formType'],
    components: { Login, Register },
    mounted(){
        this.localFormType = this.formType
    },
    methods : {
        toggleFormType(val){
            this.localFormType = val;
        }
    }
}
</script>