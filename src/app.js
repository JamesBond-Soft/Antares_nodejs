const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const expressValidator = require('express-validator');
var https = require('https');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');

// var options = {
//     key: fs.readFileSync('/ssl/private.key'),
//     cert: fs.readFileSync('/ssl/certificate.crt')
// };

//settings
app.set('port', process.env.PORT || 8088); //80 for amazon aws and 3000 for localhost
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'app/views'));

//middlewares

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'wfwefwefwef', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(expressValidator());
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.languaje = req.session.languaje;
    next();
});


require('./app/cron/cron-jobs-antares')(app, passport);
require('./config/passport')(passport);
//routes admin
require('./app/routes/admin-administrator')(app, passport);
require('./app/routes/admin-all-arts')(app, passport);
require('./app/routes/admin-api-antares')(app, passport);
require('./app/routes/admin-artist')(app, passport);
require('./app/routes/admin-arts-auction')(app, passport);
require('./app/routes/admin-arts-sales')(app, passport);
require('./app/routes/admin-arts')(app, passport);
require('./app/routes/admin-buyer')(app, passport);
require('./app/routes/admin-closed-deals')(app, passport);
require('./app/routes/admin-commissions')(app, passport);
require('./app/routes/admin-completed-transfers')(app, passport);
require('./app/routes/admin-dasboard')(app, passport);
require('./app/routes/admin-in-test')(app, passport);
require('./app/routes/admin-in-transit')(app, passport);
require('./app/routes/admin-login')(app, passport);
require('./app/routes/admin-messages-answered')(app, passport);
require('./app/routes/admin-messages-unanswered')(app, passport);
require('./app/routes/admin-paid')(app, passport);
require('./app/routes/admin-pending-paid')(app, passport);
require('./app/routes/admin-pending-transfers')(app, passport);
require('./app/routes/admin-profile')(app, passport);
require('./app/routes/admin-received-by-buyer')(app, passport);
require('./app/routes/admin-returned')(app, passport);
require('./app/routes/admin-shipping-pending')(app, passport);
require('./app/routes/admin-time')(app, passport);
require('./app/routes/admin-translations')(app, passport);

//routes artist
require('./app/routes/artist-arts-bought')(app, passport);
require('./app/routes/artist-arts-edit-photo')(app, passport);
require('./app/routes/artist-arts-edit-video')(app, passport);
require('./app/routes/artist-arts-in-test-by-buyer')(app, passport);
require('./app/routes/artist-arts-more-popular-list')(app, passport);
require('./app/routes/artist-arts-more-popular-only')(app, passport);
require('./app/routes/artist-arts-shipping-free-list')(app, passport);
require('./app/routes/artist-arts-shipping-free')(app, passport);
require('./app/routes/artist-contact')(app, passport);
require('./app/routes/artist-likes-list')(app, passport);
require('./app/routes/artist-notification-list')(app, passport);
require('./app/routes/artist-pending-auctions')(app, passport);
require('./app/routes/artist-pending-sent-works')(app, passport);
require('./app/routes/artist-profile')(app, passport);
require('./app/routes/artist-returned-works')(app, passport);
require('./app/routes/artist-sent-works')(app, passport);
require('./app/routes/artist-transfers-payments')(app, passport);
require('./app/routes/artist')(app, passport);

//routes buyers
require('./app/routes/buyers-art-return-list')(app, passport);
require('./app/routes/buyers-art-return')(app, passport);
require('./app/routes/buyers-artist-list')(app, passport);
require('./app/routes/buyers-artist-profile')(app, passport);
require('./app/routes/buyers-arts-bought')(app, passport);
require('./app/routes/buyers-auction-offers')(app, passport);
require('./app/routes/buyers-bid')(app, passport);
require('./app/routes/buyers-contact')(app, passport);
require('./app/routes/buyers-in-test-only')(app, passport);
require('./app/routes/buyers-in-test')(app, passport);
require('./app/routes/buyers-notification-list')(app, passport);
require('./app/routes/buyers-on-route-only')(app, passport);
require('./app/routes/buyers-on-route')(app, passport);
require('./app/routes/buyers-paid-pending-auction')(app, passport);
require('./app/routes/buyers-profile')(app, passport);
require('./app/routes/buyers-shipping-pending')(app, passport);
require('./app/routes/buyers-states')(app, passport);
require('./app/routes/buyers-transfers-payments')(app, passport);
require('./app/routes/buyers')(app, passport);

//routes login-register
require('./app/routes/login-register')(app, passport);



//static files
app.use(express.static(path.join(__dirname,'public')));



//routes defaults important after app.use
app.get('/', (req, res) => {
    res.render('login-register/login-register');
});
app.get('/*', (req, res) => {
   res.end('error 404 page no found');
});


//  var server = https.createServer(options, app).listen(app.get('port'), function(){
//      console.log("server started at port 3000");
//  });

  app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
  });