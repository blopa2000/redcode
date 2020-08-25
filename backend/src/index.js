// const express =  require("express");
import express from "express";
import config from "./server/config";

//mongodb conexion
require("./mongodb");

const app = config(express());

app.listen(app.get("port"), () => {
  console.log("server on port ", app.get("port"));
});
