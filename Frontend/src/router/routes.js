const routes = [
	{
		path: '/',
		component: () => import('layouts/MainLayout.vue'),
		meta: {
			requiresAuth: false
		},
		children: [
			{ path: '', component: () => import('pages/Index.vue') }
		]
	},
	{
		path: '/admin',
		component: () => import('layouts/AdminLayout.vue'),
		meta: {
			requiresAuth: true,
			isAdmin : true
		},
		children: [
			{ path: 'dashboard', name: 'dashboard', component: () => import('pages/admin/Dashboard.vue') },
			//Admin users
			{ path: 'utilisateurs', name:'users', component: () => import('pages/admin/users/Users.vue') },
			{ path: 'utilisateurs/profile/:id',  name:'adminUserProfile', component: () => import('pages/users/User.vue') },
			//Mon compte
			{ path: 'profile',  name:'adminProfile', component: () => import('pages/admin/users/Profile.vue') },
			//Admin Posts
			{ path: 'posts', name:'adminPostsList', component: () => import('pages/admin/posts/Posts.vue') },
			{ path: 'posts/:id', name:'adminPost', component: () => import('pages/posts/Post.vue') },
		]
	},
	{
		path: '/posts', 
		component: () => import('layouts/AuthLayout.vue'),
		meta: {
			requiresAuth:true,
		},
		children: [
			{ path: '', name:'postsList', component: () => import('pages/posts/Posts.vue') },
			{ path: ':id', name:'post', component: () => import('pages/posts/Post.vue') },
		]
	},
	{
		path:'/profile',
		component: () => import('layouts/AuthLayout.vue'),
		meta : { requiresAuth: true },
		children: [ { path: '',  name:'userProfile', component: () => import('pages/users/User.vue') } ]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: '/:catchAll(.*)*',
		component: () => import('pages/Error404.vue')
	}
]


export default routes
