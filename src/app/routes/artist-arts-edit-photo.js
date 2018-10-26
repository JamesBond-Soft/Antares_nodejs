const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/artist-arts-edit-photo',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-arts-edit-photo');
    });
    
};