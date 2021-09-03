const webpack = require('webpack');
module.exports = {
    chainWebpack: config => {
        config.plugin('provide').use(webpack.ProvidePlugin, [{
            'window.Quill': 'quill'
        }])
    },
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        port: 8000,
        host: 'localhost',
        https: false,
        open: true,
        proxy: {
            '/api':{
                target:'http://localhost:8444',
                changeOrigin:true,
                pathRewrite:{
                    '^/api':'',
                    '/api':''
                }
            }
        }
    }
};