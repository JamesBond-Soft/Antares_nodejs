const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/artist-arts-more-popular-only',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-arts-more-popular-only');
    });
    
};