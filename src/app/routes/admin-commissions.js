const helpers = require('../helpers/helpers');

module.exports = (app, passport) => {

    app.get('/admin-commissions', (req, res) => {
        
        res.render('admin/admin-commissions');
    });
    
    };