const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const UserModel = require("./users");

const PostModel = sequelize.define('posts', {
  
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userImage:{
        type:DataTypes.STRING,
        allowNull:true
    },
    postImage:{
        type:DataTypes.STRING,
        allowNull:true
    }
    
});

PostModel.belongsTo(UserModel, { foreignKey: 'user_id' });


module.exports = PostModel;
