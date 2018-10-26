const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
const  artistModel = require('../models/artistModel');
const  ratingModel = require('../models/ratingModel');
const  configTime = require('../../config/config-time');
module.exports = (app, passport) => {

    app.get('/buyers-art-return/:id_auction_sale',helpers.isLogged, (req, res) => {
    
        var id_auction_sale=req.params.id_auction_sale;
        var minutesToFinishStatusTest=configTime.timeForTestArts;
    //console.log("este es mi id buyer: "+JSON.stringify(req.session.user));
        

        artworkModel.getBuyerArtInTestForReturn((err,dataArwork) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{

                artistModel.getAllDataArtistForId((err,dataArtist) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                    }else{
             

                        res.render('buyers/buyers-art-return',{
                            alert_success: req.flash('alert_success'),
                            alert_info: req.flash('alert_info'),
                            alert_warning: req.flash('alert_warning'),
                            alert_danger: req.flash('alert_danger'),
                            art:dataArwork[0],
                            artistData:JSON.parse(dataArtist[0].address_ar),
                            id_auction_sale:id_auction_sale
                        });
                    }
                },dataArwork[0].cod_ar2);

            }
        },id_auction_sale, minutesToFinishStatusTest);
    });

    app.post('/setArtReturnAndStatusReturn/:id_auction_sale',helpers.isLogged, (req, res) => {
        var id_auction_sale=req.params.id_auction_sale;
        var codeRast=req.body.cod_rast_au;
        var urlParcel=req.body.parcel_au;

        var type_sale_art=req.body.type_sale_art;
        var id_sale_auction=req.body.id_sale_auction;


        var cod_artist=req.body.idArtistTmp;
        var title_art=req.body.title_art;
        var measurements=req.body.measurements;
        var idBuyerTmp=req.session.user.cod_ar;
        var idArt=req.body.idArt;

        var myErrors=[];
        myErrors.push({field: codeRast, msg:'El  código de rastreo no puede estar vacio', validatorType: 'noEmpty', params:null });
        myErrors.push({field: urlParcel, msg:'La URL de seguimiento no puede estar vacia', validatorType: 'noEmpty', params:null });

        myErrors = helpers.validators(myErrors);

        if(myErrors.length>0){
            myErrors=helpers.serializeValidators(myErrors);
            req.flash('alert_danger', myErrors);
            res.redirect('/buyers-art-return/'+id_auction_sale);
        }else{

    ///
 artworkModel.updateArtStatusReturn((err,data) => {
       if(err){
           console.log(err);
           req.flash('alert_danger', 'ocurrio un error');
           res.redirect('/buyers-in-test');
       }else{

////////////////////////////
////////////////////////
  //buyer vars for notification
  var  cod_type_user_no_buyer=cod_artist;
  var  title_no_buyer='La obra: '+title_art+" - "+measurements;
  var  description_no_buyer="Ha sido regresada al creador una vez que llega al artista le será regresado el monto correspondiente";
  var  type_no_buyer='setSendBuyer';
  var  url_no_buyer='buyers-art-return-list';
  var  code_insert_buyer=idBuyerTmp;
  
  //artist vars for notification
  var  cod_type_user_no_artist=idBuyerTmp;
  var  title_no_artist='Tu obra: '+title_art+" - "+measurements;
  var  description_no_artist="Ha sido rechazada no olvides marcar como recibida una ves que la recibas";
  var  type_no_artist='setSendBuyer';
  var  url_no_artist='artist-returned-works';
  var  code_insert_artist=cod_artist;
  helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
  helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);

        if(type_sale_art=='direct'){
            saleModel.updateSaleReturn((err,buyerData) => {
                if(err){
                    console.log(JSON.stringify(err));
                    req.flash('alert_danger', 'ocurrio un error');
                    res.redirect('/buyers-in-test');
                 }else{
                    req.flash('alert_success', 'Obra enviada correctamente');
                    res.redirect('/buyers-in-test');
                }
            },codeRast,urlParcel, id_sale_auction);
          }else{
            auctionModel.updateAuctionReturn((err,buyerData) => {
                if(err){
                    console.log(JSON.stringify(err));
                    req.flash('alert_danger', 'ocurrio un error');
                    res.redirect('/buyers-in-test');
                 }else{
                    req.flash('alert_success', 'Obra enviada correctamente');
                    res.redirect('/buyers-in-test');
                }
            },codeRast,urlParcel, id_sale_auction);
          }

    
       }

   },idArt);
   
        }

    });

    
    
    };