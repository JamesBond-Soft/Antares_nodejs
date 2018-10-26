const helpers = require('../helpers/helpers');

const  adminModel = require('../models/adminModel');

module.exports = (app, passport) => {

    app.get('/admin-administrator', (req, res) => {
      
    adminModel.getArtists((err,data) => {
        res.render('admin/admin-administrator',{
            data: ''
        
        });
       },1);
    });
    
};