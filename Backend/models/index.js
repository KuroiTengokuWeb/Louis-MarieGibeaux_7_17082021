const dbConfig = require("../config/db.config.js");
const Sequelize  = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Post = require('./posts')(sequelize, Sequelize);
db.User = require('./users')(sequelize, Sequelize);
db.Comment = require('./comments')(sequelize, Sequelize);
db.likePost = require('./like_posts')(sequelize, Sequelize);
db.likeComment = require('./like_comments')(sequelize, Sequelize);



// Relations
//////////////////
// Posts
db.Post.belongsTo(db.User, {
	foreignKey: {
		name: 'userId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION',
});

db.Post.hasMany(db.Comment, {
	foreignKey: {
		name: 'postId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION',
});

db.Post.hasMany(db.likePost, {
	foreignKey: {
		name: 'postId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION',
});

//////////////////
//User
db.User.hasMany(db.Comment, {
	foreignKey: {
		name: 'userId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION',
});

db.User.hasMany(db.Post, {
	foreignKey: {
		name: 'userId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION',
});

db.User.hasMany(db.likePost, {
	foreignKey: {
		name: 'userId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION',
});

db.User.hasMany(db.likeComment, {
	foreignKey: {
		name: 'userId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION',
});


//////////////////
// Comments
db.Comment.belongsTo(db.Post, {
	foreignKey: {
		name: 'postId',
		allowNull: false
	},
	onDelete: 'CASCADE', 
	onUpdate: 'NO ACTION',
});

db.Comment.belongsTo(db.User, {
	foreignKey: {
		name: 'userId',
		allowNull: false
	},
	onDelete: 'CASCADE', 
	onUpdate: 'NO ACTION',
});


db.Comment.hasMany(db.likeComment, {
	foreignKey: {
		name: 'commentId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION',
});
//////////////////
// Like
db.likePost.belongsTo(db.Post, {
	foreignKey: {
		name: 'postId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION'
})

db.likePost.belongsTo(db.User, {
	foreignKey: {
		name: 'userId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION'
})


db.likeComment.belongsTo(db.Comment, {
	foreignKey: {
		name: 'commentId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION'
})

db.likeComment.belongsTo(db.User, {
	foreignKey: {
		name: 'userId',
		allowNull: false
	},
	onDelete: 'CASCADE',
	onUpdate: 'NO ACTION'
})

module.exports = db;