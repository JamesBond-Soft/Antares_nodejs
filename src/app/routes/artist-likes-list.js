const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/artist-likes-list',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-likes-list');
    });
    
};