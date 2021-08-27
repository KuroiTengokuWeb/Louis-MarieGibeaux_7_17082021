/////////////////////////////
/// setAuthState
export function setAuthState (state, data) {
    state.isAuthenticated = data.isAuthenticated
    state.uid = data.uid
    state.role = data.role 
}

/////////////////////////////
/// setUsersList
/**
* @param {Object} state 
* @param {Object} users 
*/
export const setUsersList = (state, users) => {
    state.usersList = users
}


/////////////////////////////
/// setSelectedUser
/**
* @param {Object} state 
* @param {Object} user 
*/
export const setSelectedUser = (state, user) => {
    state.selectedUser = user;
}

/////////////////////////////
/// setUsersPostList
/**
* @param {Object} state 
* @param {Object} usersPost 
*/
export const setUsersPostList = (state, usersPost) => {
    state.usersPostList = usersPost;
}
/////////////////////////////
/// updateUsersList
/**
* @param {Object} state 
* @param {Object} user 
*/
export const updateUsersList = (state, user) => {
    const index = state.usersList.findIndex(userToUpdate => userToUpdate.id === user.id);
    state.usersList[index] = user;
}

/////////////////////////////
/// removeToUserList
/**
* @param {Object} state 
* @param {Object} user 
*/
export const removeToUsersList = (state, uid) => {
    state.usersList = state.usersList.filter( user => user.id != uid);
}

/////////////////////////////
/// updateUsersPostList
/**
* @param {Object} state 
* @param {Object} post 
*/
export const updateUsersPostList = (state, post) => {
    const index = state.usersPostList.findIndex(postToUpdate => postToUpdate.id === post.id);
    state.usersPostList[index] = post;
}
/////////////////////////////
/// updateUsersPostList
/**
* @param {Object} state 
* @param {Object} postId 
*/
export const removeToUsersPostList = (state, postId) => {
    state.usersPostList = state.usersPostList.filter(post => post.id != postId);
}
