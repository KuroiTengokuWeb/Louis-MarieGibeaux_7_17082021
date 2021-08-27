// Table comments

module.exports = (sequelize, DataTypes) => {
	const Comments = sequelize.define("Comments", {
		content: {
			type: DataTypes.TEXT,
			allowNull: false
		},
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        postId : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
	});
	return Comments;
};