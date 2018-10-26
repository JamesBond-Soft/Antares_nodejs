const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');

module.exports = (app, passport) => {

    app.get('/buyers-on-route',helpers.isLogged, (req, res) => {
        
     res.render('buyers/buyers-on-route',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
        
    });

    app.post('/getBuyerArtsOnRouteList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        artworkModel.getBuyerArtsOnRouteList((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                artworkModel.getBuyerArtsOnRouteListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_artist);
            }
        },cod_artist, newLimit,cantToShow);
    });

    app.get('/setStatusReceived/:artId/:id_sale_or_auction/:type_sale/:id_artist',helpers.isLogged,(req, res) => {

     

        var cod_buyer=req.session.user.cod_ar;
        var artId=req.params.artId;
        var id_sale_or_auction=req.params.id_sale_or_auction;
        var type_sale_art=req.params.type_sale;
        var id_artist=req.params.id_artist;

        /////////////////////
        artworkModel.updateArtReceivedStatus((err,data) => {
            if(err){
                console.log(err);
                req.flash('alert_danger', 'ocurrio un error');
                res.redirect('/buyers-on-route');
            }else{
     
     ////////////////////////////
     ///////////////////////////
     artworkModel.getArtworkForId((err,artData) => {
       //buyer vars for notification
       var  cod_type_user_no_buyer=id_artist;
      var  title_no_buyer='La obra: '+artData[0].title_art+" - "+artData[0].measurements+" ha entrado en proceso de prueba";
       var  description_no_buyer="Ahora puede probar la obra por tres días si no está satisfecho puede ser devuelta al artista";
      var  type_no_buyer='setSendBuyer';
       var  url_no_buyer='buyers-in-test';
       var  code_insert_buyer=cod_buyer;
       
       //artist vars for notification
       var  cod_type_user_no_artist=cod_buyer;
       var  title_no_artist='El comprador ha marcado tu obra  : '+artData[0].title_art+" - "+artData[0].measurements+" como recibida";
       var  description_no_artist="La obra ha entrado en proceso de prueba por parte del comprador";
       var  type_no_artist='setSendBuyer';
       var  url_no_artist='artist-arts-in-test-by-buyer';
       var  code_insert_artist=id_artist;

       helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
       helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);
    },artId);


             if(type_sale_art=='direct'){
                 saleModel.updateSaleReceived((err,buyerData) => {
                     if(err){
                         console.log(JSON.stringify(err));
                         req.flash('alert_danger', 'ocurrio un error');
                         res.redirect('/buyers-on-route');
                      }else{
                         req.flash('alert_success', 'Obra recibida correctamente');
                         res.redirect('/buyers-on-route');
                     }
                 }, id_sale_or_auction);
               }else{
                 auctionModel.updateAuctionReceived((err,buyerData) => {
                     if(err){
                         console.log(JSON.stringify(err));
                         req.flash('alert_danger', 'ocurrio un error');
                         res.redirect('/buyers-on-route');
                      }else{
                         req.flash('alert_success', 'Obra recibida correctamente');
                         res.redirect('/buyers-on-route');
                     }
                 },id_sale_or_auction);
               }
     
         
            }
     
        },artId);
        
     



    });

    
    
    };