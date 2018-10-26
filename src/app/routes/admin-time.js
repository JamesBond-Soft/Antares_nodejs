const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-time', (req, res) => {
        
        res.render('admin/admin-time');
    });
    
    };