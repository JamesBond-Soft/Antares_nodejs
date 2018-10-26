const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-login', (req, res) => {
        
        res.render('admin/admin-login');
    });
};