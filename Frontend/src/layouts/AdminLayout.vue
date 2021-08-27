<template>
	<q-layout view="hHh Lpr lff">
		<q-header elevated>
			<q-toolbar>
				<q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen"/>
				<q-toolbar-title >
					<router-link to="/admin/dashboard" class="flex items-center"><img alt="Groupomania logo" src="~assets/logo.svg" style="height: 25px"/></router-link>
				</q-toolbar-title>

				<q-separator dark vertical inset />
				
				<div>
					<a href="javascript:void(0)"  @click="logoutUser()"><q-icon name="fas fa-power-off" /> Déconnexion</a>
				</div>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="leftDrawerOpen" show-if-above bordered  content-class="bg-grey-2">
			<q-list>
				<q-item clickable to='/admin/dashboard'>
					<q-item-section avatar>
						<q-icon name="fas fa-server" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Dashboard</q-item-label>
					</q-item-section>
				</q-item>

				<q-item clickable to='/admin/utilisateurs'>
					<q-item-section avatar>
						<q-icon name="fas fa-user" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Utilisateurs</q-item-label>
					</q-item-section>
				</q-item>


				<q-item clickable to='/admin/posts'>
					<q-item-section avatar>
						<q-icon name="far fa-newspaper" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Posts</q-item-label>
					</q-item-section>
				</q-item>


				<q-separator spaced />

				<q-item clickable to='/admin/profile'>
					<q-item-section avatar>
						<q-icon  name="settings" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Mon compte</q-item-label>
					</q-item-section>
				</q-item>

				<q-item clickable @click="logoutUser()">
					<q-item-section avatar>
						<q-icon name="power_settings_new" />
					</q-item-section>
					<q-item-section>
						<q-item-label>Déconnexion</q-item-label>
					</q-item-section>
				</q-item>

				<q-separator spaced />
		</q-list>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import {mapActions} from 'vuex'
export default {

  created () {
    // Check that our app has access to the user id
    // from Firebase before the page renders
    console.log(this.$store.state.users.isAuthenticated)
  },
  data () {
    return {
      leftDrawerOpen: false,
      blurLayout: false
    }
  },
  methods: {
    ...mapActions('users', ['logout']),
	async logoutUser(){
		await this.logout().then(response => {
			this.$q.notify({
				message: "Vous êtes déconnecté !",
				color: 'positive'
			})

			this.$router.push({ path: '/' })
		}).catch(err => {})
		
	}
  },
}
</script>

<style lang="scss" >
.q-toolbar a{
  color:white;
  text-decoration:none;
  padding:0 10px;
}

</style>