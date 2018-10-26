const helpers = require('../helpers/helpers');
module.exports = (app, passport) => {

    app.get('/artist-contact',helpers.isLogged, (req, res) => {
      
        console.log("entre a contactar");
        res.render('artist/artist-contact',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });
    

    app.post('/artist-contact-send',helpers.isLogged,(req, res) => {
   
  
        var tel=req.body.tel;
        var email=req.body.email;
        var message=req.body.message;
        var name= req.session.user.name_ar;



       
        helpers.SendEmailAntares( tel, email, message, name);


            req.flash('alert_success', 'Enviado correctamente, en breve Antares se pondrá en contacto contigo ');
            res.redirect('/artist-contact');
    

    });
};