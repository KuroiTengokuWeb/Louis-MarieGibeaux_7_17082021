<template>
	<q-layout view="lHh Lpr lFf">
		<!-- Header -->
		<q-header elevated>
			<q-toolbar class="flex ">
				<q-toolbar-title >
            		<router-link to="/" class="flex items-center"><img alt="Groupomania logo" src="~assets/logo.svg" style="height: 25px"/></router-link>
         		 </q-toolbar-title>

				<q-separator dark vertical inset />

				<div>
					<a href="javascript:void(0)" @click="authform=true;"><q-icon name="far fa-user" /> Connexion</a>
				</div>
			</q-toolbar>
		</q-header>
		<!-- ./ Header -->

		<!-- Page container -->
		<q-page-container>
			<router-view />
		</q-page-container>
		<!-- ./ Page container -->

		<!-- Modal : Auth Form -->
		<q-dialog v-model="authform" >
			<auth formType="Login" />
		</q-dialog>
		<!-- ./ Modal : Auth Form -->
    
	</q-layout>
</template>

<script>

import { defineComponent, ref } from 'vue'
import Auth from '../components/auth/Auth.vue'

export default defineComponent({
  	name: 'MainLayout',

  	components: { Auth },

  	setup () {
		return {
			authform : ref(false)
		}
  	},

	methods : {

	}
})
</script>
<style lang="scss" >
.q-toolbar a{
  color:white;
  text-decoration:none;
  padding:0 10px;
}

</style>