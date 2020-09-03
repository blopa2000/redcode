import path from "path";
import express from "express";
import morgan from "morgan";
import history from "connect-history-api-fallback";
import cors from "cors";
import Functions from "../routes/fuctions";

module.exports = (app) => {
  //settings
  app.set("port", process.env.PORT || 5000);

  //middleware
  app.use(morgan("combined"));
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //router
  Functions(app);

  // Middleware for Vuejs router mode history
  app.use(history());
  app.use(express.static(path.join(__dirname, "../public")));

  return app;
};
