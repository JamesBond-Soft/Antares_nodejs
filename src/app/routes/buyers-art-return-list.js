const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
module.exports = (app, passport) => {

    app.get('/buyers-art-return-list',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers-art-return-list',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });

    app.post('/getBuyerArsReturnedList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        artworkModel.getBuyerArsReturnedList((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                artworkModel.getBuyerArsReturnedListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_artist);
            }
        },cod_artist, newLimit,cantToShow);
    });

    app.post('/updateReturnedData',helpers.isLogged, (req, res) => {
        var type_sale_art=req.body.type_sale_art;
        var id_sale_auction=req.body.id_sale_auction;
        var codeRast=req.body.rast_parcel;
        var urlParcel=req.body.url_parcel;
        var idBuyerTmp=req.session.user.cod_ar;
        var cod_ar2=req.body.cod_ar2;
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
            res.redirect('/buyers-art-return-list');
        }else{
////////////////////////////
////////////////////////
  //artist vars for notification
  var  cod_type_user_no_artist=idBuyerTmp;
  var  title_no_artist='Datos de envío actualizados en: '+title_art+" - "+measurements;
  var  description_no_artist="Los datos de envío de una de tus obras regresadas han sido actualizados por el comprador";
  var  type_no_artist='artist';
  var  url_no_artist='artist';
  var  code_insert_artist=cod_ar2;
  helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);

        if(type_sale_art=='direct'){
            saleModel.updateSaleReturnData((err,buyerData) => {
                if(err){
                    console.log(JSON.stringify(err));
                    req.flash('alert_danger', 'ocurrio un error');
                    res.redirect('/buyers-art-return-list');
                 }else{
                    req.flash('alert_success', 'Datos de envío actualizados correctamente');
                    res.redirect('/buyers-art-return-list');
                }
            },codeRast,urlParcel, id_sale_auction);
          }else{
            auctionModel.updateAuctionReturnData((err,buyerData) => {
                if(err){
                    console.log(JSON.stringify(err));
                    req.flash('alert_danger', 'ocurrio un error');
                    res.redirect('/buyers-art-return-list');
                 }else{
                    req.flash('alert_success', 'Datos de envío actualizados correctamente');
                    res.redirect('/buyers-art-return-list');
                }
            },codeRast,urlParcel, id_sale_auction);
          }

        }
    });
    
};