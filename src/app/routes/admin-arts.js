const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-arts', (req, res) => {
        
        res.render('admin/admin-arts');
    });
    
    };