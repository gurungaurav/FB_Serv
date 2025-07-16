const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
// const PostModel = require("./post");

const UserModel = sequelize.define('users', {
    user_Name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image:{
        type:DataTypes.STRING,
        allowNull:true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        enum: ['user', 'admin'],
    },
    
});

//!Either use hasMany or like straightly say belongs to this table where the foregin key is user_id 
// UserModel.hasMany(PostModel);


module.exports = UserModel;

