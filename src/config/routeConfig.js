const routerConf = (express, app) => {
    app.use('/auth', require('../routes/auth'));
    app.use('/coin', require('../routes/coin'));
    app.use('/info', require('../routes/info'));
};

module.exports = routerConf;