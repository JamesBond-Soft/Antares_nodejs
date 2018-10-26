const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/buyers-artist-profile',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers-artist-profile');
    });
    
    };