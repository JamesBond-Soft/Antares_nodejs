const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-pending-transfers', (req, res) => {
        
        res.render('admin/admin-pending-transfers');
    });
    
    };