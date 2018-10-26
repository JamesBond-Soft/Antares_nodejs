
const user = require('../app/models/artistModel');
const buyer = require('../app/models/buyerModel');
const configUrlCallBack = require('./config-url-callbacks');

var TwitterStrategy = require('passport-twitter').Strategy;
// Estrategia de autenticación con Facebook
var FacebookStrategy = require('passport-facebook').Strategy;

const config = require('./config-social-network');

module.exports = function(passport){

// Serializa al usuario para almacenarlo en la sesión
passport.serializeUser(function(user, done) {
    done(null, user);
});

// Deserializa el objeto usuario almacenado en la sesión para poder utilizarlo
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Configuración del autenticado con Twitter
passport.use(new TwitterStrategy({
    consumerKey		 : config.twitter.key,
    consumerSecret	: config.twitter.secret,
    callbackURL		 : configUrlCallBack.passport_url_twitter
}, function(accessToken, refreshToken, profile, done) {
   
    done(null, profile);
}));


// Configuración del autenticado con Facebook
passport.use(new FacebookStrategy({
    clientID			: config.facebook.key,
    clientSecret	: config.facebook.secret,
    callbackURL	 : configUrlCallBack.passport_url_facebook,
    profileFields : ['id', 'emails', 'displayName', 'name', 'picture.type(large)']
}, function(accessToken, refreshToken, profile, done) {

 done(null, profile);
}));



};