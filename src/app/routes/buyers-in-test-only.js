const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/buyers-in-test-only',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers-in-test-only');
    });

    app.post('/buyers-in-test-post',helpers.isLogged, (req, res) => {
        res.redirect('/buyers-in-test');

    });


    
    
    };