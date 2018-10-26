const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
const  artistModel = require('../models/artistModel');
const  ratingModel = require('../models/ratingModel');

module.exports = (app, passport) => {

    app.get('/artist-pending-auctions',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-pending-auctions',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });
    
    app.post('/getArtistPendingPaidAuctionsList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        auctionModel.getArtistPendingPaidAuctionsList((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                auctionModel.getArtistPendingPaidAuctionsListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_artist);
            }
        },cod_artist, newLimit,cantToShow);
    });

    app.get('/sendPayRememberToBuyer/:idArt/:idBuyer',helpers.isLogged,(req, res) => {
        var idArt=req.params.idArt;
        var idBuyer=req.params.idBuyer;

        artworkModel.getArtworkForId((err,dataArt) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
             //buyer vars for notification
       var  cod_type_user_no_buyer=dataArt[0].cod_ar2;
       var  title_no_buyer='Recordatorio de pago en oferta de subasta';
        var  description_no_buyer='Le recordamos pagar la oferta de subasta de: '+dataArt[0].title_art+" - "+dataArt[0].measurements;
       var  type_no_buyer='setSendBuyer';
        var  url_no_buyer='buyers-paid-pending-auction';
        var  code_insert_buyer=idBuyer;
        
        helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
        req.flash('alert_success', 'Recordatorio enviado correctamente');
        res.redirect('/artist-pending-auctions');
            }
        },idArt);
    });


    


};