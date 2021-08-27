// Table Posts

module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
        title : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content : {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    return Posts;
}