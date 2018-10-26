const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/buyers-artist-list',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers-artist-list');
    });
    
    };