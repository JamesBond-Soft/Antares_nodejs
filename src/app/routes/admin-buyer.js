const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-buyer', (req, res) => {
        
        res.render('admin/admin-buyer');
    });
    
    };