const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-in-transit', (req, res) => {
        
        res.render('admin/admin-in-transit');
    });
    
    };