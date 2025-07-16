const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const PostModel = require("./post");
const UserModel = require("./users");


const LikeModel = sequelize.define('likes',{
    status:{
        type:DataTypes.ENUM("liked","unliked"),
        defaultValue:"liked"
    }
})


LikeModel.belongsTo(PostModel,{foreignKey:'post_id'})
LikeModel.belongsTo(UserModel, {foreignKey:'user_id'})

module.exports = LikeModel