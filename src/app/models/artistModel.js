
connection = require('../../config/database');

let artistModel = {};
 


artistModel.checkIfExistFacebook = (callback,idFacebook) => {
  if(connection){
      connection.query('SELECT * FROM artist WHERE facebook_id_ar = ?',[idFacebook] ,(err, data) =>{
      if(err){
         callback(err,null);
      }else{
          callback(null, data);
      }
  }
  )}};

  artistModel.checkIfExistTwitter = (callback,idTwitter) => {
    if(connection){
        connection.query('SELECT * FROM artist WHERE twitter_id_ar = ?',[idTwitter] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}};

  artistModel.getUserFacebook = (callback,idFacebook) => {
    if(connection){
        connection.query('SELECT * FROM artist WHERE facebook_id_ar = ?',[idFacebook] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}};

    artistModel.getUserTwitter = (callback,idTwitter) => {
        if(connection){
            connection.query('SELECT * FROM artist WHERE twitter_id_ar = ?',[idTwitter] ,(err, data) =>{
            if(err){
               callback(err,null);
            }else{
                callback(null, data);
            }
        }
        )}};


  artistModel.setArtistFacebook = (callback,id, name, photo, email) => {
    if(connection){
        connection.query('INSERT INTO artist  (facebook_id_ar, name_ar, image_ar, email_ar, status_ar, selected_account_prefer_ar) VALUES(?, ?, ?, ?, ?, ?)',[id, name, photo, email,"true" ,"artist"] ,(err, data) =>{
        if(err){
           callback(err,null);
       
          }else{
            connection.query('SELECT cod_ar FROM artist WHERE facebook_id_ar = ?',[id] ,(err, data) =>{
              if(err){
                 callback(err,null);
              }else{
                connection.query('INSERT INTO buyer  (cod_bu, facebook_id_bu, name_bu, image_bu, email_bu, status_bu, selected_account_prefer_bu) VALUES(?, ?, ?, ?, ?, ?, ?)',[data[0].cod_ar,id, name, photo, email,"true" ,"artist"] ,(err, data) =>{
                  if(err){
                     callback(err,null);
                  }else{
                      callback(null, data);
                  }
              });
              }
            });
        }
    }
    )}};

    artistModel.setArtistTwitter = (callback,id, name, photo, email) => {
        if(connection){
            connection.query('INSERT INTO artist  (twitter_id_ar, name_ar, image_ar, email_ar, status_ar, selected_account_prefer_ar) VALUES(?, ?, ?, ?, ?, ?)',[id, name, photo, email,"true" ,"artist"] ,(err, data) =>{
            if(err){
               callback(err,null);
           
              }else{
                connection.query('SELECT cod_ar FROM artist WHERE twitter_id_ar = ?',[id] ,(err, data) =>{
                  if(err){
                     callback(err,null);
                  }else{
                    connection.query('INSERT INTO buyer  (cod_bu, twitter_id_bu, name_bu, image_bu, email_bu, status_bu, selected_account_prefer_bu) VALUES(?, ?, ?, ?, ?, ?, ?)',[data[0].cod_ar,id, name, photo, email,"true" ,"artist"] ,(err, data) =>{
                      if(err){
                         callback(err,null);
                      }else{
                          callback(null, data);
                      }
                  });
                  }
                });
            }
        }
        )}};


    artistModel.checkIfExistLocal = (callback,email) => {
        if(connection){
            connection.query('SELECT * FROM artist WHERE email_ar = ?',[email] ,(err, data) =>{
            if(err){
               callback(err,null);
            }else{
                callback(null, data);
            }
        }
        )}};

        artistModel.checkIfExistLocalForUpdate = (callback,email,idArtist) => {
            if(connection){
                connection.query('SELECT * FROM artist WHERE email_ar = ? AND cod_ar != ? ',[email, idArtist] ,(err, data) =>{
                if(err){
                   callback(err,null);
                }else{
                    callback(null, data);
                }
            }
            )}};

    artistModel.setArtistLocal = (callback, name, photo, email,password,typeAccountPrefer) => {
      if(connection){
          connection.query('INSERT INTO artist  (name_ar, image_ar, email_ar, password_ar, selected_account_prefer_ar, status_ar) VALUES(?, ?, ?, ?, ?, ?)',[name, photo, email, password,typeAccountPrefer,"true"] ,(err, data) =>{
          if(err){
             callback(err,null);
         
            }else{
                connection.query('SELECT cod_ar FROM artist WHERE email_ar = ?',[email] ,(err, data) =>{
                    if(err){
                       callback(err,null);
                }else{

                    connection.query('INSERT INTO buyer (cod_bu, name_bu, image_bu, email_bu, password_bu, selected_account_prefer_bu, status_bu) VALUES(?, ?, ?, ?, ?, ?, ?)',[data[0].cod_ar, name, photo, email, password,typeAccountPrefer,"true"] ,(err, data) =>{
                        if(err){
                            callback(err,null);
                         }else{
                             callback(null,data);
                         }
                        });
                    }
                  });
              }
          }
          )}};


          artistModel.loginLocal = (callback, email, password) => {
            if(connection){
                connection.query('SELECT * FROM artist WHERE email_ar = ? AND password_ar = BINARY ? ',[email, password] ,(err, data) =>{
                if(err){
                   callback(err,null);
                }else{
                    callback(null, data);
                }
            }
            )}
          };

          artistModel.getArtistLocal = (callback, email, password) => {
            if(connection){
                connection.query('SELECT * FROM artist WHERE email_ar = ? AND password_ar = BINARY ? ',[email, password] ,(err, data) =>{
                if(err){
                   callback(err,null);
                }else{
                    callback(null, data);
                }
            }
            )}
          };

          artistModel.canUpload =(callback, idArtist) => {
            if(connection){
                connection.query('SELECT * FROM artist WHERE cod_ar= ? AND payment_method_ar  IS NOT NULL AND address_ar IS NOT NULL',[idArtist] ,(err, data) =>{
                if(err){
                   callback(err,null);
                }else{
                    callback(null, data);
                }
            }
            )}

          };

          artistModel.getArtist=(callback, idArtist)=>{
            if(connection){
                connection.query('SELECT * FROM artist WHERE cod_ar= ?',[idArtist] ,(err, data) =>{
                if(err){
                   callback(err,null);
                }else{
                    callback(null, data);
                }
            }
            )}
          };


          artistModel.updateInfoPersonal=(callback, idArtist, email, name, image)=>{
            if(connection){
                connection.query('UPDATE artist SET name_ar= ?, email_ar=?, image_ar=? WHERE cod_ar=? ',[name, email,image, idArtist] ,(err, data) =>{
                if(err){
                   callback(err,null);
                }else{
                    callback(null, true);
                }
            }
            )}
          };


          artistModel.updateInfoPayments=(callback, idArtist, paypal, bank, payment_method_ar)=>{
            if(connection){
                connection.query('UPDATE artist SET paypal_account_ar= ?, bank_account_ar=?, payment_method_ar=? WHERE cod_ar=? ',[paypal, bank,payment_method_ar, idArtist] ,(err, data) =>{
                if(err){
                   callback(err,null);
                }else{
                    callback(null, true);
                }
            }
            )}
          };

          artistModel.updateInfoShipment=(callback, idArtist, dataShipment)=>{
            if(connection){
                connection.query('UPDATE artist SET address_ar= ? WHERE cod_ar=? ',[dataShipment, idArtist] ,(err, data) =>{
                if(err){
                   callback(err,null);
                }else{
                    callback(null, true);
                }
            }
            )}
          };


          artistModel.getAllDataArtistForId=(callback, artist)=>{
            if(connection){
                connection.query('SELECT * FROM artist WHERE artist.cod_ar=? ',[artist] ,(err, data) =>{
                if(err){
                   callback(err,null);
                }else{
                    callback(null, data);
                }
            }
            )}
          };

module.exports = artistModel;