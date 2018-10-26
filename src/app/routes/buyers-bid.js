const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
const  artistModel = require('../models/artistModel');
const  ratingModel = require('../models/ratingModel');
module.exports = (app, passport) => {

    app.get('/buyers-bid/:art',helpers.isLogged,helpers.validateStatusArtForCheck, (req, res) => {
        
        var cod_art=req.params.art;
        
        artworkModel.getArtForBid((err,dataArt) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
     

                res.render('buyers/buyers-bid',{
                    alert_success: req.flash('alert_success'),
                    alert_info: req.flash('alert_info'),
                    alert_warning: req.flash('alert_warning'),
                    alert_danger: req.flash('alert_danger'),
                    art:dataArt[0]
                });
            }
        },cod_art);
    });


    app.post('/setAuctionBuyerBid',helpers.isLogged,helpers.validateDateBid,helpers.validateAmountBid,helpers.validateStatusBid , (req, res) => {
        
        var amount_au=req.body.amount_au;
        var cod_ar=req.body.cod_ar;
        var cod_art=req.body.cod_art;

        var title_art=req.body.title_art;
        var measurements=req.body.measurements;

        var cod_buyer=req.session.user.cod_ar;
        var nameBuyer=req.session.user.name_ar;
      
        artworkModel.updateArtStatusPending((err,data) => {
            if(err){
                console.log(err);
                req.flash('alert_danger', 'ocurrio un error');
                res.redirect('/buyers-bid/'+cod_art);
            }else{
                //////////////////////////////////////////////////////

  //artist vars for notification
  var  cod_type_user_no_artist=cod_buyer;
  var  title_no_artist='Nueva oferta para tu  obra: '+title_art+" - "+measurements;
  var  description_no_artist="Nueva oferta de subasta hecha por " +nameBuyer+" para tu obra: "+title_art+" - "+measurements+" por el monto de: "+helpers.setFormatMoneyMxn(amount_au);
  var  type_no_artist='setSendBuyer';
  var  url_no_artist='artist';
  var  code_insert_artist=cod_ar;

  //buyer vars for notification
  var  cod_type_user_no_buyer=cod_buyer;
  var  title_no_buyer='Nueva oferta de subasta para: '+title_art+" - "+measurements;
  var  description_no_buyer="Nueva oferta de subasta hecha por " +nameBuyer+" para la obra: "+title_art+" - "+measurements+" por el monto de: "+helpers.setFormatMoneyMxn(amount_au);
  var  type_no_buyer='newAuctionBid';
  var  url_no_buyer='buyers-auction-offers';


  helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);
                /////////////////////////////////////////////////////

auctionModel.getIdsBuyersByAuction((err,buyerIds) => {
    if(err){
        console.log(JSON.stringify(err));
     }else{
        for(var i=0; i<buyerIds.length; i++){
            var  code_insert_buyer=buyerIds[i].cod_bu3;
            helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
        }
    }
}, cod_buyer, cod_art);

                auctionModel.setAuctionBuyerBid((err,buyerData) => {
                    if(err){
                        console.log(JSON.stringify(err));
                        req.flash('alert_danger', 'ocurrio un error');
                        res.redirect('/buyers-bid/'+cod_art);
                     }else{
                        req.flash('alert_success', 'Se ha enviado la oferta correctamente');
                        res.redirect('/buyers-bid/'+cod_art);
                    }
                }, amount_au, cod_buyer, cod_art, cod_ar, 'pending' );
            }
        }, cod_art );
        


    });

    
    
};