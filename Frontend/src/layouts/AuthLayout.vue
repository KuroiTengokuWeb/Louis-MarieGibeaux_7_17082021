<template>
	<q-layout view="lHh Lpr lFf">
		<!-- Header -->
	   <q-header elevated>
			<q-toolbar>
					<q-toolbar-title >
            <router-link to="/posts" class="flex items-center"><img alt="Groupomania logo" src="~assets/logo.svg" style="height: 25px"/></router-link>
          </q-toolbar-title>

				<q-separator dark vertical inset />
				
				<div>
           <!-- Actions Btn -->
                <q-btn color="white"  flat icon="more_vert"  @click.prevent="" label="Menu">
                    <q-menu transition-show="jump-down" transition-hide="jump-up" auto-close>
                        <q-list>
                            <q-item clickable>
                                <q-item-section><router-link to="/profile">Mon compte</router-link></q-item-section>
                            </q-item>
                            <q-separator />
                            <q-item clickable @click="logoutUser()">
                                <q-item-section>Déconnexion</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>
            <!-- ./ Actions Btn -->
				</div>
			</q-toolbar>
		</q-header>
		<!-- ./ Header -->

		<!-- Page container -->
		<q-page-container>
			<router-view />
		</q-page-container>
		<!-- ./ Page container -->
     
     <q-btn class="fixed-bottom-right q-mr-md q-mb-md" icon="keyboard_arrow_up" round color="primary" @click="scrolltop">
      <q-tooltip class="bg-primary text-body2" anchor="center left" self="center right">Haut de page</q-tooltip>
    </q-btn>
	</q-layout>
</template>

<script>
import { mapActions } from 'vuex'
import { scroll } from 'quasar'
const { getScrollTarget, setVerticalScrollPosition  } = scroll


export default  {
  name: 'AuthLayout',
  computed: {
    //...mapGetters('user', ['currentUser']),
    
  },
  created () {
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
    },

    scrolltop(){
      let el = document.getElementById("q-app")
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 100
      setVerticalScrollPosition(target, offset, duration)
    }

  },
}
</script>

<style lang="scss" >
.q-toolbar a{
  color:white;
 
  padding:0 10px;
}

a {
   text-decoration:none;
   color:inherit
}
</style>