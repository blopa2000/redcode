//config middleware
import jwt from "jsonwebtoken";
import { tokenKey } from "../keys";
import { user } from "../models/mongo";

var isLogged = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.json({ message: "user is not login", success: false });
  }

  jwt.verify(token, tokenKey, async (err, decoded) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Failed to authenticate token.", success: false });
    } else {
      const userFind = await user.findOne({ _id: decoded.id });
      req.token = userFind;
      next();
    }
  });
};

module.exports = { isLogged };
