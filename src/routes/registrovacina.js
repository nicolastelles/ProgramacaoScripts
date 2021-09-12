const router = require("express").Router();
const { RegistroVacinaController } = require("../controllers");
const { authMiddleware } = require("../middlewares");
const { create, update, remove, listAll, listByData } =
  new RegistroVacinaController();

router.use(authMiddleware);

// curl -X POST -d "descricao=Gasolina&valor=45.80" http://localhost:3100/api/gasto/create
router.post("/create", create);

// curl -X PUT -d "idgasto=1&descricao=Gasolina&valor=45.80" http://localhost:3100/api/gasto/update
router.put("/update", update);

// curl -X GET -d "offset=0&limit=4" http://localhost:3100/api/gasto/list
router.get("/list", listAll);

// curl -X GET -d "offset=0&limit=4&descricao=posto" http://localhost:3100/api/gasto/search
router.get("/listbydata", listByData);

// curl -X DELETE -d "idgasto=1" http://localhost:3100/api/gasto/remove
router.delete("/remove", remove);

router.use((req, res) => {
  res.status(400).json({ error: ["Operação desconhecida com o gasto"] });
});

module.exports = router;
