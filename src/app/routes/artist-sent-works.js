const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
module.exports = (app, passport) => {

    app.get('/artist-sent-works',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-sent-works',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });

    app.post('/getArtistArsSendList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        artworkModel.getArtistArsSendList((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                artworkModel.getArtistArsSendListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_artist);
            }
        },cod_artist, newLimit,cantToShow);
    });

    ///////////////

    app.post('/updateSendDataToBuyer',helpers.isLogged, (req, res) => {
        var type_sale_art=req.body.type_sale_art;
        var id_sale_auction=req.body.id_sale_auction;
        var codeRast=req.body.rast_parcel;
        var urlParcel=req.body.url_parcel;
        var idArtistTmp=req.session.user.cod_ar;
        var cod_buyer=req.body.cod_buyer;
        var title_art=req.body.title_art;
        var measurements=req.body.measurements;
        console.log("este es el codigo de rastreo: "+codeRast);
        console.log("este es el codigo sale auction: "+id_sale_auction);

        var myErrors=[];
        myErrors.push({field: codeRast, msg:'El  código de rastreo no puede estar vacio', validatorType: 'noEmpty', params:null });
        myErrors.push({field: urlParcel, msg:'La URL de seguimiento no puede estar vacia', validatorType: 'noEmpty', params:null });

        myErrors = helpers.validators(myErrors);

        if(myErrors.length>0){
            myErrors=helpers.serializeValidators(myErrors);
            req.flash('alert_danger', myErrors);
            res.redirect('/artist-sent-works');
        }else{
////////////////////////////
////////////////////////
  //artist vars for notification
  var  cod_type_user_no_artist=idArtistTmp;
  var  title_no_artist='Datos de envío actualizados en: '+title_art+" - "+measurements;
  var  description_no_artist="Los datos de envío de una  obra  han sido actualizados por el creador";
  var  type_no_artist='buyer';
  var  url_no_artist='buyers-on-route';
  var  code_insert_artist=cod_buyer;
  helpers.sendNotificationBuyer( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);

        if(type_sale_art=='direct'){
            saleModel.updateSendDataSaleToBuyer((err,buyerData) => {
                if(err){
                    console.log(JSON.stringify(err));
                    req.flash('alert_danger', 'ocurrio un error');
                    res.redirect('/artist-sent-works');
                 }else{
                    req.flash('alert_success', 'Datos de envío actualizados correctamente');
                    res.redirect('/artist-sent-works');
                }
            },codeRast,urlParcel, id_sale_auction);
          }else{
            auctionModel.updateSendDataAuctionToBuyer((err,buyerData) => {
                if(err){
                    console.log(JSON.stringify(err));
                    req.flash('alert_danger', 'ocurrio un error');
                    res.redirect('/artist-sent-works');
                 }else{
                    req.flash('alert_success', 'Datos de envío actualizados correctamente');
                    res.redirect('/artist-sent-works');
                }
            },codeRast,urlParcel, id_sale_auction);
          }

        }
    });
    
};