//config middleware
import jwt from "jsonwebtoken"
import { tokenKey } from "../keys"
var isLogged = async(req, res, next) => {
    //no se pueden dos res por ejemplo si quiero devolver aLgo del middleware no se puede enviar de la ruta
    //req.get() lo que hay en el params
    // se pueden crear variabbles globales en el req para ser usadas en otros middlewares <req.usuariodeprueba = "pepe perez">
    const token = req.headers['authorization']
    if (!token) {

        return res.json({ message: "user is not login", success: false });
    }

    jwt.verify(token, tokenKey, function(err, user) {
        if (err) {
            res.json({ message: "user is not login", success: false });
        } else {
            req.token = user.data
            next();
        }
    })

};

module.exports = { isLogged }