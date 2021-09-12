const Sequelize = require("sequelize");

const database = new Sequelize(
  "postgres://qozbgpmu:JDSL19ma49gw2HDMdMqII3H0MtZPQDup@chunee.db.elephantsql.com/qozbgpmu"
); // Example for postgres

module.exports = database;
