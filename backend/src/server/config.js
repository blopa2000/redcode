const path = require("path");
const express = require("express");
const morgan = require("morgan");
//const multer = require("multer");
const history = require('connect-history-api-fallback');
const cors = require("cors");
const session = require("express-session")
const Functions = require("../routes/fuctions")
    //const fileUpload = require('express-fileupload')

module.exports = (app) => {
    //settings
    app.set("port", process.env.PORT || 5000);



    //middleware
    app.use(
        session({
            secret: 'InProyect@4927',
            resave: true,
            saveUninitialized: true,
        })
    );
    app.use(morgan("combined"));
    //app.use(morgan("dev"));
    app.use(cors());
    //app.use(multer({dest:path.join(__dirname , "../public/upload/temp")}).single("image"));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    //app.use(fileUpload)

    //router
    Functions(app)

    // Middleware para Vue.js router modo history
    app.use(history());
    app.use(express.static(path.join(__dirname, "../public")));

    return app;
}