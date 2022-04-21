/* 用于接口代理，解决跨域 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/banner',
        createProxyMiddleware({
            target: 'http://www.kangliuyong.com:10002',
            changeOrigin: true,
        })
    );
};