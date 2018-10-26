const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/artist-transfers-payments',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-transfers-payments');
    });
    
};