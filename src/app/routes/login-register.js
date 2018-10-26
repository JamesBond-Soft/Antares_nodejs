

const  artistModel = require('../models/artistModel');
const  buyerModel = require('../models/buyerModel');
const helpers = require('../helpers/helpers');

module.exports = (app, passport) => {

    app.get('/auth/twitter', passport.authenticate('twitter', { scope: ['email']}));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));

    app.get('/auth/twitter/callback',passport.authenticate('twitter',{
        successRedirect: '/login-twitter', failureRedirect: '/login-register'
    }));

    app.get('/auth/facebook/callback',passport.authenticate('facebook',{
        successRedirect: '/login-facebook', failureRedirect: '/login-register'
    }));


    app.get('/login-twitter',(req,res) => {
        artistModel.checkIfExistTwitter((err,data) => {
    
            if(err){
                console.log('este es el error: '+err);
                   }else{
                       if(data.length>0){
                       //is register at facebook
                       console.log("este es el tamaño devuelto de login facebook: "+data[0].name_ar);
                       req.session.user=data[0];
                       req.session.languaje='es';
                       if(data[0].selected_account_prefer_ar == "artist"){
                        res.redirect('/artist');
                    }else{
                        res.redirect('/buyers');
                    }
    
                       }else{
                        try{
                            req.user.emails[0].value;
                            artistModel.setArtistTwitter((err,data) => {
    
    
    
                                if(data){
                              
                                    artistModel.getUserTwitter((err,data) => {
        
                                        if(err){
                                            console.log('este es el error: '+err);
                                               }else{
                                                   if(data.length>0){
                                               //is register at facebook
                                               req.session.user=data[0];
                                               req.session.languaje='es';
                                               if(data[0].selected_account_prefer_ar == "artist"){
                                                res.redirect('/artist');
                                            }else{
                                                res.redirect('/buyers');
                                            }
                    
                                                   
                                                }
                                            }
                                        },req.user.id);
                               
                                    }else{
                                        res.render('login-register/login-register',{
                                           alert:{ type:'nevel3',message: 'Ocurrio un problema con el registro vuelva a intentar'}
                                          });
                                    }
    
                            }, req.user.id,req.user.displayName,req.user.photos[0].value.replace("_normal", ""),req.user.emails[0].value);
                        }catch(err){
                            artistModel.setArtistTwitter((err,data) => {
                               console.log(err);
                                if(data){
                                    console.log('este es data: '+data.length);
                                    //is register at facebook
                                    artistModel.getUserTwitter((err,data) => {
        
                                        if(err){
                                            console.log('este es el error: '+err);
                                               }else{
                                                   if(data.length>0){
                                               //is register at facebook
                                               req.session.user=data[0];
                                               req.session.languaje='es';
                                 if(data[0].selected_account_prefer_ar == "artist"){
                                                res.redirect('/artist');
                                 }else{
                                                res.redirect('/buyers');
                                }
                    
                                                   
                                                }
                                            }
                                        },req.user.id);
    
                                    }else{
                                        res.render('login-register/login-register',{
                                           alert:[{type:'level2',message: 'Ocurrio un problema con el registro vuelva a intentar'}]
                                     });
                                    }
    
                            }, req.user.id,req.user.displayName,req.user.photos[0].value.replace("_normal", ""),'');
                        }
                       }
                   }
           }, req.user.id);

    });

    app.get('/login-facebook',(req,res) => {
    artistModel.checkIfExistFacebook((err,data) => {
    
        if(err){
            console.log('este es el error: '+err);
               }else{
                   if(data.length>0){
                   //is register at facebook
                   console.log("este es el tamaño devuelto de login facebook: "+data[0].name_ar);
                   req.session.user=data[0];
                   req.session.languaje='es';
                   if(data[0].selected_account_prefer_ar == "artist"){
                    res.redirect('/artist');
                }else{
                    res.redirect('/buyers');
                }

                   }else{
                    try{
                        req.user.emails[0].value;
                        artistModel.setArtistFacebook((err,data) => {



                            if(data){
                          
                                artistModel.getUserFacebook((err,data) => {
    
                                    if(err){
                                        console.log('este es el error: '+err);
                                           }else{
                                               if(data.length>0){
                                           //is register at facebook
                                           req.session.user=data[0];
                                           req.session.languaje='es';
                                           if(data[0].selected_account_prefer_ar == "artist"){
                                            res.redirect('/artist');
                                        }else{
                                            res.redirect('/buyers');
                                        }
                
                                               
                                            }
                                        }
                                    },req.user.id);
                           
                                }else{
                                    res.render('login-register/login-register',{
                                       alert:{ type:'nevel3',message: 'Ocurrio un problema con el registro vuelva a intentar'}
                                      });
                                }

                        }, req.user.id,req.user.displayName,req.user.photos[0].value,req.user.emails[0].value);
                    }catch(err){
                        artistModel.setArtistFacebook((err,data) => {
                           console.log(err);
                            if(data){
                                console.log('este es data: '+data.length);
                                //is register at facebook
                                artistModel.getUserFacebook((err,data) => {
    
                                    if(err){
                                        console.log('este es el error: '+err);
                                           }else{
                                               if(data.length>0){
                                           //is register at facebook
                                           req.session.user=data[0];
                                           req.session.languaje='es';
                             if(data[0].selected_account_prefer_ar == "artist"){
                                            res.redirect('/artist');
                             }else{
                                            res.redirect('/buyers');
                            }
                
                                               
                                            }
                                        }
                                    },req.user.id);

                                }else{
                                    res.render('login-register/login-register',{
                                       alert:[{type:'level2',message: 'Ocurrio un problema con el registro vuelva a intentar'}]
                                 });
                                }

                        }, req.user.id,req.user.displayName,req.user.photos[0].value,'');
                    }
                   }
               }
       }, req.user.id);
    });



    app.post('/register-local', (req, res) => {
        
    
        var myErrors=[];

        //res.render('login-register/login-register');
        //length review
        req.check('userName','El  nombre debe tener al menos 5 caracteres').isLength({min:5, max:100});
        // req.check('email','El  email debe tener al menos 5 caracteres').isLength({min:5, max:100});
        req.check('password','La contraseña debe tener al menos 8 caracteres').isLength({min:8, max:1000});
        req.check('passwordRepeat','Validar contraseña debe tener al menos 8 caracteres').isLength({min:8, max:1000});
        req.check('typeAccount','Debe elejir el tipo de cuenta').isLength({min:1, max:150});
        //extra review
        // req.check('email','').isEmail();
        // req.check('email','El  el formato de email no es valido').isLowercase();
        req.check('password','Las contraseñas no coinciden').equals(req.body.passwordRepeat);

        myErrors.push({field: req.body.email, msg:'El  email no es válido', validatorType: 'isEmail', params:null });

        var namesPost={};
        namesPost.userName = req.body.userName;
        namesPost.email = req.body.email;
        namesPost.password = req.body.password;
        namesPost.passwordRepeat = req.body.passwordRepeat;
        namesPost.typeAccount = req.body.typeAccount;


        var errors = req.validationErrors();
       myErrors = helpers.validators(myErrors);


        if(errors || myErrors.length>0){

            if(myErrors.length>0){
                myErrors=helpers.serializeValidators(myErrors);
            }else{
                myErrors="";
            }
  
        res.render('login-register/login-register',{
            alert:[{type:'level4',message: helpers.serializeValidators(errors)+" "+myErrors}],
            namesPost: namesPost
         });

        }else{

            
            artistModel.checkIfExistLocal((err,data) => {
    
                if(err){
                    console.log('este es el error: '+err);
                       }else{
                           if(data.length>0){
                            res.render('login-register/login-register',{
                                alert:[{type:'level2',message: 'El email ya esta siendo utilizado porfavor intento con otro'}],
                                namesPost: namesPost
                          });
                           }else{
                            artistModel.setArtistLocal((err,data) => {
                         
                                 if(data){
                                     console.log('este es data: '+data.length);
                                  

                              
                                     artistModel.getArtistLocal((err,data) => {
    
                                        if(err){
                                            console.log('este es el error: '+err);
                                               }else{
                                                   if(data.length>0){
                                               //is register at facebook
                                               req.session.user=data[0];
                                               req.session.languaje='es';
                                                console.log('esta es la imagen: '+data[0].image_ar);
                                                res.redirect('/artist');
                                                   
                                                }
                                            }
                                        },req.body.email,req.body.password);
                
                
                                     }else{
                                        console.log('este es el error: '+err);
                                         res.render('login-register/login-register',{
                                            alert:[{type:'level2',message: 'Ocurrio un problema con el registro vuelva a intentar'}],
                                            namesPost: namesPost
                                      });
                                     }
                
                             }, req.body.userName, 'media/img/avatar-default.png', req.body.email,req.body.password,req.body.typeAccount);
                           }}
         },req.body.email);

        }
      
    });


    app.post('/login-local', (req, res) => {

        var namesPost={};
        namesPost.email = req.body.email;
        namesPost.password = req.body.password;
        var myErrors=[];

        // req.check('email','El  email debe tener al menos 5 caracteres').isLength({min:5, max:100});
        req.check('password','La contraseña debe tener al menos 8 caracteres').isLength({min:8, max:100});
            //extra review
            // req.check('email','El  email no es válido').isEmail();
            // req.check('email','El  el formato de email no es valido').isLowercase();
            myErrors.push({field: req.body.email, msg:'El  email no es válido', validatorType: 'isEmail', params:null });

        var errors = req.validationErrors();
   myErrors = helpers.validators(myErrors);

        if(errors || myErrors.length>0){
            if(myErrors.length>0){
                myErrors=helpers.serializeValidators(myErrors);
            }else{
                myErrors="";
            }

            res.render('login-register/login-register',{
                alert:[{type:'level4',message: helpers.serializeValidators(errors)+" "+myErrors}],
                namesPost: namesPost
             });
        }else{
            artistModel.loginLocal((err,data) => {
                if(err){
                    console.log('este es el error: '+err);
                }else{
                    if(data.length>0){
                        console.log("este es el usuario registrado: "+ data[0].name_ar);

                        req.session.user=data[0];
                        req.session.languaje='es';
                
                        if(data[0].selected_account_prefer_ar == "artist"){
                            res.redirect('/artist');
                        }else{
                            res.redirect('/buyers');
                        }

                        

                    }else{
                        res.render('login-register/login-register',{
                            alert:[{type:'level4',message: 'Email o  contraseña incorrectos'}],
                            namesPost: namesPost
                      });
                    }
                }
        },req.body.email,req.body.password);
        }
});

    app.get('/login-register', (req, res) => {
        
        res.render('login-register/login-register');

    });


    app.get('/exit-session', (req, res) => {
        req.session.user=false;
        req.session.languaje='es';

        res.redirect('/');

    });
};


