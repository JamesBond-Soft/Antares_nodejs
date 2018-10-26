const  artistModel = require('../models/artistModel');
const  artworkModel = require('../models/artworkModel');
const  notificationModel = require('../models/notificationModel');
const  buyerModel = require('../models/buyerModel');
const nodemailer = require('nodemailer');
const config_mailing = require('../../config/config-email');
const template_mailing = require('../email-templates/templates');
const configUrlCallBack = require('../../config/config-url-callbacks');

let helpers={};

helpers.canUpload =(req, res, next)=>{
    artistModel.canUpload((err,data) => {
          
        
        if(err){
            res.json({status:false, msg: err}); 
        }else{
           
            if(data.length>0){
                return next();
            }else{
                res.json({status:false, msg: '<a href="artist-profile">Para comenzar a agregar artes necesita completar la información de envió y pago en su cuenta pude dar clic en este mensaje para ir a completar los datos </a>'}); 
            }
        }

    },req.session.user.cod_ar);
}

helpers.canBuy =(req, res, next)=>{
    artistModel.canUpload((err,data) => {
          
        
        if(err){
            res.json({status:false, msg: err}); 
        }else{
           
            if(data.length>0){
                return next();
            }else{
               
          
                req.flash('alert_info', '<a href="artist-profile">  Para comenzar a comprar artes necesita completar la información de envió y pago en su cuenta pude dar clic en este mensaje para ir a completar los datos </a>');
                res.redirect('/buyers');
            }
        }

    },req.session.user.cod_ar);
}

helpers.serializeValidators = function(errors){

    var stringErrors='';
for(var a=0;a<errors.length;a++){

    stringErrors=stringErrors+errors[a].msg+", ";


}
return stringErrors.substring(0, stringErrors.length - 2);
};

helpers.isLogged=(req, res, next)=>{
    if(req.session.user){
       return next();
    }else{
       return res.redirect('/');
    }
}

    //validators


helpers.validators=(validators)=>{

    var errors=[];
    var resp;
    for(var a=0;a<validators.length;a++){
        if(validators[a].params==null){
        resp=eval(validators[a].validatorType)(validators[a]);
        if(resp==null){
        }else{
        errors.push(resp);
        }
    }else{
       
            resp=eval(validators[a].validatorType)(validators[a],validators[a].params);
            if(resp==null){
            }else{
            errors.push(resp);
            }
    
    }

 
}
return errors;
}

helpers.serializeStringToArray=(data)=>{
    var arrayTmp=data.split(",");
    arrayTmp=arrayTmp.filter(function(n){ return n != "" });

    return arrayTmp;
};

//validators names

alpanumericSpaces=(validation)=>{
    if(validation.field!=undefined && validation.field!='' && validation.field!=' '){
    var letters = /^[A-Za-z0-9- \u00C0-\u00FF]+$/;
    if(!validation.field.match(letters)){
       return validation;
    }else{
      return null;
    }
}else{
    return null;
 }
}


isNumeric=(validation)=>{

    var letters = /^[0-9]*$/;
 if(validation.field!=undefined && validation.field!='' && validation.field!=' '){
    if(!validation.field.toString().match(letters)){
       return validation;
    }else{
      return null;
    }
}else{
   return null;
}
}

noEmpty=(validation)=>{
 validation.field=validation.field.toString();
 
   validation.field= validation.field.trim();
 if(validation.field==undefined || validation.field=='' ){

       return validation;
   
}else{
   return null;
}
}
 
onlyOne=(validation,other)=>{
    try {
    validation.field=validation.field.toString();
    validation.field= validation.field.trim();
}catch(err){
    validation.field='';
   
}
try {
    other.otherField=other.otherField.toString();
    other.otherField=other.otherField.trim();
}catch(err){
    other.otherField='';
}
    

      
    if((validation.field==undefined || validation.field=='') && (other.otherField==undefined || other.otherField=='') ){
   
          return validation;
      
   }else{
      return null;
   }
}

greaterThan=(validation,other)=>{

    try {
        validation.field=validation.field.toString();
        validation.field= validation.field.trim();
    }catch(err){
        validation.field='';
       
    }


    if((validation.field==undefined || validation.field=='') ){
   
        return null;
    
 }else{
     if(parseInt(validation.field) >= other.min){
         return null
     }else{
         return validation;
     }
 }
}

