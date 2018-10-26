const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
const  artistModel = require('../models/artistModel');
const  ratingModel = require('../models/ratingModel');
const  configTime = require('../../config/config-time');

module.exports = (app, passport) => {

    app.get('/buyers-in-test',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers-in-test',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });
    

    app.post('/getBuyerArtsInTestList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;
        var minutesToFinishStatusTest=configTime.timeForTestArts;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        artworkModel.getBuyerArtsInTestList((err,data) => {
            if(err){
                console.log(err);
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                artworkModel.getBuyerArtsInTestListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_artist);
            }
        },cod_artist, newLimit,cantToShow, minutesToFinishStatusTest);
    });


    
    app.post('/getDataArtistRating',helpers.isLogged,(req, res) => {
        var cod_artist=req.body.cod_artist;

        artistModel.getAllDataArtistForId((err,artist) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
    
                res.send({artist:artist[0]});
            }
        },cod_artist);
    });


    app.post('/setRatingAndStatusFinished',helpers.isLogged,(req, res) => {
        
       var  input_type_sale_art=req.body.input_type_sale_art;
       var  input_id_aucton_sale=req.body.input_id_aucton_sale ;
       var  input_cod_art=req.body.input_cod_art ;
       var  input_title_art=req.body.input_title_art ;
       var  input_measurements=req.body.input_measurements ;
       var  input_author_art=req.body.input_author_art ;
       var  input_od_bu4= req.body.input_od_bu4;
       var  input_cod_artist_rating=req.body.input_cod_artist_rating;
       var  input_rating=req.body.input_rating;

console.log("este es el id de buyer: "+input_od_bu4);
console.log("este es el id de artista: "+input_cod_artist_rating);

        artworkModel.updateArtFinishedStatus((err,data) => {
            if(err){
                console.log(err);
                req.flash('alert_danger', 'ocurrio un error');
                res.redirect('/artist-arts-shipping-free-list');
            }else{
     
     ////////////////////////////
       //buyer vars for notification
       var  cod_type_user_no_buyer=input_cod_artist_rating;
       var  title_no_buyer='Has calificado al artista y aceptado la obra: '+input_title_art+" - "+input_measurements;
       var  description_no_buyer="Ahora los fondos serán enviados al artista";
       var  type_no_buyer='setFinished';
       var  url_no_buyer='buyers-arts-bought';
       var  code_insert_buyer=input_od_bu4;
       //artist vars for notification
       var  cod_type_user_no_artist=input_od_bu4;
       var  title_no_artist='Te han calificado con '+input_rating+' estrellas y han aceptado tu obra : '+input_title_art+" - "+input_measurements;
       var  description_no_artist="Se te ha abonado el monto correspondiente a tus transferencias pendientes cualquier duda contactar con Antares";
       var  type_no_artist='artist-arts-bought';
       var  url_no_artist='artist';
       var  code_insert_artist=input_cod_artist_rating;
       helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
       helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);
     
       ratingModel.setRating((err,buyerData) => {if(err){console.log(JSON.stringify(err));}else{console.log("rating establecido correctamente");}
        }, input_cod_artist_rating, input_od_bu4, input_rating);

             if(input_type_sale_art=='direct'){
                 saleModel.updateSaleFinished((err,buyerData) => {
                     if(err){
                         console.log(JSON.stringify(err));
                         req.flash('alert_danger', 'ocurrio un error');
                         res.redirect('/buyers-in-test');
                      }else{
                         req.flash('alert_success', 'Calificación recibida correctamente');
                         res.redirect('/buyers-in-test');
                     }
                 }, input_id_aucton_sale);
               }else{
                 auctionModel.updateAuctionFinished((err,buyerData) => {
                     if(err){
                         console.log(JSON.stringify(err));
                         req.flash('alert_danger', 'ocurrio un error');
                         res.redirect('/buyers-in-test');
                      }else{
                         req.flash('alert_success', 'Calificación recibida correctamente');
                         res.redirect('/buyers-in-test');
                     }
                 }, input_id_aucton_sale);
               }
            }
     
        },input_cod_art);
    });



    };