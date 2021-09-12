const UsuarioModel = require("./usuario");
const VacinaModel = require("./vacina");
const RegistroVacina = require("./registro_vacina");

//importa o arquivo database/index.js
const database = require("../database");

UsuarioModel.hasMany(RegistroVacina, {
  //caso o usuario seja deletado o registrado tmb eh apagado
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true,
});

RegistroVacina.belongsTo(UsuarioModel);

VacinaModel.hasMany(RegistroVacina);

//cria as tabelas no SGBD se elas não existirem
database.sync();

module.exports = {
  UsuarioModel,
  VacinaModel,
  RegistroVacina,
};
