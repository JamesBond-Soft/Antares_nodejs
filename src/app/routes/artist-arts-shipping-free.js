const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  buyerModel = require('../models/buyerModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
module.exports = (app, passport) => {



    app.get('/artist-arts-shipping-free/:artId',helpers.isLogged, (req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var artIdTmp=req.params.artId;
        
      
        artworkModel.artistArtsShippingFree((err,art) => {
                    if(err){
                     console.log(JSON.stringify(err));
                    }else{

                   var  idBuyerTmp=null;
                   console.log("datos de arte:"+JSON.stringify(art));

                   if(art[0].type_sale_art=="direct"){
                     idBuyerTmp=art[0].id_buyer_sale;
                   }else{
                    idBuyerTmp=art[0].id_buyer_auction;
                   }
                   
                   buyerModel.getBuyerForId((err,buyerData) => {
                      
                    if(err){
console.log(JSON.stringify(err));

                    }else{
                   
                            res.render('artist/artist-arts-shipping-free',{
                                alert_success: req.flash('alert_success'),
                                alert_info: req.flash('alert_info'),
                                alert_warning: req.flash('alert_warning'),
                                alert_danger: req.flash('alert_danger'),
                                art:art[0],
                                buyerData: JSON.parse(buyerData[0].address_bu),
                                idBuyerTmp:idBuyerTmp
                            });
                        }
                        },idBuyerTmp);

                    }
                },cod_artist,artIdTmp);
    });

    app.post('/set_artist_arts_shipping/:artId',helpers.isLogged, (req, res) => {      
        var artIdTmp=req.params.artId;
        var codeRast=req.body.cod_rast_au;
        var urlParcel=req.body.parcel_au;

        var type_sale_art=req.body.type_sale_art;
        var id_sale_auction=req.body.id_sale_auction;

        

        var idBuyerTmp=req.body.idBuyerTmp;
        var title_art=req.body.title_art;
        var measurements=req.body.measurements;
        var cod_artist=req.session.user.cod_ar;

        var myErrors=[];
        myErrors.push({field: codeRast, msg:'El  código de rastreo no puede estar vacio', validatorType: 'noEmpty', params:null });
        myErrors.push({field: urlParcel, msg:'La URL de seguimiento no puede estar vacia', validatorType: 'noEmpty', params:null });

        myErrors = helpers.validators(myErrors);

        if(myErrors.length>0){
            myErrors=helpers.serializeValidators(myErrors);
            req.flash('alert_danger', myErrors);
            res.redirect('/artist-arts-shipping-free/'+artIdTmp);
        }else{

    ///
 

   artworkModel.updateArtSaleDirectStatusSend((err,data) => {
       if(err){
           console.log(err);
           req.flash('alert_danger', 'ocurrio un error');
           res.redirect('/artist-arts-shipping-free-list');
       }else{

////////////////////////////
////////////////////////
  //buyer vars for notification
  var  cod_type_user_no_buyer=cod_artist;
  var  title_no_buyer='La obra: '+title_art+" - "+measurements;
  var  description_no_buyer="ha sido enviada por el creador y se encuentra en ruta, no olvides marcar como recibida una vez que llegue";
  var  type_no_buyer='setSendBuyer';
  var  url_no_buyer='buyers-on-route';
  var  code_insert_buyer=idBuyerTmp;
  
  //artist vars for notification
  var  cod_type_user_no_artist=idBuyerTmp;
  var  title_no_artist='has enviado la obra: '+title_art+" - "+measurements;
  var  description_no_artist="Una vez que la obra llegue al comprador, deberá de marcarla como recibida y te será notificado";
  var  type_no_artist='setSendBuyer';
  var  url_no_artist='artist-arts-in-test-by-buyer';
  var  code_insert_artist=cod_artist;
  helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
  helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);

        if(type_sale_art=='direct'){
            saleModel.updateSaleShipping((err,buyerData) => {
                if(err){
                    console.log(JSON.stringify(err));
                    req.flash('alert_danger', 'ocurrio un error');
                    res.redirect('/artist-arts-shipping-free-list');
                 }else{
                    req.flash('alert_success', 'Obra enviada correctamente');
                    res.redirect('/artist-arts-shipping-free-list');
                }
            },codeRast,urlParcel, id_sale_auction);
          }else{
            auctionModel.updateAuctionShipping((err,buyerData) => {
                if(err){
                    console.log(JSON.stringify(err));
                    req.flash('alert_danger', 'ocurrio un error');
                    res.redirect('/artist-arts-shipping-free-list');
                 }else{
                    req.flash('alert_success', 'Obra enviada correctamente');
                    res.redirect('/artist-arts-shipping-free-list');
                }
            },codeRast,urlParcel, id_sale_auction);
          }

    
       }

   },artIdTmp);
   
        }

    });
    
};