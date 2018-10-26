const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-translations',helpers.isLogged, (req, res) => {
        
        res.render('admin/admin-translations');
    });
    
    };