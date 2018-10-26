const helpers = require('../helpers/helpers');

module.exports = (app, passport) => {

    app.get('/admin-profile', (req, res) => {
        
        res.render('admin/admin-profile');
    });
    
    };