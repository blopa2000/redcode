import mongoose from "mongoose";
import { mongodb } from "./keys";
mongoose
  .connect(mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log("mongodb is connection ");
  })
  .catch((err) => {
    console.error("error en la coneccion de mongodb");
  });

// evita este error que sale por el unique (node:5456) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set("useCreateIndex", true);
