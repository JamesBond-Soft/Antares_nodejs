const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
const  artistModel = require('../models/artistModel');
const  ratingModel = require('../models/ratingModel');
const  configTime = require('../../config/config-time');
module.exports = (app, passport) => {

    app.get('/artist-arts-in-test-by-buyer', helpers.isLogged,(req, res) => {
        
        res.render('artist/artist-arts-in-test-by-buyer',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });

    app.post('/getArtistArtsInTestBuyerList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;
        var minutesToFinishStatusTest=configTime.timeForTestArts;
        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        artworkModel.getArtistArtsInTestBuyerList((err,data) => {
            if(err){
                console.log(err);
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                artworkModel.getArtistArtsInTestBuyerListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                        console.log(err);
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_artist);
            }
        },cod_artist, newLimit,cantToShow, minutesToFinishStatusTest);
    });
    
};