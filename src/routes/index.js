const router = require("express").Router();

const usuarioRoute = require("./usuario");
const vacinaRoute = require("./vacina");
const registrovacinaRoute = require("./registrovacina");

router.use("/usuario", usuarioRoute);
router.use("/vacina", vacinaRoute);
router.use("/registrovacina", registrovacinaRoute);

router.use((req, res) => {
  res.status(400).json({ error: ["Operação desconhecida"] });
});

module.exports = router;
