const helpers = require('../helpers/helpers');

module.exports = (app, passport) => {

    app.get('/admin-completed-transfers', (req, res) => {
        
        res.render('admin/admin-completed-transfers');
    });
    
    };