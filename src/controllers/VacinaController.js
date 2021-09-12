const { VacinaModel } = require("../models");
const { getToken } = require("../middlewares");

class VacinaController {
  async create(req, res) {
    const token = await getToken(req);

    if (!token || !token.id_usuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { nome } = req.body;

    if (nome === "") {
      return res.status(400).json({ error: ["Nome nulo"] });
    }

    return await VacinaModel.create({
      nome,
    })
      .then(async (vacina) => {
        const { nome, created_at } = vacina.get();
        return res.status(200).json({ nome, created_at });
      })
      .catch((err) => {
        try {
          return res.status(400).json({
            error: err.errors.map((item) => item.message),
            type: "validation",
          });
        } catch (e) {
          return res.status(400).json({ error: [e.message] });
        }
      });
  }

  async update(req, res) {
    const token = await getToken(req);
    if (!token || !token.id_usuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { id, nome } = req.body;

    if (id === null) {
      return res.status(400).json({ error: ["Vacina não identificada"] });
    }
    if (nome === "") {
      return res.status(400).json({ error: ["Forneça o nome da vacina"] });
    }

    //função assincrona
    return await VacinaModel.findOne({
      where: { vacina_id },
    })

      .then(async (vacina) => {
        if (vacina) {
          await vacina.update({ nome });
          return res.status(200).json({
            nome,
          });
        }
        return res.status(400).json({ error: ["Vacina não identificada"] });
      })
      .catch((err) => {
        try {
          return res.status(400).json({
            error: err.errors.map((item) => item.message),
            type: "validation",
          });
        } catch (e) {
          return res.status(400).json({ error: [e.message] });
        }
      });
  }

  async remove(req, res) {
    const token = await getToken(req);
    if (!token || !token.id_usuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { usuario_id } = req.body;
    usuario_id = (usuario_id || "").toString().replace(/[^\d]+/g, "");
    if (usuario_id === "") {
      return res
        .status(400)
        .json({ error: ["Forneça a identificação da vacina"] });
    }

    return await VacinaModel.findOne({
      where: { usuario_id },
    })
      .then(async (vacina) => {
        if (vacina !== null) {
          await vacina.destroy();
          return res.status(200).json({ idgasto });
        } else {
          return res.status(400).json({ error: ["Registro inexistente"] });
        }
      })
      .catch((err) => {
        try {
          return res.status(400).json({
            error: err.errors.map((item) => item.message),
            type: "validation",
          });
        } catch (e) {
          return res.status(400).json({ error: [e.message] });
        }
      });
  }

  async listAll(req, res) {
    const token = await getToken(req);
    if (!token || !token.id_usuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { limit, offset } = req.body;
    return await VacinaModel.findAndCountAll({
      attributes: ["vacina_id", "created_at"],
      order: [["vacina_id", "DESC"]],
      offset,
      limit,
    })
      .then((vacinas) => {
        return res.status(200).json({
          vacinas: vacinas.rows.map((item) => item.get()),
          count: vacinas.count,
        });
      })
      .catch((e) => {
        return res.status(400).json({ error: [e.message] });
      });
  }
}

module.exports = VacinaController;
