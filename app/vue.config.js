module.exports = {
  devServer: {
    proxy: {
      "/functs": {
        target: "http://localhost:5000",
        changeOrigin: true
      }
    }
  },
  transpileDependencies: ["vuetify"]
};
