const Sequelize = require("sequelize");
const database = require("../database");

const Vacina = database.define(
  "vacina",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true,
    },
  },
  {
    freezeTableName: true,
    underscored: true,
  }
);

module.exports = Vacina;
