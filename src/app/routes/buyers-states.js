const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
module.exports = (app, passport) => {

    app.get('/buyers-states',helpers.isLogged, (req, res) => {
        
        res.render('buyers/buyers-states',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });

    app.post('/getBuyerStatesList',helpers.isLogged,(req, res) => {
        var cod_buyer=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        artworkModel.getBuyerStatesList((err,data) => {
            if(err){
                console.log(err);
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                artworkModel.getBuyerStatesListCount((err,numberData) => {
                    if(err){
                        res.send(JSON.stringify({status:false, msg: err})); 
                        console.log(err);
                    }else{
        
                        res.send({data:data,count:numberData.length} );
                    }
                },cod_buyer);
            }
        },cod_buyer, newLimit,cantToShow);
    });


    
};