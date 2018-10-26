const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-received-by-buyer', (req, res) => {
        
        res.render('admin/admin-received-by-buyer');
    });
    
    };