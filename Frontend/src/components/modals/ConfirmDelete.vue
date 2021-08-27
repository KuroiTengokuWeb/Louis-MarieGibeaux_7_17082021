<template>
    <q-card>
        <!-- TOOLBAR -->
        <q-toolbar class="bg-negative text-white">
            <q-toolbar-title>{{title}}</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <!-- ./ TOOLBAR -->

        <!-- Card Section -->
        <q-card-section class="row items-center">
            <q-avatar icon="fas fa-exclamation-circle" color="negative" text-color="white" />
            <span class="q-ml-sm">{{content}}</span>
        </q-card-section>
        <!-- ./ Card Section -->
                
        <q-separator />

        <!-- Actions -->
        <q-card-actions align="right">
            <q-btn push color="grey-7 q-mr-sm" label="Annuler" style="min-width:6em;" v-close-popup ></q-btn>
            <q-btn push color="negative" type="submit" label="Supprimer" style="min-width:6em;" @click="deleteEntity"></q-btn>
        </q-card-actions>
        <!-- ./ Actions -->
    </q-card>
</template>

<script>

export default {
    name : 'ConfirmDelete',
    props : ['title', 'content','uid'],

    methods : {
        deleteEntity(){
            this.$emit('delete-entity', this.uid)
        }
    }
}
</script>