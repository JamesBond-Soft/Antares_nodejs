const helpers = require('../helpers/helpers');

module.exports = (app, passport) => {

    app.get('/admin-arts-auction', (req, res) => {
        
        res.render('admin/admin-arts-auction');
    });
    
};