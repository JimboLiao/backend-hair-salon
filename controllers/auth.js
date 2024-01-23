const jwt = require("jsonwebtoken");
const { authFail, noToken } = require("../utils/failResponse");

const authJwt = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.replace("Bearer ", "");
  if (!token) {
    return noToken(res);
  }

  // verify token
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  if (!decoded) {
    return authFail(res);
  }

  res.locals.id = decoded.id;
  next();
};

module.exports = { authJwt };
