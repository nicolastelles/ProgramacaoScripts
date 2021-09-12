const router = require("express").Router();
const { VacinaController } = require("../controllers");
const { isAdmin } = require("../middlewares");
const { create, update, remove, listAll } = new VacinaController();

router.use(isAdmin);

// curl -X POST -d "descricao=Gasolina&valor=45.80" http://localhost:3100/api/gasto/create
router.post("/create", create);

// curl -X PUT -d "idgasto=1&descricao=Gasolina&valor=45.80" http://localhost:3100/api/gasto/update
router.put("/update", update);

// curl -X GET -d "offset=0&limit=4" http://localhost:3100/api/gasto/list
router.get("/list", listAll);

// curl -X DELETE -d "idgasto=1" http://localhost:3100/api/gasto/remove
router.delete("/remove", remove);

router.use((req, res) => {
  res.status(400).json({ error: ["Operação desconhecida com a vacina"] });
});

module.exports = router;
