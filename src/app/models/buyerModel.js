
connection = require('../../config/database');

let buyerModel = {};
 


buyerModel.updateInfoPersonal=(callback, idBuyer, email, name, image)=>{
    if(connection){
        connection.query('UPDATE buyer SET name_bu= ?, email_bu=?, image_bu=? WHERE cod_bu=? ',[name, email,image, idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };


  buyerModel.updateInfoPayments=(callback, idBuyer, paypal, bank, payment_method_ar)=>{
    if(connection){
        connection.query('UPDATE buyer SET paypal_account_bu= ?, bank_account_bu=?, payment_method_bu=? WHERE cod_bu=? ',[paypal, bank,payment_method_ar, idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  buyerModel.updateInfoShipment=(callback, idArtist, dataShipment)=>{
    if(connection){
        connection.query('UPDATE buyer SET address_bu= ? WHERE cod_bu=? ',[dataShipment, idArtist] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  buyerModel.getBuyerForId=(callback, idBuyer)=>{
    if(connection){
        connection.query('SELECT buyer.address_bu FROM buyer WHERE buyer.cod_bu=? ',[idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  buyerModel.getAllDataBuyerForId=(callback, idBuyer)=>{
    if(connection){
        connection.query('SELECT * FROM buyer WHERE buyer.cod_bu=? ',[idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };



module.exports = buyerModel;