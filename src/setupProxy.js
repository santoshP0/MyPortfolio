const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function configureProxy(app) {
  app.use(
    "/api/alertzy",
    createProxyMiddleware({
      target: "https://alertzy.app",
      changeOrigin: true,
      pathRewrite: {
        "^/api/alertzy": "",
      },
      secure: true,
    })
  );
};
