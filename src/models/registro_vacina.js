const Sequelize = require("sequelize");
const database = require("../database");

const RegistroVacina = database.define(
  "registro_vacina",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    data: {
      type: Sequelize.DATE,
      allowNull: false,
      notEmpty: true,
    },
    usuario_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    vacina_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    underscored: true,
  }
);

module.exports = RegistroVacina;
