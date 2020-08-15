// const express =  require("express");
import express from "express"
const config = require("./server/config");

//mongodb conexion
require("./mongodb");

const app = config(express())

app.listen(app.get("port"),()=>{
    console.log("server on port ",app.get("port"));  
})
