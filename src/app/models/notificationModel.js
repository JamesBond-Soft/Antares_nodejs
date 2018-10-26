
connection = require('../../config/database');

let notificationModel = {};
 
notificationModel.setNotification = (callback,type_user_no, cod_type_user_no, description_no, title_no, img_no, type_no, url_no) => {
if(connection){
    connection.query('INSERT INTO notification (notification.type_user_no, notification.cod_type_user_no, notification.description_no, notification.title_no, notification.img_no, notification.type_no, notification.url_no) VALUES(?, ?, ?, ?, ?, ? ,?)',[type_user_no, cod_type_user_no, description_no, title_no, img_no, type_no, url_no] ,(err, data) =>{
    if(err){
        callback(err,null);
    }else{
        callback(null, data);
    }
});
}
};


notificationModel.getNotificationsBuyer=(callback, idBuyer)=>{
    if(connection){
        connection.query('SELECT *,(SELECT artist.image_ar FROM artist WHERE artist.cod_ar=notification.img_no) AS img_notification FROM notification WHERE notification.type_user_no="buyer" AND notification.cod_type_user_no=? ORDER BY notification.date_no DESC LIMIT 10',[idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  notificationModel.getNotificationsBuyerCount=(callback, idBuyer)=>{
    if(connection){
        connection.query('SELECT COUNT(notification.cod_no) as number_notifi FROM notification WHERE notification.type_user_no="buyer" AND notification.cod_type_user_no=? AND notification.read="false" ORDER BY notification.date_no DESC',[idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  notificationModel.setReadNotificationBuyer=(callback, idNotify)=>{
    if(connection){
        connection.query('UPDATE notification SET notification.read="true" WHERE notification.cod_no=?',[idNotify] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  ////artist

  notificationModel.getNotificationsArtist=(callback, idBuyer)=>{
    if(connection){
        connection.query('SELECT *,(SELECT artist.image_ar FROM artist WHERE artist.cod_ar=notification.img_no) AS img_notification FROM notification WHERE notification.type_user_no="artist" AND notification.cod_type_user_no=? ORDER BY notification.date_no DESC LIMIT 10',[idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  notificationModel.getNotificationsArtistCount=(callback, idBuyer)=>{
    if(connection){
        connection.query('SELECT COUNT(notification.cod_no) as number_notifi FROM notification WHERE notification.type_user_no="artist" AND notification.cod_type_user_no=? AND notification.read="false" ORDER BY notification.date_no DESC',[idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  notificationModel.setReadNotificationArtist=(callback, idNotify)=>{
    if(connection){
        connection.query('UPDATE notification SET notification.read="true" WHERE notification.cod_no=?',[idNotify] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  //////////////////notifications likes

  notificationModel.getNotificationsBuyerLikes=(callback, idBuyer)=>{
    if(connection){
        connection.query(`SELECT *,(SELECT artist.image_ar FROM artist WHERE artist.cod_ar=likee_notification.cod_buyer_lino) AS img_notification,(SELECT buyer.name_bu FROM buyer WHERE buyer.cod_bu=likee_notification.cod_buyer_lino) AS name_buyer,(SELECT artwork.title_art FROM artwork WHERE artwork.cod_art=likee_notification.cod_art_lino) AS title_art FROM likee_notification WHERE  likee_notification.cod_artist_lino=? 
        AND IFNULL((SELECT artwork.title_art FROM artwork WHERE artwork.cod_art=likee_notification.cod_art_lino), 'NULL') != 'NULL'
         ORDER BY likee_notification.date_lino DESC LIMIT 10`,[idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  notificationModel.getNotificationsBuyerCountLikes=(callback, idBuyer)=>{
    if(connection){
        connection.query(`SELECT COUNT(likee_notification.cod_lino) as number_notifi FROM likee_notification WHERE likee_notification.cod_artist_lino=? AND likee_notification.read="false"  AND IFNULL((SELECT artwork.title_art FROM artwork WHERE artwork.cod_art=likee_notification.cod_art_lino), 'NULL') != 'NULL' `,[idBuyer] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  notificationModel.setReadNotificationBuyerLikes=(callback, idNotify)=>{
    if(connection){
        connection.query('UPDATE likee_notification SET likee_notification.read="true" WHERE likee_notification.cod_lino=?',[idNotify] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}
  };

  ///////////notification list astist

  notificationModel.getArtistNotificationList = (callback,cod_artist, limit, cantToShow) => {
    if(connection){

let query=`
SELECT *,DATE_FORMAT(notification.date_no, '%d-%m-%Y %H:%i:%s') as date_formated,(SELECT artist.image_ar FROM artist WHERE artist.cod_ar=notification.img_no) AS img_notification FROM notification WHERE notification.type_user_no="artist" AND notification.cod_type_user_no=?   ORDER BY notification.date_no DESC
LIMIT `+limit+` , `+cantToShow+`
`;

connection.query(query,[cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


notificationModel.getArtistNotificationListCount = (callback,cod_artist, limit) => {
if(connection){

let query=`SELECT * FROM notification WHERE notification.type_user_no="artist" AND notification.cod_type_user_no=?   `;

connection.query(query,[cod_artist] ,(err, data) =>{
if(err){
    callback(err,null);

   }else{
    callback(null, data);
   }

});

}};

  ///////////notification list astist likes
  notificationModel.getArtistNotificationsLikesList = (callback,cod_artist, limit, cantToShow) => {
    if(connection){

let query=`
SELECT *,DATE_FORMAT(likee_notification.date_lino, '%d-%m-%Y %H:%i:%s') as date_formated,(SELECT artist.image_ar FROM artist WHERE artist.cod_ar=likee_notification.cod_buyer_lino) AS img_notification,(SELECT buyer.name_bu FROM buyer WHERE buyer.cod_bu=likee_notification.cod_buyer_lino) AS name_buyer,(SELECT artwork.title_art FROM artwork WHERE artwork.cod_art=likee_notification.cod_art_lino) AS title_art FROM likee_notification WHERE  likee_notification.cod_artist_lino=? AND IFNULL((SELECT artwork.title_art FROM artwork WHERE artwork.cod_art=likee_notification.cod_art_lino), 'NULL') != 'NULL' ORDER BY likee_notification.date_lino DESC
LIMIT `+limit+` , `+cantToShow+`
`;

connection.query(query,[cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


notificationModel.getArtistNotificationsLikesListCount = (callback,cod_artist, limit) => {
if(connection){

let query=`SELECT * FROM likee_notification WHERE  likee_notification.cod_artist_lino=? AND IFNULL((SELECT artwork.title_art FROM artwork WHERE artwork.cod_art=likee_notification.cod_art_lino), 'NULL') != 'NULL'`;

connection.query(query,[cod_artist] ,(err, data) =>{
if(err){
    callback(err,null);

   }else{
    callback(null, data);
   }

});

}};

 ///////////notification list buyer

 notificationModel.getBuyerNotificationList = (callback,cod_artist, limit, cantToShow) => {
    if(connection){

let query=`
SELECT *,DATE_FORMAT(notification.date_no, '%d-%m-%Y %H:%i:%s') as date_formated,(SELECT artist.image_ar FROM artist WHERE artist.cod_ar=notification.img_no) AS img_notification FROM notification WHERE notification.type_user_no="buyer" AND notification.cod_type_user_no=? ORDER BY notification.date_no DESC
LIMIT `+limit+` , `+cantToShow+`
`;

connection.query(query,[cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


notificationModel.getBuyerNotificationListCount = (callback,cod_artist, limit) => {
if(connection){

let query=`SELECT * FROM notification WHERE notification.type_user_no="buyer" AND notification.cod_type_user_no=? ORDER BY notification.date_no DESC`;

connection.query(query,[cod_artist] ,(err, data) =>{
if(err){
    callback(err,null);

   }else{
    callback(null, data);
   }

});

}};


module.exports = notificationModel;