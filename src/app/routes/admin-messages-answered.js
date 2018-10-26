const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/admin-messages-answered', (req, res) => {
        
        res.render('admin/admin-messages-answered');
    });
    
    };