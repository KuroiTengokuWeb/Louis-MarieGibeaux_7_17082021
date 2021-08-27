import { api } from 'boot/axios'

////////////////////////////////////
// getAllPosts
export const getAllPosts =  async function ({commit, rootState}, payload) {
    api.post('posts/getAllPosts', {post : payload, userId:rootState.users.uid})
    .then(response => {
        //commit la liste des users dans le state
        commit('setPostsList', response.data)
    })
}

////////////////////////////////////
// getPost
export const getPost = async function ({rootState, commit}, id) {
    return new Promise((resolve, reject) => {
        api.post('/posts/getPost', {id:id, userId: rootState.users.uid} )
        .then(response => {
            resolve(response)
            commit('setSelectedPost', response.data)
        }).catch(error => {
            reject(error)
        })
    })
}

////////////////////////////////////
// CreatePost
export const createPost = async function ({ dispatch, rootState }, payload) {
    //FormData pour upload un fichier.
    let formData = new FormData()
    //Append le file a upload dans le formData
    formData.append('image', payload.file)
    //Append les datas du post dans le formData
    formData.append('post', JSON.stringify({
        id: payload.id,
        title: payload.title,
        content: payload.content,
        userId: rootState.users.uid,
        imageUrl: payload.imageUrl
    }))
    formData.append('userId', rootState.users.uid)

    api.post('posts/createPost', formData).then(response => {
        if(this.$router.currentRoute.value.name == "userProfile")
            dispatch('users/getUser', rootState.users.selectedUser.id , {root : true})
        else dispatch('getAllPosts')
    }).catch(err => {

    })
}

////////////////////////////////////
// updatePost
export const updatePost = async function ({commit, state, rootState, dispatch}, payload) {
    //FormData pour upload un fichier.
    let formData = new FormData()
    //Append le file a upload dans le formData
    formData.append('image', payload.file)
    //Append les datas du post dans le formData
    formData.append('post', JSON.stringify({
        id: payload.id,
        title: payload.title,
        content: payload.content,
        imageUrl: payload.imageUrl
    }))

    formData.append('userId', rootState.users.uid)

    return new Promise((resolve, reject) => {
        api.put('/posts/updatePost', formData).then(async response => {
            resolve(response)
            // Return l'image url du back pour la mettre a jours dans la list et le selected post
            let post = payload
            post.imageUrl = response.data.imageUrl
            
            //Mise a jour du selected post
            await dispatch('getPost', post.id)
            post.createdAt = state.selectedPost.createdAt
            post.likeposts = state.selectedPost.likeposts

            if(this.$router.currentRoute.value.name == "userProfile"){
                commit('users/updateUsersPostList', post, {root : true})
            }else {
                console.log("ACTION POST UPDATE")
                //Mise a jour de la liste des posts stocker dans le state
                //pour éviter de rappeler la base de donnée
                post.User = state.selectedPost.User
                post.userId = state.selectedPost.userId

                commit('updatePostsList', post)
            }
        }).catch(err => {
            reject(error)
        })
    })
}

////////////////////////////////////
// deletePost
export const deletePost = async function ({commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
        api.post('/posts/deletePost', {id:payload.id, userId: rootState.users.uid}).then(response => {
            resolve(response)
            if(this.$router.currentRoute.value.name == "userProfile")
                commit('users/removeToUsersPostList', payload.id, {root : true})
            else commit('removeToPostsList', payload.id)
            
        }).catch(err => {
            reject(error)
        })
    })
}

/////////////////////////////////////////////////////////////////////////


////////////////////////////////////
// like
export const likePost = async function ({dispatch, rootState}, payload) {
    return new Promise((resolve, reject) => {
        api.post('/likes/likePost', {postId:payload.postId, userId: rootState.users.uid, liked:payload.liked}).then(response => {
            resolve(response)

            if(this.$router.currentRoute.value.name == "post" || this.$router.currentRoute.value.name == "adminPost") 
                dispatch('getPost', payload.postId)
            else dispatch('getAllPosts')

        }).catch(error => {
            reject(error)
        })
    })
}

////////////////////////////////////
// update like
export const updateLikePost = async function ({dispatch, commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
        api.put('/likes/updateLikePost', {id:payload.id, userId: rootState.users.uid, liked:payload.liked}).then(response => {
            
            let likeToUpdate = payload
            likeToUpdate.userId = rootState.users.uid

            if(this.$router.currentRoute.value.name == "post" || this.$router.currentRoute.value.name == "adminPost") 
                commit('setLikeToPost', likeToUpdate)
            else commit('setLikeToPostList', likeToUpdate)

            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

////////////////////////////////////
// delete like
export const deleteLikePost = async function ({commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
        api.post('/likes/deleteLikePost', {id:payload.id, userId: rootState.users.uid, liked:payload.liked}).then(response => {
            
            let likeToUpdate = payload
            likeToUpdate.userId = rootState.users.uid
            
            if(this.$router.currentRoute.value.name == "post" || this.$router.currentRoute.value.name == "adminPost") 
                commit('removeLikeToPost', likeToUpdate)
            else commit('removeLikeToPostList', likeToUpdate)

            resolve(response)
            
        }).catch(error => {
            reject(error)
        })
    })
}
