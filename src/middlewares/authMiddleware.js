const Usuario = require("../models/usuario");
const { Token } = require("../utils");
const { validateToken, decodeToken } = Token;

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res
      .status(401)
      .json({ error: ["É necessário efetuar o login ;) "] });

  const [, token] = authorization.split(" ");

  try {
    await validateToken(token);
    return next();
  } catch (error) {
    return res.status(401).json({ error: [error.message] });
  }
};

const isAdmin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(401).json({ error: ["É necessário efetuar o login"] });
  const [, token] = authorization.split(" ");
  try {
    const { id_usuario } = await decodeToken(token);
    await Usuario.findOne({
      where: { id: id_usuario },
    }).then(async (usuario) => {
      if (!usuario || usuario.role !== "admin") {
        return res.status(403).json({ error: ["Usuário inválido"] });
      }
      return next();
    });
  } catch (error) {
    return res.status(401).json({ error: [error.message] });
  }
};

const getToken = async (req) => {
  const { authorization } = req.headers;
  try {
    const [, token] = authorization.split(" ");
    return await decodeToken(token);
  } catch (error) {
    return null;
  }
};

module.exports = { authMiddleware, getToken, isAdmin };
