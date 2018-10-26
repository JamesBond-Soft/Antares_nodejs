
const helpers = require('../helpers/helpers');

module.exports = (app, passport) => {

    app.get('/admin-in-test', (req, res) => {
        
        res.render('admin/admin-in-test');
    });

    
    
};