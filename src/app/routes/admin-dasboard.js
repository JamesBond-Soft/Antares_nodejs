const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-dasboard', (req, res) => {
        
        res.render('admin/admin-dasboard');
    });
    
    };