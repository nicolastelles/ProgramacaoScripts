# Aplicação back-end

O objetivo desta aplicação é criar um servidor web usando Express, fazer uso de rotas, controle de acesso, mapeamento ORM usando o Sequelize e persistir dados no SQLite.

## Requisitos

1. O usuário efetua o seu próprio cadastro;
2. O usuário efetua login;
3. O usuário altera mail e senha;
4. O e-mail é único;
5. O usuário registra gasto;
6. O usuário altera gasto;
7. O usuário remove gasto;
8. O usuário lista todos os seus gastos;
9. O usuário faz uma busca usando a descrição;
10. O usuário possui acesso a somente os seus próprios gastos;
11. As operações com os gastos requerem login;
12. Os dados precisam ser persistidos no SQLite.

## Modelo de dados

Os dados são persistidos nas seguintes tabelas.

![](https://github.com/arleysouza/back-routes-sqlite/blob/main/images/modelo.png)

## Estrutura do projeto

1. Cada pasta possui um arquivo `index.js`. Nele são exportados os recursos dos demais módulos da pasta, desta forma, basta importar o arquivo `index.js` para importar todos os recursos exportados pelos módulos da pasta.

2. O arquivo `index.js` na raiz da pasta `src` é usado para criar o servidor web e direcionar para as rotas definidas no arquivo `/routes/index.js`.

```javascript
const express = require("express");
const router = require("./routes");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}...`);
});

app.use("/api", router);

app.use((req, res) => {
  res.status(400).json({ error: ["URL desconhecida"] });
});
```

3. O arquivo `/routes/index.js` é usado para direcionar para as rotas definidas nos arquivos `/routes/gasto.js` e `/routes/usuario.js`.

```javascript
const router = require("express").Router();

const usuarioRoute = require("./usuario");
const gastoRoute = require("./gasto");

router.use("/usuario", usuarioRoute);
router.use("/gasto", gastoRoute);

router.use((req, res) => {
  res.status(400).json({ error: ["Operação desconhecida"] });
});

module.exports = router;
```

4. O arquivo `/routes/index.js` é usado para direcionar para as rotas definidas nos arquivos `/routes/gasto.js` e `/routes/usuario.js`.

```javascript
const router = require("express").Router();
const { UsuarioController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const { create, login, updatemail, updatesenha } = new UsuarioController();

// essas rotas não precisam de autorização
router.post("/create", create);
router.get("/login", login);

// as rotas a partir desse ponto estão bloqueados pela autorização
router.use(authMiddleware);
router.put("/update/mail", updatemail);
router.put("/update/senha", updatesenha);

router.use((req, res) => {
  res.status(400).json({ error: ["Operação desconhecida com o usuário"] });
});

module.exports = router;
```

5. Nos arquivos `/models/gasto.js` e `/models/usuario.js` são definidos os modelos que representam as tabelas no BD. O relacionamento de chave-estrangeira foi definido no arquivo `/models/index.js` e a instrução `database.sync()` é usada para forçar as tabelas a serem criadas no SGBD caso elas não existam.

```javascript
UsuarioModel.hasMany(GastoModel, {
  foreignKey: {
    name: "id",
    allowNull: false,
  },
  sourceKey: "id",
  onDelete: "cascade",
  onUpdate: "cascade",
  hooks: true, //usado para forçar o cascade no onDelete
});
GastoModel.belongsTo(UsuarioModel, {
  foreignKey: "id",
  targetKey: "id",
});
```

6. Cada rota direciona para um método das classes `GastoController` e `UsuarioController` que estão nos arquivos da pasta `/controllers`. O código a seguir existe em cada um dos métodos que requerem a identificação do usuário. Os dados do usuário são mantidos em um token e a decodificação desse token é feita no arquivo `/middlewares/authMiddleware.js`.

```javascript
const token = await getToken(req);
if (!token || !token.id_usuario) {
  return res.status(401).json({ error: ["Efetue o login para continuar"] });
}
```
