
connection = require('../../config/database');

let auctionModel = {};
 


auctionModel.updateAuctionShipping =(callback,cod_rast_sa,parcel_sa, idSale)=>{
    if(connection){
        connection.query('UPDATE auction SET auction.cod_rast_au=?, auction.parcel_au=?, auction.status_au="send-buyer" WHERE auction.cod_au=?',[cod_rast_sa,parcel_sa, idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  auctionModel.updateAuctionReceived =(callback, idSale)=>{
    if(connection){
        connection.query('UPDATE auction SET auction.status_au="received-buyer", auction.date_of_status_change_au=now()   WHERE auction.cod_au=?',[ idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };
    ///////////////////////////////////////////finished

    auctionModel.updateAuctionFinished =(callback, idSale)=>{
        if(connection){
            connection.query('UPDATE auction SET auction.status_au="finished", auction.date_of_status_change_au=now()   WHERE auction.cod_au=?',[ idSale] ,(err, data) =>{
            if(err){
               callback(err,null);
            }else{
                callback(null, true);
            }
        }
        )}
      };

  //////////////////////////////////////returned
  auctionModel.updateAuctionReturn =(callback,cod_rast_sa,parcel_sa, idSale)=>{
    if(connection){
        connection.query('UPDATE auction SET  auction.return_cod_rast_au=?, auction.return_url_parcel_au=?, auction.status_au="returned", auction.date_of_status_change_au=now()   WHERE auction.cod_au=?',[cod_rast_sa,parcel_sa, idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  ///////////////////////////////////returned artist resived
  auctionModel.updateAuctionReceivedReturned =(callback, idSale)=>{
    if(connection){
        connection.query('UPDATE auction SET  auction.status_au="received-returned-artist", auction.date_of_status_change_au=now()   WHERE auction.cod_au=?',[ idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };
/////////////////////////////////updateReturnedData
auctionModel.updateAuctionReturnData =(callback,return_cod_rast_au, return_url_parcel_au, idSale)=>{
    if(connection){
        connection.query('UPDATE auction SET  auction.return_cod_rast_au=?, auction.return_url_parcel_au=?, auction.date_of_status_change_au=now()   WHERE auction.cod_au=?',[ return_cod_rast_au, return_url_parcel_au, idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  /////////////////////////////////updateSendData
auctionModel.updateSendDataAuctionToBuyer =(callback,return_cod_rast_au, return_url_parcel_au, idSale)=>{
    if(connection){
        connection.query('UPDATE auction SET  auction.cod_rast_au=?, auction.parcel_au=?   WHERE auction.cod_au=?',[ return_cod_rast_au, return_url_parcel_au, idSale] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  auctionModel.setAuctionBuyerBid = (callback,amount_au, cod_buyer, cod_art, cod_ar, pending) => {
    if(connection){
        connection.query(`INSERT INTO auction
        (auction.amount_au, auction.offer_date_au, auction.cod_bu3, auction.cod_art3, auction.cod_ar4, auction.status_au, auction.date_of_status_change_au)
        VALUES(?, now(), ?, ?,?, ?, now())`,[amount_au, cod_buyer, cod_art, cod_ar, pending] ,(err, data) =>{
        if(err){
            callback(err,null);
        }else{
            callback(null, data);
        }
    });
    }
};

/////////////////////////////////////////////////acutions

auctionModel.getBuyerAuctionList = (callback,cod_buyer, limit, cantToShow) => {
    if(connection){

let query=`SELECT  
artwork.cod_art,

CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements,

artwork.minimum_bid_art,

artwork.cod_ar2,

artwork.author_art,
artwork.title_art,

artwork.type_sale_art,

artwork.status_step_art,

artwork.type_art,

artwork.url_art,

artwork.sale_price_art,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND auction.cod_bu3=? ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art) AS my_ultimum_offer,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art) AS offer_actuall,

IF(TIMESTAMPDIFF(SECOND,now(), artwork.expiration_date_art)<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF( artwork.expiration_date_art, now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF( artwork.expiration_date_art, now() )), 24),' hours ',
            MINUTE(TIMEDIFF(artwork.expiration_date_art, now())), ' minutes',
            SECOND(TIMEDIFF(artwork.expiration_date_art, now())), ' seconds '
        ))  AS time_to_finish,


(SELECT IF(COUNT(likee.cod_li)>0,'LIKE','NOLIKE') FROM likee WHERE likee.cod_bu2=? AND likee.cod_art2=artwork.cod_art LIMIT 1) AS iam_like,
(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) AS number_likes

FROM artwork

INNER JOIN auction on auction.cod_art3=artwork.cod_art

WHERE  auction.cod_bu3=? AND auction.status_au='pending' AND TIMESTAMPDIFF(SECOND,now(), artwork.expiration_date_art)>0

GROUP by artwork.cod_art

ORDER BY number_likes DESC LIMIT `+limit+` , `+cantToShow+``;

connection.query(query,[cod_buyer,cod_buyer,cod_buyer] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


auctionModel.getBuyerAuctionListCount = (callback,cod_buyer) => {
if(connection){

let query=`SELECT  
artwork.cod_art
FROM artwork

INNER JOIN auction on auction.cod_art3=artwork.cod_art

WHERE  auction.cod_bu3=? AND auction.status_au='pending' AND TIMESTAMPDIFF(SECOND,now(), artwork.expiration_date_art)>0

GROUP by artwork.cod_art`;

connection.query(query,[cod_buyer] ,(err, data) =>{
if(err){
    callback(err,null);

   }else{
    callback(null, data);
   }

});

}};
  
////////////////////
auctionModel.getIdsBuyersByAuction = (callback,cod_buyer, cod_art) => {
    if(connection){
    
    let query=`SELECT DISTINCT(auction.cod_bu3) FROM auction WHERE auction.cod_art3=? AND auction.cod_bu3!=?`;
    
    connection.query(query,[cod_art, cod_buyer] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
    
    }};

//////////////////////////update status pending paid auction
    auctionModel.updateArtStatusPendingPaidAuction =(callback,idAuction)=>{
        if(connection){
            connection.query('UPDATE auction SET  auction.status_au="pending-paid-auction", auction.date_of_status_change_au=now() WHERE auction.cod_au=?',[ idAuction] ,(err, data) =>{
            if(err){
               callback(err,null);
            }else{
                callback(null, true);
            }
        }
        )}
      };

      auctionModel.updateArtStatusLoseAuction =(callback,idAuction)=>{
        if(connection){
            connection.query('UPDATE auction SET  auction.status_au="lose", auction.date_of_status_change_au=now() WHERE auction.cod_au=?',[ idAuction] ,(err, data) =>{
            if(err){
               callback(err,null);
            }else{
                callback(null, true);
            }
        }
        )}
      };

      //////////////////////////update status pending paid auction


/////////////////////////////////////////////////acutions pending paid list

auctionModel.getBuyerAuctionPendingPaidList = (callback,cod_buyer, limit, cantToShow) => {
    if(connection){

let query=`SELECT  


artwork.cod_art,

CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements,

artwork.minimum_bid_art,

artwork.cod_ar2,

artwork.author_art,
artwork.title_art,

artwork.type_sale_art,

artwork.status_step_art,

artwork.type_art,

artwork.url_art,

artwork.sale_price_art,
auction.cod_au,
auction.cod_bu3,
auction.cod_ar4,

DATE_FORMAT(auction.date_of_status_change_au,'%Y-%m-%d %H:%i:%s') as date_of_status_change_au ,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND auction.cod_bu3=? ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art) AS my_ultimum_offer,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art) AS offer_actuall,

IF(TIMESTAMPDIFF(SECOND,now(), artwork.expiration_date_art)<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF( artwork.expiration_date_art, now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF( artwork.expiration_date_art, now() )), 24),' hours ',
            MINUTE(TIMEDIFF(artwork.expiration_date_art, now())), ' minutes',
            SECOND(TIMEDIFF(artwork.expiration_date_art, now())), ' seconds '
        ))  AS time_to_finish,


(SELECT IF(COUNT(likee.cod_li)>0,'LIKE','NOLIKE') FROM likee WHERE likee.cod_bu2=? AND likee.cod_art2=artwork.cod_art LIMIT 1) AS iam_like,
(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) AS number_likes

FROM artwork

INNER JOIN auction on auction.cod_art3=artwork.cod_art

WHERE  auction.cod_bu3=? AND auction.status_au='pending-paid-auction'

GROUP by artwork.cod_art

ORDER BY artwork.cod_art DESC LIMIT `+limit+` , `+cantToShow+``;

connection.query(query,[cod_buyer,cod_buyer,cod_buyer] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


auctionModel.getBuyerAuctionPendingPaidListCount = (callback,cod_buyer) => {
if(connection){

let query=`SELECT  
artwork.cod_art
FROM artwork

INNER JOIN auction on auction.cod_art3=artwork.cod_art

WHERE  auction.cod_bu3=?  AND auction.status_au='pending-paid-auction'

GROUP by artwork.cod_art`;

connection.query(query,[cod_buyer] ,(err, data) =>{
if(err){
    callback(err,null);

   }else{
    callback(null, data);
   }

});

}};

///////////////////////////////get auction for id
auctionModel.getAuctionForId = (callback,codAuction) => {
    if(connection){
    
    let query=`
    SELECT  
    *, CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements
    FROM artwork
    
    INNER JOIN auction on auction.cod_art3=artwork.cod_art
    
    WHERE  auction.cod_au=?`;
    
    connection.query(query,[codAuction] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};

//////////////////////////////update paid auction
auctionModel.updateArtStatusPaidAuction =(callback,idAuction)=>{
    if(connection){
        connection.query('UPDATE auction SET  auction.status_au="paid", auction.date_of_status_change_au=now() WHERE auction.cod_au=?',[ idAuction] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

  //////////////////////////////update pending-review auction
auctionModel.updateArtStatusPendingReviewAuction =(callback,idAuction)=>{
    if(connection){
        connection.query('UPDATE auction SET  auction.status_au="pending-review" WHERE auction.cod_au=?',[ idAuction] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, true);
        }
    }
    )}
  };

////////////////////////////////////////////////////////////////////////////getArtistPendingPaidAuctionsList

  auctionModel.getArtistPendingPaidAuctionsList = (callback,cod_buyer, limit, cantToShow) => {
    if(connection){

let query=`SELECT  
artwork.cod_art,

CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements,

artwork.minimum_bid_art,

artwork.cod_ar2,

artwork.author_art,
artwork.title_art,

artwork.type_sale_art,

artwork.status_step_art,

artwork.type_art,

artwork.url_art,

artwork.sale_price_art,
auction.cod_au,
auction.cod_bu3,
auction.cod_ar4,


IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art) AS offer_actuall,


(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) AS number_likes

FROM artwork

INNER JOIN auction on auction.cod_art3=artwork.cod_art

WHERE  auction.cod_ar4=? AND auction.status_au='pending-paid-auction'

GROUP by artwork.cod_art

ORDER BY number_likes DESC LIMIT `+limit+` , `+cantToShow+``;

connection.query(query,[cod_buyer,cod_buyer,cod_buyer] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


auctionModel.getArtistPendingPaidAuctionsListCount = (callback,cod_buyer) => {
if(connection){

let query=`SELECT  
artwork.cod_art
FROM artwork

INNER JOIN auction on auction.cod_art3=artwork.cod_art

WHERE  auction.cod_ar4=? AND auction.status_au='pending-paid-auction'

GROUP by artwork.cod_art`;

connection.query(query,[cod_buyer] ,(err, data) =>{
if(err){
    callback(err,null);

   }else{
    callback(null, data);
   }

});

}};
module.exports = auctionModel;