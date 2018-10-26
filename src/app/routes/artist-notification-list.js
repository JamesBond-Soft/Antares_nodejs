const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/artist-notification-list',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-notification-list');
    });
    
};