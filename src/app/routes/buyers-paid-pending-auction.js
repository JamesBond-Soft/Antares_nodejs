const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  auctionModel = require('../models/auctionModel');
const  tagModel = require('../models/tagModel');
const  likeModel = require('../models/likeModel');
const  saleModel = require('../models/saleModel');
const paypal = require('paypal-rest-sdk');
const configPaypal = require('../../config/config-paypal');
const configUrlCallBack = require('../../config/config-url-callbacks');

paypal.configure({
'mode': configPaypal.mode,
'client_id': configPaypal.client_id,
'client_secret': configPaypal.client_secret
});

var artAuctionDirect=null;
var actualPayInfo={};


module.exports = (app, passport) => {

    app.get('/buyers-paid-pending-auction',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers-paid-pending-auction',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });
    

    app.post('/getBuyerAuctionPendingPaidList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        auctionModel.getBuyerAuctionPendingPaidList((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                auctionModel.getBuyerAuctionPendingPaidListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_artist);
            }
        },cod_artist, newLimit,cantToShow);
    });

    /////////////paid auction month


    app.get('/payArtAuction/:auctionId',helpers.canBuy,helpers.isLogged,(req, res) => {

        var auctionId=req.params.auctionId;
        
        auctionModel.getAuctionForId((err,data) => {
       
               if(err){
                       req.flash('alert_danger', 'Ocurrio un error porfavor vuelva a intentar o contacte con antares ');
                       res.redirect('/buyers-paid-pending-auction');
               }else{
       
                artAuctionDirect=data;
             console.log("este es el precio"+artAuctionDirect[0].amount_au);
           const create_payment_json = {
               "intent": "sale",
               "payer": {
                   "payment_method": "paypal"
               },
               "redirect_urls": {
                   "return_url": configUrlCallBack.payAuctionSuccess,
                   "cancel_url": configUrlCallBack.payAuctionCancel
               },
               "transactions": [{
                   "item_list": {
                       "items": [{
                           "name": "Antares art: "+artAuctionDirect[0].title_art+" - "+artAuctionDirect[0].measurements+" - "+artAuctionDirect[0].author_art,
                           "sku": "sku_art_antares_"+artAuctionDirect[0].cod_art,
                           "price": artAuctionDirect[0].amount_au,
                           "currency": "MXN",
                           "quantity": 1
                       }]
                   },
                   "amount": {
                       "currency": "MXN",
                       "total":  artAuctionDirect[0].amount_au,
                   },
                   "description": "Subasta antares"
               }]
           };
       
           console.log(JSON.stringify(create_payment_json));
           actualPayInfo={currency: "MXN", total: artAuctionDirect[0].amount_au};
       
           //create payment
           paypal.payment.create(create_payment_json, function (error, payment) {
               if (error) {
                   console.log(JSON.stringify(error));
                   req.flash('alert_danger', 'Ocurrio un error porfavor vuelva a intentar o contacte con antares ');
                   res.redirect('/buyers-paid-pending-auction');
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

       
       },auctionId);
         });
       
         app.get('/payAuctionSuccess', (req, res) => {
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
                 res.redirect('/buyers-paid-pending-auction');
             } else {
       //console.log(JSON.stringify(payment));
         ////////////////////update status art and auction
       auctionModel.updateArtStatusPaidAuction((err,data) => {
       if(err){
           console.log(err);
               req.flash('alert_danger', 'Ocurrio un error porfavor vuelva a intentar o contacte con antares ');
               res.redirect('/buyers-paid-pending-auction');
       }else{

        artworkModel.updateArtStatusPaidAuction((err,data) => {
            if(err){
                console.log(err);
                    req.flash('alert_danger', 'Ocurrio un error porfavor vuelva a intentar o contacte con antares ');
                    res.redirect('/buyers-paid-pending-auction');
            }else{

//buyer vars for notification
  var  cod_type_user_no_buyer= artAuctionDirect[0].cod_ar4;
  var  title_no_buyer='La obra: '+artAuctionDirect[0].title_art+" - "+artAuctionDirect[0].measurements+" ha sido pagada y entrado en proceso de envío";
  var  description_no_buyer="La obra ha entrado en proceso de envío por parte del creador, una ves que se envíe te será notificado en obras en ruta";
  var  type_no_buyer='setSendBuyer';
  var  url_no_buyer='buyers-on-route';
  var  code_insert_buyer=artAuctionDirect[0].cod_bu3;
  
//artist vars for notification
  var  cod_type_user_no_artist=artAuctionDirect[0].cod_bu3;
  var  title_no_artist='Tu obra: '+artAuctionDirect[0].title_art+" - "+artAuctionDirect[0].measurements+" ha sido pagada";
  var  description_no_artist="La obra ha sido pagada y ha entrado en proceso de envío ahora te corresponde enviar la obra lo mas pronto posible para ello puedes ir a tu lista de obras pendientes de envío ha entrado en proceso de envío";
  var  type_no_artist='setSendBuyer';
  var  url_no_artist='artist-arts-shipping-free-list';
  var  code_insert_artist=artAuctionDirect[0].cod_ar4;
  helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
  helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);
            

  //send email antares
  emailAntaresMont=artAuctionDirect[0].amount_au;
  emailAntaresTitle='La obra en subasta: '+artAuctionDirect[0].title_art+" - "+artAuctionDirect[0].measurements+" ha sido pagada";
  emailAntaresMessage='La obra: '+artAuctionDirect[0].title_art+" - "+artAuctionDirect[0].measurements+" ha sido pagada por el comprador "+req.session.user.name_ar+" por el monto de: "+helpers.setFormatMoneyMxn(artAuctionDirect[0].amount_au);
  emailAntaresTypePicture='buyer';
  emailAntaresTypeSale='auction';
  emailAntaresIdArtistOrBuyer=artAuctionDirect[0].cod_bu3;
   helpers.sendNotificationAntares(emailAntaresMont,emailAntaresTitle,emailAntaresMessage,emailAntaresTypePicture,emailAntaresTypeSale,emailAntaresIdArtistOrBuyer);//monto, titulo, mensaje, type-picture, tipo de venta        
 

  req.flash('alert_info', 'Se ha realizado  el pago correctamente');
  res.redirect('/buyers-paid-pending-auction');

            }
            }, artAuctionDirect[0].cod_art);
       }
       }, artAuctionDirect[0].cod_au);
       }
         });
         });
       
         app.get('/payAuctionCancel', (req, res) => {
           req.flash('alert_info', 'Se ha cancelado el pago');
           res.redirect('/buyers-paid-pending-auction');
       
         });

    };