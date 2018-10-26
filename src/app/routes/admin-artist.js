const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-artist', (req, res) => {
        
        res.render('admin/admin-artist');
    });
    
    };