
connection = require('../../config/database');

let likeModel = {};
 
           
likeModel.unlikeArt = (callback,idBuyer,idArt) => {
    if(connection){


        connection.query(`DELETE FROM likee WHERE likee.cod_bu2=? AND likee.cod_art2=?`,[idBuyer,idArt] ,(err, data) =>{
            if(err){

               
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });
    }};


    likeModel.likeArt = (callback,idBuyer,idArt) => {
        if(connection){


            connection.query(`INSERT INTO likee(likee.cod_bu2,likee.cod_art2) VALUES(? , ?)`,[idBuyer,idArt] ,(err, data) =>{
                if(err){

                   
                    callback(err,null);
                
                   }else{
                    callback(null, data);
                   }
        
            });
        }};


        likeModel.setNotificationLike = (callback,cod_buyer_lino,cod_art_lino,cod_artist_lino) => {
            if(connection){

                connection.query(`INSERT INTO 
                likee_notification(likee_notification.cod_buyer_lino,likee_notification.cod_art_lino,likee_notification.cod_artist_lino) 
                VALUES(? , ?, ?)`,[cod_buyer_lino,cod_art_lino,cod_artist_lino] ,(err, data) =>{
                    if(err){                   
                        callback(err,null);

                       }else{
                        callback(null, data);
                       }
            
                });
       }};

module.exports = likeModel;