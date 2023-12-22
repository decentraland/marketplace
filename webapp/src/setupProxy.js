const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'https://decentraland.zone/auth',
      changeOrigin: true,
      followRedirects: true,
      secure: false
    })
  );
};
