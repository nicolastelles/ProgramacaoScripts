const { RegistroVacina } = require("../models");
const { getToken } = require("../middlewares");

class RegistroVacinaController {
  async create(req, res) {
    const token = await getToken(req);
    if (!token || !token.id_usuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { vacina_id, usuario_id, data } = req.body;

    if (vacina_id === null) {
      return res.status(400).json({ error: ["id nulo"] });
    }

    if (usuario_id === null) {
      return res.status(400).json({ error: ["Idusuário nulo"] });
    }
    if (
      !data.match(/^\d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])$/)
    ) {
      return res
        .status(400)
        .json({ error: ["Data não se encontra no formato adequado"] });
    }

    return await RegistroVacina.create({
      vacina_id,
      usuario_id,
      data,
    })
      .then(async (registro) => {
        const { vacina_id, usuario_id, registro_id, data, created_at } =
          registro.get();
        return res
          .status(200)
          .json({ vacina_id, usuario_id, registro_id, data, created_at });
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

    let { usuario_id, vacina_id, data } = req.body;

    if (vacina_id === null) {
      return res.status(400).json({ error: ["id nulo"] });
    }

    if (usuario_id === null) {
      return res.status(400).json({ error: ["Idusuário nulo"] });
    }

    if (
      !data.match(/^\d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])$/)
    ) {
      return res
        .status(400)
        .json({ error: ["Data não se encontra no formato adequado"] });
    }

    //função assincrona
    return await RegistroVacina.findOne({
      where: { vacina_id },
    })
      .then(async (registro) => {
        if (registro) {
          await registro.update({ nome });
          return res.status(200).json({
            vacina_id,
            registro_id,
            data,
          });
        }
        return res.status(400).json({ error: ["Registro não identificado"] });
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

    let { vacina_id, usuario_id, data } = req.body;
    registro_id = (registro_id || "").toString().replace(/[^\d]+/g, "");

    if (registro_id === "") {
      return res
        .status(400)
        .json({ error: ["Forneça a identificação da registro"] });
    }

    return await RegistroVacina.findOne({
      where: { registro_id },
    })
      .then(async (registro) => {
        if (registro !== null) {
          await registro.destroy();
          return res.status(200).json({ registro_id });
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
    return await RegistroVacina.findAndCountAll({
      where: { usuario_id: token.id_usuario },
      attributes: ["id", "vacina_id", "data", "created_at"],
      order: [["id", "DESC"]],
      offset,
      limit,
    })
      .then((registros) => {
        return res.status(200).json({
          registros: registros.rows.map((item) => item.get()),
          count: registros.count,
        });
      })
      .catch((e) => {
        return res.status(400).json({ error: [e.message] });
      });
  }

  async listByData(req, res) {
    const token = await getToken(req);
    if (!token || !token.id_usuario) {
      return res.status(401).json({ error: ["Efetue o login para continuar"] });
    }

    let { limit, offset } = req.body;
    return await RegistroVacina.findAndCountAll({
      where: { id },
      attributes: ["id", "id", "data", "created_at"],
      order: [["data", "DESC"]],
      offset,
      limit,
    })
      .then((registros) => {
        return res.status(200).json({
          registros: registros.rows.map((item) => item.get()),
          count: registros.count,
        });
      })
      .catch((e) => {
        return res.status(400).json({ error: [e.message] });
      });
  }
}

module.exports = RegistroVacinaController;
