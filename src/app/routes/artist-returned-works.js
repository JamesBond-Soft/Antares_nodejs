const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');

module.exports = (app, passport) => {

    app.get('/artist-returned-works',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-returned-works',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });

    app.post('/getArtistArtsReturnedList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        artworkModel.getArtistArtsReturnedList((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                artworkModel.getArtistArtsReturnedListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_artist);
            }
        },cod_artist, newLimit,cantToShow);
    });


    ////////////
    app.get('/setStatusReceivedReturned/:artId/:id_sale_or_auction/:type_sale/:cod_bu4',helpers.isLogged,(req, res) => {

     

        var id_artist=req.session.user.cod_ar;
        var artId=req.params.artId;
        var id_sale_or_auction=req.params.id_sale_or_auction;
        var type_sale_art=req.params.type_sale;
        var cod_buyer=req.params.cod_bu4;

        /////////////////////
   artworkModel.updateArtReceivedReturnedStatus((err,data) => {
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
      var  title_no_buyer='La obra: '+artData[0].title_art+" - "+artData[0].measurements+" ha sido recibida por el creador";
       var  description_no_buyer="Ahora le será regresado el monto correspondiente a su cuenta registrada esto puede tardar cierto periodo";
      var  type_no_buyer='setSendBuyer';
       var  url_no_buyer='buyers';
       var  code_insert_buyer=cod_buyer;
       
       //artist vars for notification
       var  cod_type_user_no_artist=cod_buyer;
       var  title_no_artist='Has recibido la obra regresada: '+artData[0].title_art+" - "+artData[0].measurements+" ";
       var  description_no_artist="Tu obra ha sido regresada ahora será regresado el monto correspondiente al comprador, No te preocupes ahora puedes mejorarla y volver a subirla a subasta o venta";
       var  type_no_artist='setSendBuyer';
       var  url_no_artist='artist';
       var  code_insert_artist=id_artist;

       helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
       helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);
    },artId);


             if(type_sale_art=='direct'){
                 saleModel.updateSaleReceivedReturned((err,buyerData) => {
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
                 auctionModel.updateAuctionReceivedReturned((err,buyerData) => {
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