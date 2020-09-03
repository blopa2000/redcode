import express from "express";
import config from "./server/config";

//mongodb Connection
require("./mongodb");

const app = config(express());

app.listen(app.get("port"), () => {
  console.log("server on port ", app.get("port"));
});
