const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-returned', (req, res) => {
        
        res.render('admin/admin-returned');
    });
    
    };