module.exports = (sequelize, DataTypes) => {
    const likeComment = sequelize.define("likecomments", {
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        commentId : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        liked : {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    return likeComment;
}