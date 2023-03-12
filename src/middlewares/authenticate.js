require("dotenv").config();

const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  // If token is not sended then show errr(header is present)
  if (!req.headers.authorization)
    return res
      .status(400)
      .send({ message: "Authorization token not found or incorrect" });

  // if present than starts with "Bearer "
  if (!req.headers.authorization.startsWith("Bearer "))
    return res
      .status(400)
      .send({ message: "Authorization token not found or incorrect" });

  const token = req.headers.authorization.trim().split(" ")[1];

  if (token === process.env.TOKEN) {
    return next();
  } else {
    return res
      .status(400)
      .send({ message: "Authorization token not found or incorrect" });
  }
};

module.exports = authenticate;
