
connection = require('../../config/database');

let saleModel = {};
 
saleModel.setSale = (callback,amount_sa, cod_bu4, cod_art4, cod_ar5) => {

if(connection){
        connection.query('INSERT INTO sale (sale.amount_sa, sale.cod_bu4, sale.cod_art4, sale.cod_ar5, sale.transfer_artist_sa) VALUES (?,?,?,?, ?)',[amount_sa, cod_bu4, cod_art4, cod_ar5,amount_sa] ,(err, data) =>{
        if(err){
           callback(err,null);
       
          }else{
            callback(null, data);
}}
 )}

};


saleModel.updateSaleShipping =(callback,cod_rast_sa,parcel_sa, idSale)=>{
  if(connection){
      connection.query('UPDATE sale SET sale.cod_rast_sa=?, sale.parcel_sa=?, sale.status_sa="send-buyer" WHERE sale.cod_sa=?',[cod_rast_sa,parcel_sa, idSale] ,(err, data) =>{
      if(err){
         callback(err,null);
      }else{
          callback(null, true);
      }
  }
  )}
};

saleModel.updateSaleReceived =(callback, idSale)=>{
    if(connection){
        connection.query('UPDATE sale SET  sale.status_sa="received-buyer", sale.date_of_status_change_sa=now() WHERE sale.cod_sa=?',[ idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  ///////////////////////////////////////////finished
  saleModel.updateSaleFinished =(callback, idSale)=>{
    if(connection){
        connection.query('UPDATE sale SET  sale.status_sa="finished", sale.date_of_status_change_sa=now() WHERE sale.cod_sa=?',[ idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  //////////////////////////////////////returned
  saleModel.updateSaleReturn =(callback, cod_rast_sa,parcel_sa, idSale)=>{
    if(connection){
        connection.query('UPDATE sale SET sale.return_cod_rast_sa=?, sale.return_url_parcel_sa=?, sale.status_sa="returned", sale.date_of_status_change_sa=now() WHERE sale.cod_sa=?',[ cod_rast_sa,parcel_sa, idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };
///////////////////////////////////returned artist resived
saleModel.updateSaleReceivedReturned =(callback, idSale)=>{
    if(connection){
        connection.query('UPDATE sale SET  sale.status_sa="received-returned-artist", sale.date_of_status_change_sa=now() WHERE sale.cod_sa=?',[  idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  /////////////////////////////////updateReturnedData
  saleModel.updateSaleReturnData =(callback, return_cod_rast_sa, return_url_parcel_sa, idSale)=>{
    if(connection){
        connection.query('UPDATE sale SET  sale.return_cod_rast_sa=?, sale.return_url_parcel_sa=?,  sale.date_of_status_change_sa=now() WHERE sale.cod_sa=?',[ return_cod_rast_sa, return_url_parcel_sa, idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

    /////////////////////////////////updateSendData
    saleModel.updateSendDataSaleToBuyer =(callback, return_cod_rast_sa, return_url_parcel_sa, idSale)=>{
        if(connection){
            connection.query('UPDATE sale SET  sale.cod_rast_sa=?, sale.parcel_sa=? WHERE sale.cod_sa=?',[ return_cod_rast_sa, return_url_parcel_sa, idSale] ,(err, data) =>{
            if(err){
               callback(err,null);
            }else{
                callback(null, true);
            }
        }
        )}
      };

//////////////////////////////update pending-review auction
saleModel.updateArtStatusPendingReviewSale =(callback, idSale)=>{
    if(connection){
        connection.query('UPDATE sale SET  sale.status_sa="pending-review" WHERE sale.cod_sa=?',[ idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };
module.exports = saleModel;