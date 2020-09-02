module.exports = (app) => {
  app.use("/functs", require("./functions/login"));
  app.use("/functs", require("./functions/profile"));
  app.use("/functs", require("./functions/post"));
};
