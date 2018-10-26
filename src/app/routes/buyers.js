const helpers = require('../helpers/helpers');
const  thematicModel = require('../models/thematicModel');
const  techniqueModel = require('../models/techniqueModel');
const  categoryModel = require('../models/categoryModel');
const  artworkModel = require('../models/artworkModel');
const  tagModel = require('../models/tagModel');
const  likeModel = require('../models/likeModel');
const  saleModel = require('../models/saleModel');
const  buyerModel = require('../models/buyerModel');
const  notificationModel = require('../models/notificationModel');

const paypal = require('paypal-rest-sdk');
const configPaypal = require('../../config/config-paypal');

const configUrlCallBack = require('../../config/config-url-callbacks');

paypal.configure({
'mode': configPaypal.mode,
'client_id': configPaypal.client_id,
'client_secret': configPaypal.client_secret
});

var artSaleDirect=null;
var actualPayInfo={};

const path = require('path');
var multer = require('multer');
var fs = require('fs');

module.exports = (app, passport) => {

    app.get('/buyers',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });


    
  app.post('/getArtsBuyer',helpers.isLogged,(req, res) => {
    var cod_artist=req.session.user.cod_ar;
    var  tagsThematic=req.body.tagsThematic;
    var  tagsCategory=req.body.tagsCategory;
    var  tagsTechnique=req.body.tagsTechnique;
    var offset=parseInt(req.body.offset);
    var limit=parseInt(req.body.limit);

    var serTagsCategory=helpers.serializeStringToArray(tagsCategory);
    var serTagsThematic=helpers.serializeStringToArray(tagsThematic);
    var serTagsTechnique=helpers.serializeStringToArray(tagsTechnique);

    var queryToTagsCategory=`(`;
    if(serTagsCategory.length>0){
        for(var a=0;a<serTagsCategory.length;a++){
            if(a+1==serTagsCategory.length){
                queryToTagsCategory+=`tag_ca.cod_ca20=`+serTagsCategory[a];
            }else{
                queryToTagsCategory+=`tag_ca.cod_ca20=`+serTagsCategory[a]+` OR `;
            }
        }
      
    }
    queryToTagsCategory+=`)`;

    var queryToTagsThematic=`(`;
    if(serTagsThematic.length>0){
        for(var a=0;a<serTagsThematic.length;a++){
            if(a+1==serTagsThematic.length){
                queryToTagsThematic+=`tag_th.cod_th22=`+serTagsThematic[a];
            }else{
                queryToTagsThematic+=`tag_th.cod_th22=`+serTagsThematic[a]+` OR `;
            }
        }
        
    }
    queryToTagsThematic+=`)`;

    var queryToTagsTechnique=`(`;
    if(serTagsTechnique.length>0){
        for(var a=0;a<serTagsTechnique.length;a++){
            if(a+1==serTagsTechnique.length){
                queryToTagsTechnique+=`tag_te.cod_te21=`+serTagsTechnique[a];
            }else{
                queryToTagsTechnique+=`tag_te.cod_te21=`+serTagsTechnique[a]+` OR `;
            }
        }
        
    }
    queryToTagsTechnique+=`)`;



    artworkModel.getArtworksBuyer((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
        }else{
            res.send(data);
        }
    },cod_artist, queryToTagsCategory, queryToTagsTechnique, queryToTagsThematic,offset, limit);

   

  });


  app.post('/unlikeArt',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;
    var  idArt=req.body.idArt;

    likeModel.unlikeArt((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
        }else{
            res.send(data);
        }
    },cod_buyer,idArt);

 
  });

  app.post('/likeArt',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;
    var idArt=req.body.idArt;


    likeModel.likeArt((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
        }else{
            res.send(data);
            artworkModel.getArtistForIdArt((err,artistInfo) => {
                if(err){
                   console.log(err);
                }else{
                var idArtist=artistInfo[0].cod_ar;
                likeModel.setNotificationLike((err,artistInfo) => {
                    if(err){
                       console.log(err);
                    }else{
            
                    }
                },cod_buyer,idArt,idArtist);
        
                }
            },idArt);
        }
    },cod_buyer,idArt);
 
  });

  app.get('/payArtDirect/:artId',helpers.canBuy,helpers.isLogged,helpers.validateStatusArtForCheck2,(req, res) => {

 var artIdTmp=req.params.artId;
 
 artworkModel.getArtworkForId((err,data) => {

    artworkModel.validateSaleDirectArtwork((err,valid) => {
 
  

        if(err || valid.length>0 ){

            if(valid.length>0){
                req.flash('alert_danger', 'El tiempo se ha agotado  o alguien ya ha procedido a comprar la obra ');
                res.redirect('/buyers');
            }else{
                req.flash('alert_danger', 'Ocurrio un error porfavor vuelva a intentar o contacte con antares ');
                res.redirect('/buyers');
            }

           
        }else{

artSaleDirect=data;
      console.log("este es el precio"+artSaleDirect[0].sale_price_art);
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": configUrlCallBack.paypal_return_url,
            "cancel_url": configUrlCallBack.paypal_cancel_url
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Antares art: "+artSaleDirect[0].title_art+" - "+artSaleDirect[0].measurements+" - "+artSaleDirect[0].author_art,
                    "sku": "sku_art_antares_"+artSaleDirect[0].cod_art,
                    "price": artSaleDirect[0].sale_price_art,
                    "currency": "MXN",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "MXN",
                "total":  artSaleDirect[0].sale_price_art,
            },
            "description": "Hat for the best team ever"
        }]
    };

    console.log(JSON.stringify(create_payment_json));
    actualPayInfo={currency: "MXN", total: artSaleDirect[0].sale_price_art};

    //create payment
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(JSON.stringify(error));
            req.flash('alert_danger', 'Ocurrio un error porfavor vuelva a intentar o contacte con antares ');
            res.redirect('/buyers');
        }else{
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href);
              }
            }
        }
      });
    //end create payment
}
//hore
},artIdTmp);

},artIdTmp);
  });

  app.get('/payDirectSuccess', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  

   const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": actualPayInfo.currency,
              "total":  actualPayInfo.total
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
          console.log(error.response);
          req.flash('alert_danger', 'Ocurrio un error porfavor vuelva a intentar o contacte con antares dando');
          res.redirect('/buyers');
      } else {
//console.log(JSON.stringify(payment));
saleModel.setSale((err,data) => {
if(err){
    console.log(err);
        req.flash('alert_danger', 'Ocurrio un error porfavor vuelva a intentar o contacte con antares ');
        res.redirect('/buyers');
}else{
    


    artworkModel.updateArtSaleDirectStatus((err,data) => {
        if(err){
            console.log(err);
                req.flash('alert_danger', 'Ocurrio un error porfavor vuelva a intentar o contacte con antares ');
                res.redirect('/buyers');
        }else{
      //buyer vars for notification
  var  cod_type_user_no_buyer= artSaleDirect[0].cod_ar2;
  var  title_no_buyer='La obra: '+artSaleDirect[0].title_art+" - "+artSaleDirect[0].measurements+" ha sido pagada y ha entrado en proceso de envío";
  var  description_no_buyer="La obra ha entrado en proceso de envío por parte del creador, una ves que se envíe te será notificado en obras en ruta";
  var  type_no_buyer='setSendBuyer';
  var  url_no_buyer='buyers-on-route';
  var  code_insert_buyer=req.session.user.cod_ar;
  
//artist vars for notification
  var  cod_type_user_no_artist=req.session.user.cod_ar;
  var  title_no_artist='Tu obra: '+artSaleDirect[0].title_art+" - "+artSaleDirect[0].measurements+" ha sido pagada";
  var  description_no_artist="La obra ha sido pagada y ha entrado en proceso de envío ahora te corresponde enviar la obra lo mas pronto posible para ello puedes ir a tu lista de obras pendientes de envío";
  var  type_no_artist='setSendBuyer';
  var  url_no_artist='artist-arts-shipping-free-list';
  var  code_insert_artist=artSaleDirect[0].cod_ar2;
  helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
  helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);
 
  //send email antares
 emailAntaresMont=artSaleDirect[0].sale_price_art;
 emailAntaresTitle='La obra en venta: '+artSaleDirect[0].title_art+" - "+artSaleDirect[0].measurements+" ha sido pagada";
 emailAntaresMessage='La obra: '+artSaleDirect[0].title_art+" - "+artSaleDirect[0].measurements+" ha sido pagada por el comprador "+req.session.user.name_ar+" por el monto de: "+helpers.setFormatMoneyMxn(artSaleDirect[0].sale_price_art);
 emailAntaresTypePicture='buyer';
 emailAntaresTypeSale='direct';
 emailAntaresIdArtistOrBuyer=req.session.user.cod_ar;
  helpers.sendNotificationAntares(emailAntaresMont,emailAntaresTitle,emailAntaresMessage,emailAntaresTypePicture,emailAntaresTypeSale,emailAntaresIdArtistOrBuyer);//monto, titulo, mensaje, type-picture, tipo de venta        

           req.flash('alert_success', 'La obra ha sido pagada, la obra ha entrado en etapa de envió por parte del creador, el creador ha sido notificado y ahora tiene la responsabilidad de enviar la obra puede ver el estado en Obras En ruta o pendientes de envió, cualquier duda contacte con Antares');
           res.redirect('/buyers');
        }

    },artSaleDirect[0].cod_art);


}
},artSaleDirect[0].sale_price_art,req.session.user.cod_ar, artSaleDirect[0].cod_art, artSaleDirect[0].cod_ar2);


      }
  });
  });

  app.get('/payDirectCancel', (req, res) => {
    req.flash('alert_info', 'Se ha cancelado el pago');
    res.redirect('/buyers');

  });

  /////////////////////////////////////////////////////////aside buyer
  app.post('/getArtsStatesAsideBuyer',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;
    var  limit=req.body.limit;

    artworkModel.getArtsStatesAsideBuyer((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send({data:data});
        }
    },cod_buyer,limit);
 
  });

  app.post('/getArtsAuctionsInCurseAsideBuyer',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;
    var  limit=req.body.limit;

    artworkModel.getArtsAuctionsInCurseAsideBuyer((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send({data:data});
        }
    },cod_buyer,limit);
 
  });