arrayGreaterThan=(validation,other)=>{

   var arrayTmp=validation.field.split(",");
   arrayTmp=arrayTmp.filter(function(n){ return n != "" });
   console.log('esto es lo que hay en 0: '+JSON.stringify(arrayTmp) );
   console.log('este es el tamaño del array: '+arrayTmp.length );
  
    if(arrayTmp.length >= other.min){
 return null;
    }else{
        return validation;
    }
}

customErros=(validation)=>{
  return validation;
 }

 isEmail=(validation)=>{

if((validation.field==undefined || validation.field=='') ){
        return null;
 }else{
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(validation.field)){
        return null;
             }else{
        return validation;
             }
 }
 };


//notification
 
 helpers.sendNotificationBuyer=( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer,code_insert)=>{
   artistModel.getAllDataArtistForId((err,data) => {
    if(err){
        console.log(err);
                    }
        var image_ar=data[0].cod_ar;
        var rel_image=data[0].image_ar;
        notificationModel.setNotification((err,data) => {
            if(err){
console.log(err);
            }else{
                artistModel.getAllDataArtistForId((err,data2) => {
                    if(err){
                        console.log(err);
                   }else{
                       if(data2[0].email_ar!=''){
                        SendEmail(rel_image, title_no_buyer, description_no_buyer, url_no_buyer, type_no_buyer, data2[0].email_ar,data2[0].name_ar ,'Comprador');
                       }else{
                           console.log("email is empty, can't send email");
                       }
                   
                   }
                },code_insert);
            }
            console.log('ha sido enviada la notificación al artista');
        },'buyer', code_insert, description_no_buyer, title_no_buyer, image_ar, type_no_buyer, url_no_buyer);
     },cod_type_user_no_buyer);
}




helpers.sendNotificationArtist=( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert)=>{
    buyerModel.getAllDataBuyerForId((err,data) => {
        if(err){
            console.log(err);
                        }
        var image_bu=data[0].cod_bu;
        var rel_image=data[0].image_bu;

        notificationModel.setNotification((err,data) => {
            if(err){
                console.log(err);
           }else{
            artistModel.getAllDataArtistForId((err,data2) => {
                if(err){
                    console.log(err);
               }else{
                   if(data2[0].email_ar!=''){
                    SendEmail(rel_image, title_no_artist, description_no_artist, url_no_artist, type_no_artist, data2[0].email_ar,data2[0].name_ar ,'Artista');
                   }else{
                       console.log("email is empty, can't send email");
                   }
               
               }
            },code_insert);
               
           }
            console.log('ha sido enviada la notificación al comprador');
        },'artist', code_insert, description_no_artist, title_no_artist, image_bu, type_no_artist, url_no_artist);
     },cod_type_user_no_artist); 
}

helpers.sendNotificationAntares=(emailAntaresMont,emailAntaresTitle,emailAntaresMessage,emailAntaresTypePicture,emailAntaresTypeSale,emailAntaresIdArtistOrBuyer)=>{
    
    artistModel.getAllDataArtistForId((err,data) => {
     if(err){
         console.log('entre a erorrrrrrrrr email antares');
         console.log(err);
      }else{
        var image_ar=data[0].cod_ar;
        var rel_image=data[0].image_ar;
        SendEmail(rel_image, emailAntaresTitle, emailAntaresMessage, '' , 'Antares', config_mailing.email_antares , '' ,'Pago ');
        console.log('envie email antaressssssssssss');
      }
      },emailAntaresIdArtistOrBuyer);
 }
    
////////validation bid

helpers.validateDateBid =(req, res, next)=>{
    var amount_au=req.body.amount_au;
    var cod_ar=req.body.cod_ar;
    var cod_art=req.body.cod_art;

  artworkModel.validateDateBid((err,data) => {
        if(err){
            console.log(JSON.stringify(err));
            req.flash('alert_danger', 'Ocurrio un error');
            res.redirect('/buyers-bid/'+cod_art);
        }else{
           
            if(data[0].time_to_finish!="TIME OVER"){
                return next();
            }else{
                req.flash('alert_danger', 'Lo sentimos el tiempo de esta subasta ha terminado o ya ha sido ganada');
                res.redirect('/buyers-bid/'+cod_art);
            }
        }
    },cod_art);
};

