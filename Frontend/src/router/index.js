import { route } from "quasar/wrappers";
import {
	createRouter,
	createMemoryHistory,
	createWebHistory,
	createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import {api} from 'boot/axios'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store } /* { store, ssrContext } */) {
	const createHistory = process.env.SERVER
		? createMemoryHistory
		: process.env.VUE_ROUTER_MODE === "history"
			? createWebHistory
			: createWebHashHistory;

	const Router = createRouter({
		scrollBehavior: () => ({ left: 0, top: 0 }),
		routes,

		// Leave this as is and make changes in quasar.conf.js instead!
		// quasar.conf.js -> build -> vueRouterMode
		// quasar.conf.js -> build -> publicPath
		history: createHistory(
			process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
		),
	});

	Router.beforeEach(async (to, from, next) => {
		// Récupère le state users
		let user = store.state.users;
		// Vérifie si dans le state users isAuthenticated est false
		// && que il y a un token dans le local storage alors il y a eu refresh de la page
		// on dispatch l'action du store users  getUserByToken qui va récupérer l'utilisateur
		// et set le state de l'user connecté
		if (!user.isAuthenticated && localStorage.getItem("token") != null){
			await store.dispatch("users/getUserByToken", {
				token: localStorage.getItem("token"),
			});

			api.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem("token")	
		}
		

		// Si une route qui require l'auth est demandé
		if (to.matched.some((record) => record.meta.requiresAuth)) {
			// Si le token du localStorage est null on redirige vers la racine
			if (localStorage.getItem("token") == null)
				next({ path: "/", params: { nextUrl: to.fullPath } });
			else {
				// Si une route qui require d'être Admin
				if (to.matched.some((record) => record.meta.isAdmin)) {
					// Si l'utilisateur est admin on authorize
					if (user.role == 1) next();
					// Sinon on le redirige a la racine
					else next({ path: "/posts" });
				} else next(); // Si on est authentifié et qu'une route qui require l'auth uniquement est demandé on next
			} 
		} else { // si une route qui ne require pas l'auth est demandé on next
			next();
		}
	});


	return Router;
});
