/////////////////////////////
/// setPostsList
/**
* @param {Object} state 
* @param {Object} posts 
*/
export const setPostsList = (state, posts) => {
    state.postsList = posts
}

/////////////////////////////
/// updatePostsList
/**
* @param {Object} state 
* @param {Object} post 
*/
export const updatePostsList = (state, post) => {
    const index = state.postsList.findIndex(postToUpdate => postToUpdate.id === post.id);
    if(index > -1) state.postsList[index] = post 
    else state.postsList.push(post)
}

/////////////////////////////
/// removeToPostsList
/**
* @param {Object} state 
* @param {Object} post 
*/
export const removeToPostsList = (state, pid) => {
    state.postsList = state.postsList.filter( post => post.id != pid);
}

/////////////////////////////
/// setSelectedPost
/**
* @param {Object} state 
* @param {Object} post 
*/
export const setSelectedPost = (state, post) => {
    state.selectedPost = post;
}



/////////////////////////////
/// setLikeToPost
/**
* @param {Object} state 
* @param {Object} like 
*/
export const setLikeToPost = (state, like) => {

    const index = state.selectedPost.likeposts.findIndex(likeToUpdate => likeToUpdate.id === like.id);
    if(index > -1) state.selectedPost.likeposts[index] = like 
}

/////////////////////////////
/// setLikeToPostList
/**
* @param {Object} state 
* @param {Object} like 
*/
export const setLikeToPostList = (state, like) => {
    
    const indexPost = state.postsList.findIndex(post => post.id === like.postId)
    const indexLike = state.postsList[indexPost].likeposts.findIndex(likeToUpdate => likeToUpdate.id == like.id)

    if(indexLike > -1 && indexPost > -1) state.postsList[indexPost].likeposts[indexLike] = like 
}

/////////////////////////////
/// removeLikeToPost
/**
* @param {Object} state 
* @param {Object} like 
*/
export const removeLikeToPost = (state, like) => {
    state.selectedPost.likeposts = state.selectedPost.likeposts.filter(likeToDelete => likeToDelete.id != like.id);
}

/////////////////////////////
/// removeLikeToPostList
/**
* @param {Object} state 
* @param {Object} like 
*/
export const removeLikeToPostList = (state, like) => {
    let post = state.postsList.filter(post => post.id == like.postId)[0]
    post.likeposts = post.likeposts.filter(likeToDelete => likeToDelete.id != like.id);

    const index = state.postsList.findIndex(p => p.id == like.postId)
    state.postsList[index] = post
}
