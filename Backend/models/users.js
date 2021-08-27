// Table Users

module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        email : {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password : {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            default: false
        }
    });
    return Users;
}