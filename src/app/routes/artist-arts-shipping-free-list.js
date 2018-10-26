const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');

module.exports = (app, passport) => {

    app.get('/artist-arts-shipping-free-list',helpers.isLogged, (req, res) => {
        
        res.render('artist/artist-arts-shipping-free-list',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
        });
    });

    app.post('/getArtistArtsShippingFreeList',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
        var limit=req.body.limit;
        var cantToShow=req.body.cantToShow;

        var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

        artworkModel.getArtistArtsShippingFreeList((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                artworkModel.getArtistArtsShippingFreeListCount((err,numberData) => {
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