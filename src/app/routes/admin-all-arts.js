const helpers = require('../helpers/helpers');

module.exports = (app, passport) => {

    app.get('/admin-all-arts', (req, res) => {
        
        res.render('admin/admin-all-arts');
    });
    
    };