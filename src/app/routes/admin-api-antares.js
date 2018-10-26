const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-api-antares', (req, res) => {
        
        res.render('admin/admin-api-antares');
    });
    
    };