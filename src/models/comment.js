const { DataTypes } = require("sequelize");
const UserModel = require("./users");
const PostModel = require("./post");
const sequelize = require("../config/dbConfig");

const CommentModel = sequelize.define('comment',{

    comment:{
        type:DataTypes.STRING,
        allowNull:false
    },
    commentPic:{
        type:DataTypes.STRING,
        allowNull:true
    }

})

CommentModel.belongsTo(UserModel,{foreignKey:'user_id'})
CommentModel.belongsTo(PostModel,{foreignKey:'post_id'})

module.exports = CommentModel