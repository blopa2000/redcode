import { Router } from "express";
import { check, validationResult } from "express-validator";

import { user, follows } from "../../models/mongo";

import bcrypt from "../../helpers/libs";
import { tokenKey } from "../../keys";

import jwt from "jsonwebtoken";
//si son varios midlewares se ponen dentro de [middleware1,middleware2]
//y se puede modificar la informacion que biene en req.body.item = 2

const router = Router();
router.post(
  "/inside",
  [
    check("username")
      .not()
      .isEmpty()
      .withMessage("user name is required to login"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("password is required to login"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, errors: errors.array() });
    }

    try {
      const userLogin = await user.findOne({ username: req.body.username });
      if (userLogin) {
        const verifyPass = await bcrypt.mathPassword(
          req.body.password,
          userLogin.password
        );
        if (verifyPass) {
          const token = jwt.sign(
            {
              id: userLogin._id,
            },
            tokenKey,
            { expiresIn: 60 * 60 * 24 * 30 }
          );

          return res.json({ success: true, message: "User login", token });
        } else {
          return res.json({ success: false, message: "Incorrect password" });
        }
      } else {
        return res.json({ success: false, message: "Incorrect user name" });
      }
    } catch (error) {
      return res.status(401).json({
        success: false,
        status: 401,
        errors: error.errors,
      });
    }
  }
);

router.post(
  "/register",
  [
    check("username").not().isEmpty().withMessage("user name is required"),
    check("password").not().isEmpty().withMessage("password is required"),
    check("firstName").not().isEmpty().withMessage("fist name is required"),
    check("lastName").not().isEmpty().withMessage("last name is required"),
    check("email").not().isEmpty().withMessage("email is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ success: false, status: 404, errors: errors.array() });
    }
    const dataUser = req.body;
    dataUser.password = await bcrypt.encrypPassword(req.body.password);
    const newUser = new user(dataUser);

    try {
      newUser.save(async (err, room) => {
        if (err) {
          return res.json({ error: err, success: false });
        }
        const follow = new follows({
          idUser: room._id,
        });
        await follow.save();
        res.json({ message: "user save", success: true });
      });
    } catch (error) {
      return res.json({
        success: false,
        status: 500,
        errors: error.errors,
      });
    }
  }
);

module.exports = router;