/////////////////////////////////////////////////////notifications
app.post('/getNotificationsBuyer',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;

    notificationModel.getNotificationsBuyer((err,data) => {
        if(err){
           // res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send(data);
        }
    },cod_buyer);
 
  });

  app.post('/getNotificationsBuyerCount',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;

    notificationModel.getNotificationsBuyerCount((err,data) => {
        if(err){
           // res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send(data);
        }
    },cod_buyer);
 
  });

  

  app.post('/setReadNotificationBuyer',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;

    var  notifiId=req.body.notifiId;
    var  readORNot=req.body.readORNot;
    var  link=req.body.link;
    var  description=req.body.description;

    notificationModel.setReadNotificationBuyer((err,data) => {
        if(err){
           // res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
            req.flash('alert_info', description);
            res.send(true);
           
           // res.redirect('/'+link);
        }else{
            req.flash('alert_info', description);
            res.send(true);
           
         //   res.redirect('/'+link);
        }
    },notifiId);
 
  });



  app.post('/getBuyerNotificationList',helpers.isLogged,(req, res) => {
    var cod_artist=req.session.user.cod_ar;
    var limit=req.body.limit;
    var cantToShow=req.body.cantToShow;

    var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

    notificationModel.getBuyerNotificationList((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
        }else{
            notificationModel.getBuyerNotificationListCount((err,numberData) => {
                if(err){
                    res.send(JSON.stringify({status:false, msg: err})); 
                }else{
    
                    res.send({data:data,count:numberData.length} );
                }
            },cod_artist);
        }
    },cod_artist, newLimit,cantToShow);
});

//////////////////////

app.post('/getInfoBuyerAside',helpers.isLogged,(req, res) => {
    var cod_artist=req.session.user.cod_ar;
 

    artworkModel.getInfoBuyerAside((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send({data:data});
        }
    },cod_artist);
 
  });
  

};