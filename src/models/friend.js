const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const UserModel = require("./users");

const FreqModel = sequelize.define("Friend", {
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"), // Separate enum values with commas
    defaultValue: "pending",
  },
});

// Define the associations
FreqModel.belongsTo(UserModel, {
  foreignKey: "sender_Id",
});

FreqModel.belongsTo(UserModel, {
  foreignKey: "receiver_Id",
});

module.exports = FreqModel;
