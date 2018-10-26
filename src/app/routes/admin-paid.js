const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-paid', (req, res) => {
        
        res.render('admin/admin-paid');
    });
    
    };