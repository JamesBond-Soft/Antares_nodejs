const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  auctionModel = require('../models/auctionModel');
const  tagModel = require('../models/tagModel');
const  likeModel = require('../models/likeModel');
const  saleModel = require('../models/saleModel');
const  notificationModel = require('../models/notificationModel');

module.exports = (app, passport) => {

    app.get('/buyers-auction-offers', helpers.isLogged,(req, res) => {
        
        res.render('buyers/buyers-auction-offers',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });

    
    app.post('/getBuyerAuctionList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        auctionModel.getBuyerAuctionList((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                auctionModel.getBuyerAuctionListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_artist);
            }
        },cod_artist, newLimit,cantToShow);
    });
    
    };