const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
const  artistModel = require('../models/artistModel');
const  ratingModel = require('../models/ratingModel');
module.exports = (app, passport) => {

    app.get('/buyers-on-route-only',helpers.isLogged, (req, res) => {
        
     res.render('buyers/buyers-on-route-only',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });

    app.post('/goBuyerTypeStatesOnRoute',helpers.isLogged,(req, res) => {
        var cod_buyer=req.session.user.cod_ar;
  
        var type_sale_art=req.body.type_sale_art;
        var id_saleAuction=null;

        console.log("este es el tipo de sale art");
        console.log(type_sale_art);

        if(type_sale_art=="direct"){
            id_saleAuction=req.body.id_sale;
        }else{
            id_saleAuction=req.body.id_auction;
        }

        console.log("este es el id"+id_saleAuction);

        artworkModel.goBuyerTypeStatesOnRoute((err,data) => {
            if(err){
                console.log(err);
                res.send(JSON.stringify({status:false, msg: err})); 
               
            }else{
                console.log(JSON.stringify(data[0]));
                console.log("ëste es el typo de sale desde bd: "+data[0].cod_ar2);
                res.render('buyers/buyers-on-route-only',{
                    alert_success: req.flash('alert_success'),
                    alert_info: req.flash('alert_info'),
                    alert_warning: req.flash('alert_warning'),
                    alert_danger: req.flash('alert_danger'),
                    data:data[0]
                });
            }
        },id_saleAuction, type_sale_art);

    });


    
    
    };