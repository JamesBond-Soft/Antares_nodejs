const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/artist-pending-sent-works',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-pending-sent-works');
    });
    
};