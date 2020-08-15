const Router = require("express").Router();
const { check, validationResult } = require('express-validator');
const { user, follows } = require("../../models/mongo");
const bcrypt = require('../../helpers/libs');
const { tokenKey } = require("../../keys")
var jwt = require('jsonwebtoken');
//si son varios midlewares se ponen dentro de [middleware1,middleware2]
//y se puede modificar la informacion que biene en req.body.item = 2
Router.post("/inside", [
    check('username').not().isEmpty().withMessage('user name is required to login'),
    check('password').not().isEmpty().withMessage('password is required to login'),
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ success: false, errors: errors.array() });
    }


    try {
        const userLogin = await user.findOne({ username: req.body.username });
        if (userLogin) {
            const verifyPass = await bcrypt.mathPassword(req.body.password, userLogin.password)
            if (verifyPass) {
                const token = jwt.sign({
                    data: userLogin
                }, tokenKey, { expiresIn: 60 * 60 * 24 * 30 });

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
            errors: error.errors
        })
    }
});

Router.post("/register", [
    check('username').not().isEmpty().withMessage('user name is required'),
    check('password').not().isEmpty().withMessage('password is required'),
    check('firstName').not().isEmpty().withMessage('fist name is required'),
    check('lastName').not().isEmpty().withMessage('last name is required'),
    check('email').not().isEmpty().withMessage('email is required'),
    check('dateBirth').not().isEmpty().withMessage('date birth is required'),
    check('sex').not().isEmpty().withMessage('sex is required')
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ success: false, status: 401, errors: errors.array() });
    }
    const datUser = req.body;
    datUser.password = await bcrypt.encrypPassword(req.body.password);
    const newUser = new user(datUser);
    try {
        await newUser.save()
        const userSave = await user.findOne({ "username": datUser.username })
        const follow = new follows({
            "idUser": userSave._id
        })
        follow.save()
        res.json({ message: "user save", success: true })
    } catch (error) {
        return res.status(408).json({
            success: false,
            status: 408,
            errors: error.errors
        })
    }
});

module.exports = Router;