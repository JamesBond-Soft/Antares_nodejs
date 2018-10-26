const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/buyers-transfers-payments',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers-transfers-payments');
    });
    
    };