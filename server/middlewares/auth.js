require("dotenv").config();
const jwt = require("jsonwebtoken");

const restrictToLoggedInUserOnly = (req, res, next) => {
  const token = req.header("x-auth-token");
  const jwtSecret = process.env.JWT_SECRET;

  if (!token) {
    res.status(401).json({ message: "No token, autherize denied" });
  } else {
    try {
      const decode = jwt.verify(token, jwtSecret);
      req["user"] = decode;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token is not valid." });
    }
  }
};

const restrictToRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const token = req.header("x-auth-token");
    const jwtSecret = process.env.JWT_SECRET;

    if (!token) {
      res.status(401).json({ message: "No token, authorization denied" });
      return;
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);

      if (!decoded.role || !allowedRoles.includes(decoded.role)) {
        res
          .status(403)
          .json({ message: "Access denied. Role not authorized." });
        return;
      }

      req["user"] = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "Token is not valid." });
      return;
    }
  };
};

const checkAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  const jwtSecret = process.env.JWT_SECRET;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decode = jwt.verify(token, jwtSecret);
    req.user = decode;
  } catch (error) {
    req.user = null;
  }

  next();
};

module.exports = {
  restrictToLoggedInUserOnly,
  restrictToRoles,
  checkAuth,
};
