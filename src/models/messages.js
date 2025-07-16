const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const UserModel = require("./users");

const MessageModel = sequelize.define("messages", {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

MessageModel.belongsTo(UserModel, { foreignKey: "sender_id" });
MessageModel.belongsTo(UserModel, { foreignKey: "receiver_id" });

module.exports = MessageModel