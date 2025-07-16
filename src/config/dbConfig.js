const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  username: "postgres",
  password: "Iangrg112",
  database: "facebook",
});

module.exports = sequelize;
