/////////////////////////////
/// setcommentsList
/**
* @param {Object} state 
* @param {Object} comments 
*/
export const setCommentsList = (state, comments) => {
    state.commentsList = comments
}

/////////////////////////////
/// updatecommentsList
/**
* @param {Object} state 
* @param {Object} comment 
*/
export const updateCommentsList = (state, comment) => {
    const index = state.commentsList.findIndex(commentToUpdate => commentToUpdate.id === comment.id);
    state.commentsList[index] = comment;
}

/////////////////////////////
/// removeTocommentsList
/**
* @param {Object} state 
* @param {Object} comment 
*/
export const removeToCommentsList = (state, pid) => {
    state.commentsList = state.commentsList.filter( comment => comment.id != pid);
}



/////////////////////////////
/// setLikeToCommentList
/**
* @param {Object} state 
* @param {Object} like 
*/
export const setLikeToCommentList = (state, like) => {
    const indexComment = state.commentsList.findIndex(comment => comment.id === like.commentId)
    const indexLike = state.commentsList[indexComment].likecomments.findIndex(likeToUpdate => likeToUpdate.id == like.id)

    if(indexComment > -1 && indexLike > -1) state.commentsList[indexComment].likecomments[indexLike] = like 
    
}

/////////////////////////////
/// removeLikeToCommentList
/**
* @param {Object} state 
* @param {Object} like 
*/
export const removeLikeToCommentList = (state, like) => {
    let comment = state.commentsList.filter(comment => comment.id === like.commentId)[0]
    comment.likecomments = comment.likecomments.filter(likeToDelete => likeToDelete.id != like.id);

    const index = state.commentsList.findIndex(c => c.id == like.commentId)
    state.commentsList[index] = comment
}
