const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-closed-deals', (req, res) => {
        
        res.render('admin/admin-closed-deals');
    });
    
    };