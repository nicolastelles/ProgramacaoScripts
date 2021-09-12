const router = require("express").Router();
const { UsuarioController } = require("../controllers");
const { authMiddleware, isAdmin } = require("../middlewares");
const { create, login, updatemail, updatesenha, updaterole } =
  new UsuarioController();

// curl -X POST -d "mail=teste@teste.com&senha=123456" http://localhost:3100/api/usuario/create
router.post("/create", create);

// curl -X GET -d "mail=teste@teste.com&senha=123456" http://localhost:3100/api/usuario/login
router.get("/login", login);

router.use(authMiddleware);

// curl -X PUT -d "mail=tester@teste.com" http://localhost:3100/api/usuario/update/mail
router.put("/update/mail", updatemail);

// curl -X PUT -d "senha=123457" http://localhost:3100/api/usuario/update/senha
router.put("/update/senha", updatesenha);

router.use(isAdmin);
router.put("/update/role", updaterole);

router.use((req, res) => {
  res.status(400).json({ error: ["Operação desconhecida com o usuário"] });
});

module.exports = router;
