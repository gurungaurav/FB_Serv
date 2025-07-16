const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");


const replyModel = sequelize.define('replies',{
    
    commentReply:{
        type:DataTypes.STRING,
        allowNull:false
    }
})