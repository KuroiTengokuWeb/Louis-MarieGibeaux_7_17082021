import { api } from 'boot/axios'

////////////////////////////////////
// Register
export const register = function (context, payload) {
    return new Promise((resolve, reject) => {
        api.post('auth/signup', payload).then(response => {
            // http success, call the mutator and change something in state
            resolve(response);  // Let the calling function know that http is done. You may send some data back
            
        }).catch(err => {
            
              // http failed, let the calling function know that action did not work out
              reject(err);
        })
    })
}

////////////////////////////////////
// Login
export const login = async function ({commit}, payload) {
    return new Promise((resolve, reject) => {
        api.post('auth/login', payload)
        .then(response => {
            api.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
            localStorage.setItem('token', response.data.token);
            //commut dans les mutation  ('methode, data)
            commit('setAuthState', { 
                isAuthenticated: true, 
                uid: response.data.uid, 
                role: +response.data.isAdmin
            })

            resolve(response)
        })
        .catch((error) => {
            reject(error)
        })
    })
}

////////////////////////////////////
// refreshAuthenticatedUser
// re set les infos de l'utilisateur connecté au refresh de la page
export const getUserByToken = async function({commit}, payload){
    return new Promise((resolve, reject) => {
        api.post('auth/getAuthenticatedUser', {token :payload.token})
        .then(response => {
            //console.log(response.data)
            resolve(response)
            //commut dans les mutation  ('methode, data)

            commit('setAuthState', { 
                isAuthenticated: true, 
                uid: response.data.id, 
                role: response.data.isAdmin
            })

           
        })
        .catch((error) => {
            reject(error)
        })
    })
}

////////////////////////////////////
// Logout
export const logout = async function ({commit}, payload) {
    api.defaults.headers.common['Authorization'] = null

    localStorage.removeItem('token');
    //commut dans les mutation  ('methode, data)
    commit('setAuthState', { 
        isAuthenticated: false, 
        uid: null, 
        role: null
    })
}


////////////////////////////////////
// GetAllUsers
export const getAllUsers = async function ({commit, state}, payload) {
    api.post('auth/getAllUsers', {userId: state.uid }).then(response => {
        //commit la liste des users dans le state
        commit('setUsersList', response.data)
    })
}

////////////////////////////////////
// getUserById
export const getUser = function ({rootState, commit}, id) {
    api.post('auth/getUser', {id:id, userId: rootState.users.uid} )
    .then(response => {
        delete response.data.password

        // Si le nom de la route est userProfile, donc sur le profile user,
        // on met a jours le selected user
        if(this.$router.currentRoute.value.name == "adminUserProfile" 
        || this.$router.currentRoute.value.name == "adminProfile" 
        || this.$router.currentRoute.value.name == "userProfile" ){
           
            commit('setSelectedUser', response.data)
            commit('setUsersPostList',response.data.Posts)
        }
            
        commit('setUsersPostList', response.data.Posts)

    }).catch(err => {

    })
}


////////////////////////////////////
// Register
export const createUser = function (context, payload) {
    api.post('auth/createUser', payload).then(response => {
        delete response.data.user.password
        commit('updateUsersList',  response.data.user)
    }).catch(err => {

    })
}


////////////////////////////////////
// updateUser
export const updateUser = async function ({commit, rootState, dispatch}, payload) {
    //FormData pour upload un fichier.
    let formData = new FormData()

    //Append le file a upload dans le formData
    formData.append('image', payload.file)
    //Append les datas du post dans le formData
    formData.append('user', JSON.stringify({
        id: payload.id,
        firstname: payload.firstname,
        lastname: payload.lastname,
        password: payload.password,
        email: payload.email,
        isAdmin: payload.isAdmin,
        bio: payload.bio,
        imageUrl: payload.imageUrl
    }))

    formData.append('userId', rootState.users.uid)

    api.put('auth/updateUser', formData).then(response => {
        let user = payload
        payload.imageUrl = response.imageUrl

        if(this.$router.currentRoute.value.name == "userProfile") dispatch('getUser', user.id)
        else commit('updateUsersList', user)
    }).catch(err => {

   })
}

////////////////////////////////////
// DeleteUSer
export const deleteUser = async function ({commit, state}, payload) {

    api.post('auth/deleteUser/', { userId: state.uid, id:payload.id }).then(response => {
        commit('removeToUsersList', payload.id)
    }).catch(err => {

    })
}
