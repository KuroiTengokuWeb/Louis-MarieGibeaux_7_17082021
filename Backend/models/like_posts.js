module.exports = (sequelize, DataTypes) => {
    const likePost = sequelize.define("likeposts", {
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        postId : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        liked : {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    return likePost;
}