helpers.validateAmountBid =(req, res, next)=>{

    var amount_au=req.body.amount_au;
    var cod_ar=req.body.cod_ar;
    var cod_art=req.body.cod_art;
  
     artworkModel.validateAmountBid((err,data) => {
            if(err){
                console.log(JSON.stringify(err));
                req.flash('alert_danger', 'Ocurrio un error');
                res.redirect('/buyers-bid/'+cod_art);
            }else{
               console.log("esta es la respuesta: "+data[0].response);
            if(data[0].response=="OK"){
                    return next();
            }else{
                req.flash('alert_danger', 'La cantidad para su oferta debe ser mayor a la oferta actual por un minimo de $ 100 MXN.');
                res.redirect('/buyers-bid/'+cod_art);
             }
            }
        },cod_art,amount_au);
 };

    helpers.validateStatusBid = (req, res, next)=>{
    var amount_au=req.body.amount_au;
    var cod_ar=req.body.cod_ar;
    var cod_art=req.body.cod_art;
      artworkModel.validateStatusBid((err,data) => {
                if(err){
                    console.log(JSON.stringify(err));
                    req.flash('alert_danger', 'Ocurrio un error');
                    res.redirect('/buyers-bid/'+cod_art);
                }else{
                   
                    if(data.length>0){
                        return next();
                    }else{
                        req.flash('alert_danger', 'Esta subasta ha terminado o ha sido eliminada');
                        res.redirect('/buyers');
                    }
                }
    },cod_art);
    };

    helpers.validateStatusArtForCheck = (req, res, next)=>{
        
          artworkModel.validateStatusBid((err,data) => {
                    if(err){
                        console.log(JSON.stringify(err));
                        req.flash('alert_danger', 'Esta arte ha sido eliminada');
                        res.redirect('/buyers');
                    }else{
                       
                        if(data.length>0){
                            return next();
                        }else{
                            req.flash('alert_danger', 'Esta arte ha sido eliminada');
                            res.redirect('/buyers');
                        }
                    }
        },req.params.art);
        };

        helpers.validateStatusArtForCheck2 = (req, res, next)=>{
        
            artworkModel.validateStatusBid((err,data) => {
                      if(err){
                          console.log(JSON.stringify(err));
                          req.flash('alert_danger', 'Esta arte ha sido eliminada');
                          res.redirect('/buyers');
                      }else{
                         
                          if(data.length>0){
                              return next();
                          }else{
                              req.flash('alert_danger', 'Esta arte ha sido eliminada');
                              res.redirect('/buyers');
                          }
                      }
          },req.params.artId);
          };

///////////////emailing
SendEmail = function(urlPicture, title, message, linkBtn, type_email, email,name ,typeAccount){
    var imageFinal='';
    var textBtn='IR A ANTARES DESDE AQUÍ';
console.log("esta es la url picture: "+urlPicture);
if(urlPicture == 'media/img/avatar-default.png'){ 
    imageFinal=  configUrlCallBack.base_url+'media/img/avatar-default.png';
 }else if(urlPicture.indexOf("http")!=-1){
    imageFinal=  urlPicture;
}else{ 
    imageFinal=  configUrlCallBack.base_url+'/imagesUsers/'+urlPicture;
}

    let transporter = nodemailer.createTransport({
        host: config_mailing.host,
        port:  config_mailing.port,
        secure: config_mailing.secure, 
        auth: config_mailing.auth
    });
    
    let mailOptions = {
        from: '"Antares " <info@arteantares.com>', // sender address
        to: email, // list of receivers
        subject: typeAccount+' Antares', // Subject line ejemplo//tienes un nuevio mensahe de arion diaz!
        text: '', // plain text body
        html: template_mailing.template1(imageFinal, title, message, configUrlCallBack.base_url+linkBtn, textBtn, name) // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        }else{
            console.log("enviado correctamente");
            return true;
        }
    });
};


helpers.setFormatMoneyMxn = (cant)=>{
var cantTmp=cant.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+" MXN";
return "$ "+cantTmp;

};

///////////////send mail normal
helpers.SendEmailAntares = function( tel, email, message, name){
  
    let transporter = nodemailer.createTransport({
        host: config_mailing.host,
        port:  config_mailing.port,
        secure: config_mailing.secure, 
        auth: config_mailing.auth
    });

    var msgTmp=message+" <br> Datos de contacto <br> Email: "+email+" <br> Teléfono: "+tel
    
    let mailOptions = {
        from: '"Antares Contacto " <info@arteantares.com>', // sender address
        to: config_mailing.email_antares, // list of receivers
        subject: "Tienes un nuevo mensaje de "+name, // Subject line ejemplo//tienes un nuevio mensahe de arion diaz!
        text: '', // plain text body
        html: template_mailing.template2( msgTmp, name) // html body
    };
    transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
        console.log(error);
          return false;
      }else{
         console.log("enviado correctamente");
          return true;
      }
     });
};



module.exports = helpers;