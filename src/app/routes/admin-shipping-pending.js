const helpers = require('../helpers/helpers');

module.exports = (app, passport) => {

    app.get('/admin-shipping-pending', (req, res) => {
        
        res.render('admin/admin-shipping-pending');
    });
    
    };