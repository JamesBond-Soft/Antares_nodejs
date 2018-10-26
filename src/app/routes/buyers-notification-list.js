const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/buyers-notification-list',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers-notification-list');
    });
    
    };