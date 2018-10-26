const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-pending-paid', (req, res) => {
        
        res.render('admin/admin-pending-paid');
    });
    
    };