import { api } from 'boot/axios'

////////////////////////////////////
// getAllComments
export const getAllComments =  function ({commit, rootState}, idPost ) {
     api.post('comments/getAllComments', {id:idPost, userId:rootState.users.uid}).then(response => {
        //commit la liste des users dans le state
        commit('setCommentsList', response.data)
     })
}



////////////////////////////////////
// CreateComment
export const createComment = async function ({rootState, dispatch}, payload) {
    //FormData pour upload un fichier.
    let formData = new FormData()
    //Append le file a upload dans le formData
    formData.append('image', payload.file)
    //Append les datas du post dans le formData
    formData.append('comment', JSON.stringify({
        id: payload.id,
        content: payload.content,
        postId: payload.postId,
        imageUrl: payload.imageUrl
    }))

    formData.append('userId', rootState.users.uid)

    //return new promise pour catch l'erreur du serv 
    //et pouvoir le catch aussi dans la vue
    return new Promise((resolve, reject) => {
        api.post('comments/createComment', formData)
        .then((response) => {
            resolve(response)
            dispatch('getAllComments', payload.postId)
        })
        .catch((error) => {
            reject(error)
        })
    })

}


////////////////////////////////////
// updateComment
export const updateComment = async function ({commit, rootState}, payload) {
        //FormData pour upload un fichier.
        let formData = new FormData()
        //Append le file a upload dans le formData
        formData.append('image', payload.file)
        //Append les datas du post dans le formData
        formData.append('comment', JSON.stringify({
            id: payload.id,
            content: payload.content,
            userId: payload.userId,
            postId: payload.postId,
            imageUrl: payload.imageUrl
        }))

        formData.append('userId', rootState.users.uid)

    api.put('/comments/updateComment', formData).then(response => {
        let comment = payload
        comment.imageUrl = response.data.imageUrl

        // Mise a jour de la liste des commentaires
        comment.User = payload.User
        commit('updateCommentsList', comment)
    }).catch(err => {
   })
}

////////////////////////////////////
// deleteComment
export const deleteComment = async function ({commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
        api.post('/comments/deleteComment', {id:payload.id, userId:rootState.users.uid}).then((response) => {
            resolve(response)
            commit('removeToCommentsList', payload.id)
        })
        .catch(error => {
            reject(error)
        })
      
    })
}

/////////////////////////////////////////////////////////////////////////


////////////////////////////////////
// like
export const likeComment = async function ({dispatch, rootState}, payload) {
    return new Promise((resolve, reject) => {
        api.post('/likes/likeComment', {commentId:payload.commentId, userId: rootState.users.uid, liked:payload.liked}).then(response => {
            resolve(response)

            dispatch('getAllComments', payload.postId)

        }).catch(error => {
            reject(error)
        })
    })
}

////////////////////////////////////
// update like
export const updateLikeComment = async function ({dispatch, commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
        api.put('/likes/updateLikeComment', {id:payload.id, userId: rootState.users.uid, liked:payload.liked}).then(response => {
           
            let likeToUpdate = payload
            likeToUpdate.userId = rootState.users.uid

            commit('setLikeToCommentList', likeToUpdate)

            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

////////////////////////////////////
// delete like
export const deleteLikeComment = async function ({commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
        api.post('/likes/deleteLikeComment', {id:payload.id, userId: rootState.users.uid, liked:payload.liked}).then(response => {
            let likeToUpdate = payload
            likeToUpdate.userId = rootState.users.uid

            commit('removeLikeToCommentList', likeToUpdate)

            resolve(response)
            
        }).catch(error => {
            reject(error)
        })
    })
}
