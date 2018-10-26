
connection = require('../../config/database');

config_commissions = require('../../config/config-commissions');

let artworkModel = {};
 

artworkModel.setArtImage = (callback,title_art, height_art, width_art, depth_art, author_art, type_art, url_art, type_sale_art,  minimum_bid_art, sale_price_art, status_art, description_art, cod_ar2, hours_for_delete) => {
    if(connection){
        connection.query('INSERT INTO artwork  (title_art, height_art, width_art, depth_art, author_art, type_art, url_art, type_sale_art, minimum_bid_art, sale_price_art, status_art, description_art, cod_ar2, expiration_date_art) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, adddate(now(),interval ? hour))',[title_art, height_art, width_art, depth_art, author_art, type_art, url_art, type_sale_art,  minimum_bid_art, sale_price_art, status_art, description_art, cod_ar2, hours_for_delete] ,(err, data) =>{
        if(err){
           callback(err,null);
       
          }else{
            connection.query('SELECT last_insert_id()',[] ,(err, data) =>{
                if(err){
                    callback(err,null);
                
                   }else{
                    callback(null, data);
                   }
        
            });

         
          }}
    )}};

    artworkModel.setArtImageMinutes = (callback,title_art, height_art, width_art, depth_art, author_art, type_art, url_art, type_sale_art,  minimum_bid_art, sale_price_art, status_art, description_art, cod_ar2, hours_for_delete) => {
        if(connection){
            connection.query('INSERT INTO artwork  (title_art, height_art, width_art, depth_art, author_art, type_art, url_art, type_sale_art, minimum_bid_art, sale_price_art, status_art, description_art, cod_ar2, expiration_date_art) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, adddate(now(),interval ? MINUTE))',[title_art, height_art, width_art, depth_art, author_art, type_art, url_art, type_sale_art,  minimum_bid_art, sale_price_art, status_art, description_art, cod_ar2, hours_for_delete] ,(err, data) =>{
            if(err){
               callback(err,null);
           
              }else{
                connection.query('SELECT last_insert_id()',[] ,(err, data) =>{
                    if(err){
                        callback(err,null);
                    
                       }else{
                        callback(null, data);
                       }
            
                });
    
             
              }}
        )}};


    artworkModel.getArtworksArtist = (callback,idArtist,offset, limit) => {
        if(connection){
            connection.query(`
            SELECT 
            artwork.cod_art,
            artwork.title_art,
            artwork.url_art,
            GROUP_CONCAT(DISTINCT category.name_ca) AS categories_tags,
            GROUP_CONCAT(DISTINCT technique.name_te) AS techniques_tags,
            GROUP_CONCAT(DISTINCT thematic.name_th) AS thematic_tags,
            
            CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements,
            IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art) AS offer_actuall,
            
            IF(TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF( artwork.expiration_date_art, now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF( artwork.expiration_date_art, now() )), 24),' hours ',
            MINUTE(TIMEDIFF(artwork.expiration_date_art, now())), ' minutes ',
            SECOND(TIMEDIFF(artwork.expiration_date_art, now())), ' seconds '
        
        ))  AS time_to_finish,
            
            (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes,
            
            artwork.type_art,
            artwork.type_sale_art,
            artwork.minimum_bid_art,
            artwork.sale_price_art,
            artist.name_ar,
            artwork.status_step_art
            
            FROM  artwork
            INNER JOIN tag_ca on tag_ca.cod_art20=artwork.cod_art 
            INNER JOIN category on tag_ca.cod_ca20=category.cod_ca
            
            INNER JOIN tag_te on tag_te.cod_art21=artwork.cod_art
            INNER JOIN technique on technique.cod_te=tag_te.cod_te21
            
            INNER JOIN tag_th on tag_th.cod_art22=artwork.cod_art
            INNER JOIN thematic on thematic.cod_th=tag_th.cod_th22
            
            
            INNER JOIN artist on artist.cod_ar=artwork.cod_ar2
            
            WHERE artist.cod_ar=? 
            
            GROUP BY artwork.cod_art 
            ORDER by artwork.cod_art DESC
            LIMIT ? OFFSET ?`,[idArtist, limit, offset] ,(err, data) =>{
                if(err){
                    callback(err,null);
                
                   }else{
                    callback(null, data);
                   }
        
            });

        }};


        artworkModel.getArtworksBuyer = (callback,idBuyer,queryToTagsCategory, queryToTagsTechnique, queryToTagsThematic,offset, limit) => {
            if(connection){


                if(queryToTagsCategory=='()'){
                    queryToTagsCategory='';
                }else{
                    if(queryToTagsTechnique!='()' || queryToTagsThematic!='()'){
                        queryToTagsCategory+=' AND';
                    }
                    
                }

                if(queryToTagsTechnique=='()'){
                    queryToTagsTechnique='';
                }else{
                    if(queryToTagsThematic!='()'){
                        queryToTagsTechnique+=' AND';
                    }
                }

                if(queryToTagsThematic=='()'){
                    queryToTagsThematic='';
                }

                let goWhere='AND';
                let startQuery='(';
                let closeQuery=')';
                if(queryToTagsCategory=='' && queryToTagsTechnique=='' && queryToTagsThematic==''){
                  goWhere="";
                startQuery='';
                closeQuery='';
                }

let queryForPrint=`
SELECT  
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

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art) AS offer_actuall,

IF(TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF( artwork.expiration_date_art, now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF( artwork.expiration_date_art, now() )), 24),' hours ',
            MINUTE(TIMEDIFF(artwork.expiration_date_art, now())), ' minutes ',
            SECOND(TIMEDIFF(artwork.expiration_date_art, now())), ' seconds '
        
        ))  AS time_to_finish,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes,
(SELECT IF(COUNT(likee.cod_li)>0,'LIKE','NOLIKE') FROM likee WHERE likee.cod_bu2=? AND likee.cod_art2=artwork.cod_art LIMIT 1) as iam_like

FROM artwork

INNER JOIN tag_ca on tag_ca.cod_art20=artwork.cod_art
INNER JOIN tag_te on tag_te.cod_art21=artwork.cod_art
INNER JOIN tag_th on tag_th.cod_art22=artwork.cod_art


`+`WHERE`+` artwork.cod_ar2!=? AND TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)>0 AND (artwork.status_step_art="idle" OR artwork.status_step_art="pending" )   `+goWhere+` `+startQuery+``+queryToTagsCategory+` `+queryToTagsTechnique+` `+queryToTagsThematic+``+closeQuery+` 

GROUP by artwork.cod_art

ORDER BY number_likes DESC

LIMIT ? OFFSET ?`;
//console.log(queryForPrint);

                connection.query(queryForPrint,[idBuyer,idBuyer, limit, offset] ,(err, data) =>{
                    if(err){

                        console.log();
                        callback(err,null);
                    
                       }else{
                        callback(null, data);
                       }
            
                });
            }};
    

            artworkModel.getArtworkForId = (callback,idArt) => {
                if(connection){

                    connection.query("SELECT *, CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements FROM artwork INNER JOIN artist on artist.cod_ar=artwork.cod_ar2 WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
                        if(err){
                            callback(err,null);
                        
                           }else{
                            callback(null, data);
                           }
                
                    });

              }};

              artworkModel.updateArtSaleDirectStatus = (callback,idArt) => {
                if(connection){

                    connection.query("UPDATE artwork SET artwork.status_step_art='paid' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
                        if(err){
                            callback(err,null);
                        
                           }else{
                            callback(null, data);
                           }
                
                    });

              }};

              artworkModel.updateArtSaleDirectStatusSend = (callback,idArt) => {
                if(connection){

                    connection.query("UPDATE artwork SET artwork.status_step_art='send-buyer' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
                        if(err){
                            callback(err,null);
                        
                           }else{
                            callback(null, data);
                           }
                
                    });

              }};

              

              artworkModel.updateArtReceivedStatus = (callback,idArt) => {
                if(connection){

                    connection.query("UPDATE artwork SET artwork.status_step_art='received-buyer' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
                        if(err){
                            callback(err,null);
                        
                           }else{
                            callback(null, data);
                           }
                
                    });

              }};

              artworkModel.validateSaleDirectArtwork = (callback,idArt) => {
                if(connection){

                    connection.query(`SELECT * FROM artwork WHERE
                    artwork.cod_art=?
                    AND (TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)<=0 AND artwork.cod_art=?)
                    OR
                    (artwork.status_step_art!='idle' AND artwork.cod_art=?) `,[idArt,idArt,idArt] ,(err, data) =>{
                        if(err){
                            callback(err,null);
                        
                           }else{
                            callback(null, data);
                           }
                
                    });

              }};

artworkModel.getArtistArtsShippingFreeList = (callback,cod_artist, limit, cantToShow) => {
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

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art="paid" ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art="paid" ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art="paid" ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art="paid"), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art="paid"), 'NULL') AS id_sale,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes

FROM artwork

WHERE artwork.cod_ar2=?  AND artwork.status_step_art="paid" 

GROUP by artwork.cod_art

ORDER BY artwork.cod_art DESC

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


artworkModel.getArtistArtsShippingFreeListCount = (callback,cod_artist, limit) => {
    if(connection){

let query=`SELECT  
artwork.cod_art
FROM artwork
WHERE artwork.cod_ar2=?  AND artwork.status_step_art="paid" 
GROUP by artwork.cod_art`;

connection.query(query,[cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};



artworkModel.artistArtsShippingFree = (callback,cod_artist, cod_art) => {
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

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND auction.status_au="paid" ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND auction.status_au="paid" ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND auction.status_au="paid" ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND sale.status_sa="paid"), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND sale.status_sa="paid"), 'NULL') AS id_sale,

IFNULL((SELECT sale.cod_bu4 FROM sale WHERE sale.cod_art4=artwork.cod_art AND sale.status_sa="paid"), 'NULL') AS id_buyer_sale,

IFNULL((SELECT auction.cod_bu3 FROM auction WHERE auction.cod_art3=artwork.cod_art AND auction.status_au="paid"), 'NULL') AS id_buyer_auction,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes

FROM artwork

WHERE artwork.cod_ar2=?  AND artwork.status_step_art="paid" AND artwork.cod_art=?

GROUP by artwork.cod_art`;

connection.query(query,[cod_artist,cod_art] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};





/////////////////////////////////////////////// on route
artworkModel.getBuyerArtsOnRouteList = (callback,cod_artist, limit, cantToShow) => {
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
sale.cod_bu4,
auction.cod_bu3,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT auction.parcel_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_url_parcel,
IFNULL((SELECT auction.cod_rast_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_rast_parcel,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer' ), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer'), 'NULL') AS id_sale,

IFNULL((SELECT sale.parcel_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer' ), 'NULL') AS sale_url_parcel,
IFNULL((SELECT sale.cod_rast_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer'), 'NULL') AS sale_rast_parcel,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes

FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE   artwork.status_step_art='send-buyer' AND (sale.cod_bu4=? OR auction.cod_bu3=?)

GROUP by artwork.cod_art

LIMIT `+limit+` , `+cantToShow+`
`;

connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


artworkModel.getBuyerArtsOnRouteListCount = (callback,cod_artist, limit) => {
if(connection){

let query=`SELECT  
artwork.cod_art
FROM artwork 
LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4
WHERE  (sale.cod_bu4=? OR auction.cod_bu3=?) AND  artwork.status_step_art="send-buyer" 
GROUP by artwork.cod_art`;

connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
if(err){
    callback(err,null);

   }else{
    callback(null, data);
   }

});

}};

////////////////////////////////////////////// in test

artworkModel.getBuyerArtsInTestList = (callback,cod_artist, limit, cantToShow, minutesToFinishStatusTest) => {
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
sale.cod_bu4,
auction.cod_bu3,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review')  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review')  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review')  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT auction.parcel_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review')  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_url_parcel,
IFNULL((SELECT auction.cod_rast_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review')  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_rast_parcel,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review') ), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review')), 'NULL') AS id_sale,

IFNULL((SELECT sale.parcel_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review') ), 'NULL') AS sale_url_parcel,
IFNULL((SELECT sale.cod_rast_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review')), 'NULL') AS sale_rast_parcel,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes,

IF(TIMESTAMPDIFF(SECOND,now(),  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE) )<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF(  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF(  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now() )), 24),' hours ',
            MINUTE(TIMEDIFF(  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' minutes ',
            SECOND(TIMEDIFF(adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' seconds '
        
        ))  AS time_to_finish_direct,
            
            IF(TIMESTAMPDIFF(SECOND,now(), adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE))<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now() )), 24),' hours ',
            MINUTE(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' minutes ',
            SECOND(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' seconds '
        ))  AS time_to_finish_auction

FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE   (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review') AND (sale.cod_bu4=? OR auction.cod_bu3=?)

GROUP by artwork.cod_art
ORDER BY artwork.cod_art DESC
LIMIT `+limit+` , `+cantToShow+`
`;

connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

artworkModel.getBuyerArtsInTestListCount = (callback,cod_artist, limit) => {
    if(connection){
    
    let query=`SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review') AND (sale.cod_bu4=? OR auction.cod_bu3=?) 
    GROUP by artwork.cod_art`;
    
    connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
    
    }};

//////////////////////////////////////////////////finished

artworkModel.updateArtFinishedStatus = (callback,idArt) => {
    if(connection){

        connection.query("UPDATE artwork SET artwork.status_step_art='finished' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

  }};

//////////////////////////////////////////////////////

artworkModel.getBuyerArtInTestForReturn = (callback,cod_sale_auction,minutesToFinishStatusTest) => {
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
sale.cod_bu4,
auction.cod_bu3,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='received-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='received-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='received-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT auction.parcel_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='received-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_url_parcel,
IFNULL((SELECT auction.cod_rast_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='received-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_rast_parcel,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='received-buyer' ), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='received-buyer'), 'NULL') AS id_sale,

IFNULL((SELECT sale.parcel_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='received-buyer' ), 'NULL') AS sale_url_parcel,
IFNULL((SELECT sale.cod_rast_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='received-buyer'), 'NULL') AS sale_rast_parcel,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes,

IF(TIMESTAMPDIFF(SECOND,now(),  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE) )<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF(  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF(  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now() )), 24),' hours ',
            MINUTE(TIMEDIFF(  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' minutes ',
            SECOND(TIMEDIFF(adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' seconds '
        
        ))  AS time_to_finish_direct,
            
            IF(TIMESTAMPDIFF(SECOND,now(), adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE))<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now() )), 24),' hours ',
            MINUTE(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' minutes ',
            SECOND(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' seconds '
        ))  AS time_to_finish_auction

FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE   artwork.status_step_art='received-buyer' AND (sale.cod_sa=? OR auction.cod_au=?)

GROUP by artwork.cod_art
LIMIT 1`;

connection.query(query,[cod_sale_auction, cod_sale_auction] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

////////////////////////////////return
artworkModel.updateArtStatusReturn = (callback,idArt) => {
    if(connection){

        connection.query("UPDATE artwork SET artwork.status_step_art='returned' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

  }};


  /////////////////////////////////////////////// on route
artworkModel.getArtistArtsReturnedList = (callback,cod_artist, limit, cantToShow) => {
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
sale.cod_bu4,
auction.cod_bu3,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT auction.return_url_parcel_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_url_parcel,
IFNULL((SELECT auction.return_cod_rast_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_rast_parcel,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='returned' ), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='returned'), 'NULL') AS id_sale,

IFNULL((SELECT sale.return_url_parcel_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='returned' ), 'NULL') AS sale_url_parcel,
IFNULL((SELECT sale.return_cod_rast_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='returned'), 'NULL') AS sale_rast_parcel,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes

FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE   artwork.status_step_art='returned' AND (sale.cod_ar5=? OR auction.cod_ar4=?)

GROUP by artwork.cod_art

LIMIT `+limit+` , `+cantToShow+`
`;

connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

artworkModel.getArtistArtsReturnedListCount = (callback,cod_artist, limit) => {
    if(connection){
    
    let query=`SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE  artwork.status_step_art='returned' AND (sale.cod_ar5=? OR auction.cod_ar4=?)
    GROUP by artwork.cod_art`;
    
    connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};

artworkModel.updateArtReceivedReturnedStatus = (callback,idArt) => {
    if(connection){

        connection.query("UPDATE artwork SET artwork.status_step_art='received-returned-artist' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

  }};

  ////////////////////////////////////////getBuyerArsReturnedList

artworkModel.getBuyerArsReturnedList = (callback,cod_artist, limit, cantToShow) => {
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
sale.cod_bu4,
auction.cod_bu3,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT auction.return_url_parcel_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_url_parcel,
IFNULL((SELECT auction.return_cod_rast_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='returned'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_rast_parcel,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='returned' ), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='returned'), 'NULL') AS id_sale,

IFNULL((SELECT sale.return_url_parcel_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='returned' ), 'NULL') AS sale_url_parcel,
IFNULL((SELECT sale.return_cod_rast_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='returned'), 'NULL') AS sale_rast_parcel,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes

FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE   artwork.status_step_art='returned' AND (sale.cod_bu4=? OR auction.cod_bu3=?)

GROUP by artwork.cod_art

LIMIT `+limit+` , `+cantToShow+`
`;

connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

artworkModel.getBuyerArsReturnedListCount = (callback,cod_artist, limit) => {
    if(connection){
    
    let query=`SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE artwork.status_step_art='returned' AND (sale.cod_bu4=? OR auction.cod_bu3=?)
    GROUP by artwork.cod_art`;
    
    connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};


///////////////////////////////////////////////getArtistArsSendList

artworkModel.getArtistArsSendList = (callback,cod_artist, limit, cantToShow) => {
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
sale.cod_bu4,
auction.cod_bu3,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT auction.parcel_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_url_parcel,
IFNULL((SELECT auction.cod_rast_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_rast_parcel,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer' ), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer'), 'NULL') AS id_sale,

IFNULL((SELECT sale.parcel_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer' ), 'NULL') AS sale_url_parcel,
IFNULL((SELECT sale.cod_rast_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer'), 'NULL') AS sale_rast_parcel,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes

FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE   artwork.status_step_art='send-buyer' AND (sale.cod_ar5=? OR auction.cod_ar4=?)

GROUP by artwork.cod_art

LIMIT `+limit+` , `+cantToShow+`
`;

connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


artworkModel.getArtistArsSendListCount = (callback,cod_artist, limit) => {
    if(connection){
    
    let query=`SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE  artwork.status_step_art='send-buyer' AND (sale.cod_ar5=? OR auction.cod_ar4=?)
    GROUP by artwork.cod_art`;
    
    connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};


///////////////////////////////////arwork bid


artworkModel.getArtForBid = (callback,cod_art) => {
    if(connection){
    
    let query=`SELECT  
    artwork.cod_art,
    
    CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements,
    
    artwork.minimum_bid_art,
    
    artwork.cod_ar2,
    
    artwork.author_art,
    artwork.title_art,
    
    artwork.status_step_art,
    
    artwork.type_art,
    
    artwork.url_art,
    
    
    IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art) AS offer_actuall,
    
    IF(TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF( artwork.expiration_date_art, now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF( artwork.expiration_date_art, now() )), 24),' hours ',
            MINUTE(TIMEDIFF(artwork.expiration_date_art, now())), ' minutes ',
            SECOND(TIMEDIFF(artwork.expiration_date_art, now())), ' seconds '
        
        ))  AS time_to_finish,
    
    (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes
    
    FROM artwork
    
    INNER JOIN tag_ca on tag_ca.cod_art20=artwork.cod_art
    INNER JOIN tag_te on tag_te.cod_art21=artwork.cod_art
    INNER JOIN tag_th on tag_th.cod_art22=artwork.cod_art
    
    WHERE artwork.cod_art=?
    
    GROUP by artwork.cod_art`;
    
    connection.query(query,[ cod_art] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};


/////////////////validate bid

artworkModel.validateDateBid = (callback,cod_art) => {
    if(connection){
    let query=`SELECT  
    IF(TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)<=0, "TIME OVER", 
    CONCAT(FLOOR(HOUR(TIMEDIFF( artwork.expiration_date_art, now())) / 24), ' days ',MOD(
    HOUR(TIMEDIFF( artwork.expiration_date_art, now() )), 24),' hours ',
    MINUTE(TIMEDIFF(artwork.expiration_date_art, now())), ' minutes ',
    SECOND(TIMEDIFF(artwork.expiration_date_art, now())), ' seconds '

))  AS time_to_finish
    
    FROM artwork
    WHERE artwork.cod_art=?`;
    
    connection.query(query,[ cod_art] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}
};

artworkModel.validateAmountBid = (callback,cod_art,amount) => {
    if(connection){
    let query=`SELECT  
    IF(
   IF( (IFNULL(
    (SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art
    )) = artwork.minimum_bid_art,artwork.minimum_bid_art,  (SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1)+100  )<= ?, "OK", "NOT"
    )
    AS response
        
    FROM artwork
        
    WHERE artwork.cod_art=?`;
     let queryNew=`SELECT  
     IF(
    IF( (IFNULL(
     (SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1), artwork.minimum_bid_art
     )) = artwork.minimum_bid_art,artwork.minimum_bid_art+100,  (SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art ORDER by auction.amount_au DESC LIMIT 1)+100  )<= ?, "OK", "NOT"
     )
     AS response
         
     FROM artwork
         
     WHERE artwork.cod_art=?`;
    
    connection.query(queryNew,[amount,cod_art] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}
};


artworkModel.validateStatusBid = (callback,cod_art) => {
    if(connection){
    let query=`SELECT  
    artwork.cod_art
    FROM artwork
    WHERE artwork.cod_art=? AND (artwork.status_step_art='pending' OR artwork.status_step_art='idle')`;
    connection.query(query,[cod_art] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    });
}
};

//////////////////////////////////update status pedning
artworkModel.updateArtStatusPending = (callback,idArt) => {
    if(connection){

        connection.query("UPDATE artwork SET artwork.status_step_art='pending' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

  /////////////////////////erase arworks time over 
  artworkModel.getArworksTimeOverAndIdleStatus = (callback) => {
    if(connection){

        connection.query("SELECT artwork.cod_art, artwork.type_art, artwork.url_art FROM artwork WHERE artwork.status_step_art='idle' AND IF(TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)<=0, 'TIME OVER', 'GO')='TIME OVER'",[] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

artworkModel.deleteArtwork = (callback, idArt) => {
    if(connection){

        connection.query("DELETE FROM artwork WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


artworkModel.getArworksForKnowWinner = (callback) => {
    if(connection){

        connection.query(
        `SELECT *, CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements FROM artwork 
        LEFT JOIN auction ON auction.cod_art3=artwork.cod_art
        WHERE artwork.status_step_art='pending' AND IF(TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)<=0, 'TIME OVER', 'GO')='TIME OVER'
        ORDER BY auction.amount_au  DESC `,[] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

artworkModel.getArworksForKnowWinner2 = (callback) => {
    if(connection){

        connection.query(
        `SELECT artwork.cod_art FROM artwork WHERE artwork.status_step_art='pending' AND IF(TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)<=0, 'TIME OVER', 'GO')='TIME OVER' `,[] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

artworkModel.getArworkForKnowWinnerById = (callback, idArt) => {
    if(connection){

        connection.query(
        `SELECT *, CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements FROM artwork 
        INNER JOIN auction ON auction.cod_art3=artwork.cod_art
        WHERE artwork.status_step_art='pending' AND IF(TIMESTAMPDIFF(SECOND,now(),artwork.expiration_date_art)<=0, 'TIME OVER', 'GO')='TIME OVER' AND artwork.cod_art=?
       
        ORDER BY auction.amount_au  DESC `,[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};



artworkModel.getArworkForKnowWinnerById2 = (callback, idArt) => {
    if(connection){

        connection.query(
        `SELECT  *,MAX(auction.amount_au) as max_amount, auction.amount_au, CONCAT(artwork.height_art,' cm x ', artwork.width_art,' cm x ', artwork.depth_art,' cm') AS measurements
        FROM auction
        INNER JOIN artwork on artwork.cod_art=auction.cod_art3
        WHERE  auction.cod_art3=?
        GROUP BY auction.cod_bu3
        ORDER by MAX(auction.amount_au) DESC
        `,[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });
}};

//////////////////////////update status pending paid auction
artworkModel.updateArtStatusPendingPaidAuction = (callback,idArt) => {
    if(connection){

        connection.query("UPDATE artwork SET artwork.status_step_art='pending-paid-auction' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

//////////////////////update status auction paid
artworkModel.updateArtStatusPaidAuction = (callback,idArt) => {
    if(connection){

        connection.query("UPDATE artwork SET artwork.status_step_art='paid' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


////////////////////////////////////////////// in test for cron job

artworkModel.getArtsInTestCron = (callback, minutesToFinishStatusTest) => {
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
sale.cod_bu4,

auction.cod_bu3,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='received-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='received-buyer'), 'NULL') AS id_sale

FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE   artwork.status_step_art='received-buyer' AND 

(
IF(TIMESTAMPDIFF(SECOND,now(),  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE) )<=0, "TIME OVER","GO" ) = 'TIME OVER'
OR
IF(TIMESTAMPDIFF(SECOND,now(),  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE) )<=0, "TIME OVER","GO" ) = 'TIME OVER'
)

GROUP by artwork.cod_art`;

connection.query(query,[] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

/////////////////////////////update status pedning review 
artworkModel.updateArtPendingReviewStatus = (callback,idArt) => {
    if(connection){

        connection.query("UPDATE artwork SET artwork.status_step_art='pending-review' WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

  }};

  ///////////////////////////////////////////////getBuyerArtsBoughtList

artworkModel.getBuyerArtsBoughtList = (callback,cod_buyer, limit, cantToShow) => {
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
sale.cod_bu4,
auction.cod_bu3,

(SELECT artist.name_ar FROM artist WHERE artist.cod_ar=artwork.cod_ar2) AS name_creator,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review')  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.date_of_status_change_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review')  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_bought_auction,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review')), 'NULL') AS date_bought_sale,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes,
(SELECT IF(COUNT(likee.cod_li)>0,'LIKE','NOLIKE') FROM likee WHERE likee.cod_bu2=? AND likee.cod_art2=artwork.cod_art LIMIT 1) as iam_like


FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE  (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review') AND (sale.cod_bu4=? OR auction.cod_bu3=?)

GROUP by artwork.cod_art
ORDER by artwork.publication_date_art DESC
LIMIT `+limit+` , `+cantToShow+` 
`;

connection.query(query,[cod_buyer,cod_buyer, cod_buyer] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


artworkModel.getBuyerArtsBoughtListCount = (callback,cod_buyer, limit) => {
    if(connection){
    let query=`SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review') AND (sale.cod_bu4=? OR auction.cod_bu3=?)
    GROUP by artwork.cod_art`;
    
    connection.query(query,[cod_buyer, cod_buyer] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};

  ///////////////////////////////////////////////getBuyerShippingPendingList

  artworkModel.getBuyerShippingPendingList = (callback,cod_buyer, limit, cantToShow) => {
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
sale.cod_bu4,
auction.cod_bu3,

(SELECT artist.name_ar FROM artist WHERE artist.cod_ar=artwork.cod_ar2) AS name_creator,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='paid'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.date_of_status_change_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='paid' ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_bought_auction,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='paid'), 'NULL') AS date_bought_sale,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes,
(SELECT IF(COUNT(likee.cod_li)>0,'LIKE','NOLIKE') FROM likee WHERE likee.cod_bu2=? AND likee.cod_art2=artwork.cod_art LIMIT 1) as iam_like


FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE  artwork.status_step_art='paid' AND (sale.cod_bu4=? OR auction.cod_bu3=?)

GROUP by artwork.cod_art
ORDER by artwork.publication_date_art DESC
LIMIT `+limit+` , `+cantToShow+` 
`;

connection.query(query,[cod_buyer,cod_buyer, cod_buyer] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


artworkModel.getBuyerShippingPendingListCount = (callback,cod_buyer, limit) => {
    if(connection){
    let query=`SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE artwork.status_step_art='paid' AND (sale.cod_bu4=? OR auction.cod_bu3=?)
    GROUP by artwork.cod_art`;
    
    connection.query(query,[cod_buyer, cod_buyer] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};

///////////////////////////////////////////////getArtistArtsBoughtList
artworkModel.getArtistArtsBoughtList = (callback,cod_artist, limit, cantToShow) => {
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
sale.cod_bu4,
auction.cod_bu3,


IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review')  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.date_of_status_change_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review')  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_bought_auction,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review')), 'NULL') AS date_bought_sale,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes


FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE  (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review') AND (sale.cod_ar5=? OR auction.cod_ar4=?)

GROUP by artwork.cod_art
ORDER by artwork.publication_date_art DESC
LIMIT `+limit+` , `+cantToShow+` 
`;

connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


artworkModel.getArtistArtsBoughtListCount = (callback,cod_artist, limit) => {
    if(connection){
    let query=`SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review') AND (sale.cod_ar5=? OR auction.cod_ar4=?)
    GROUP by artwork.cod_art`;
    
    connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};

///////////////////////////////////////////////getArtistArtsInTestBuyerList
artworkModel.getArtistArtsInTestBuyerList = (callback,cod_artist, limit, cantToShow, minutesToFinishStatusTest) => {
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
sale.cod_bu4,
auction.cod_bu3,


IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='received-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.date_of_status_change_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='received-buyer' ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_bought_auction,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='received-buyer'), 'NULL') AS date_bought_sale,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes,

IF(TIMESTAMPDIFF(SECOND,now(),  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE) )<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF(  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF(  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now() )), 24),' hours ',
            MINUTE(TIMEDIFF(  adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' minutes ',
            SECOND(TIMEDIFF(adddate(sale.date_of_status_change_sa,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' seconds '
        
        ))  AS time_to_finish_direct,
            
            IF(TIMESTAMPDIFF(SECOND,now(), adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE))<=0, "TIME OVER", 
            CONCAT(FLOOR(HOUR(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now())) / 24), ' days ',MOD(
            HOUR(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now() )), 24),' hours ',
            MINUTE(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' minutes ',
            SECOND(TIMEDIFF(  adddate(auction.date_of_status_change_au,interval `+minutesToFinishStatusTest+` MINUTE), now())), ' seconds '
        ))  AS time_to_finish_auction


FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE  artwork.status_step_art='received-buyer' AND (sale.cod_ar5=? OR auction.cod_ar4=?)

GROUP by artwork.cod_art
ORDER by artwork.publication_date_art DESC
LIMIT  `+limit+` , `+cantToShow+` 
`;

connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


artworkModel.getArtistArtsInTestBuyerListCount = (callback,cod_artist, limit) => {
    if(connection){
    let query=`SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE artwork.status_step_art='received-buyer' AND (sale.cod_ar5=? OR auction.cod_ar4=?)
    GROUP by artwork.cod_art`;
    
    connection.query(query,[cod_artist, cod_artist] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};

///////////////////////////////////////////////aside buyer


artworkModel.getArtsStatesAsideBuyer = (callback,cod_buyer, limit) => {
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
    (SELECT artist.name_ar FROM artist WHERE artist.cod_ar=artwork.cod_ar2) AS name_creator,
    
    IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (auction.status_au="send-buyer" OR auction.status_au="received-buyer" ) ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,
    
    IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (auction.status_au="send-buyer" OR auction.status_au="received-buyer" ) ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,
    
    IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (auction.status_au="send-buyer" OR auction.status_au="received-buyer" ) ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,
    
    IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (sale.status_sa="send-buyer" OR sale.status_sa="received-buyer" )), 'NULL') AS date_paid_art,
    
    IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (sale.status_sa="send-buyer" OR sale.status_sa="received-buyer" )), 'NULL') AS id_sale,

    IFNULL((SELECT sale.cod_bu4 FROM sale WHERE sale.cod_art4=artwork.cod_art AND (sale.status_sa="send-buyer" OR sale.status_sa="received-buyer" )), 'NULL') AS cod_bu4,

    IFNULL((SELECT auction.cod_bu3 FROM auction WHERE auction.cod_art3=artwork.cod_art AND (auction.status_au="send-buyer" OR auction.status_au="received-buyer" )), 'NULL') AS cod_bu3,
    
    (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes
    
    FROM artwork
    
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    
    WHERE (auction.cod_bu3=? OR sale.cod_bu4=?)  AND (artwork.status_step_art="send-buyer" OR artwork.status_step_art="received-buyer" )
    
    GROUP by artwork.cod_art
    ORDER BY artwork.cod_art DESC
    LIMIT `+limit;
    
    connection.query(query,[cod_buyer, cod_buyer] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};

//////////////////////////////////////////////////////getBuyerStatesList

artworkModel.getBuyerStatesList = (callback,cod_buyer, limit, cantToShow) => {
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
(SELECT artist.name_ar FROM artist WHERE artist.cod_ar=artwork.cod_ar2) AS name_creator,

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (auction.status_au="send-buyer" OR auction.status_au="received-buyer" ) ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (auction.status_au="send-buyer" OR auction.status_au="received-buyer" ) ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND (auction.status_au="send-buyer" OR auction.status_au="received-buyer" ) ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (sale.status_sa="send-buyer" OR sale.status_sa="received-buyer" )), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND (sale.status_sa="send-buyer" OR sale.status_sa="received-buyer" )), 'NULL') AS id_sale,

IFNULL((SELECT sale.cod_bu4 FROM sale WHERE sale.cod_art4=artwork.cod_art AND (sale.status_sa="send-buyer" OR sale.status_sa="received-buyer" )), 'NULL') AS cod_bu4,

IFNULL((SELECT auction.cod_bu3 FROM auction WHERE auction.cod_art3=artwork.cod_art AND (auction.status_au="send-buyer" OR auction.status_au="received-buyer" )), 'NULL') AS cod_bu3,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes,

(SELECT IF(COUNT(likee.cod_li)>0,'LIKE','NOLIKE') FROM likee WHERE likee.cod_bu2=? AND likee.cod_art2=artwork.cod_art LIMIT 1) as iam_like

FROM artwork

LEFT JOIN auction on artwork.cod_art=auction.cod_art3
LEFT JOIN sale on artwork.cod_art=sale.cod_art4

WHERE (auction.cod_bu3=? OR sale.cod_bu4=?)  AND (artwork.status_step_art="send-buyer" OR artwork.status_step_art="received-buyer" )

GROUP by artwork.cod_art
ORDER BY artwork.cod_art DESC
LIMIT  `+limit+` , `+cantToShow+` 
`;

connection.query(query,[cod_buyer, cod_buyer, cod_buyer] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


artworkModel.getBuyerStatesListCount = (callback,cod_buyer) => {
    if(connection){
    let query=`SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE (auction.cod_bu3=? OR sale.cod_bu4=?)  AND (artwork.status_step_art="send-buyer" OR artwork.status_step_art="received-buyer" )
    GROUP by artwork.cod_art`;
    
    connection.query(query,[cod_buyer, cod_buyer] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};


artworkModel.goBuyerTypeStatesOnRoute = (callback,id_saleAuction, type_sale) => {
    if(connection){
        let query="";
        if(type_sale=="direct"){
             query=`SELECT  
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
            sale.cod_bu4,
            auction.cod_bu3,
            
            IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,
            
            IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,
            
            IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,
            
            IFNULL((SELECT auction.parcel_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_url_parcel,
            IFNULL((SELECT auction.cod_rast_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_rast_parcel,
            
            IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer' ), 'NULL') AS date_paid_art,
            
            IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer'), 'NULL') AS id_sale,
            
            IFNULL((SELECT sale.parcel_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer' ), 'NULL') AS sale_url_parcel,
            IFNULL((SELECT sale.cod_rast_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer'), 'NULL') AS sale_rast_parcel,
            
            (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes
            
            FROM artwork
            
            LEFT JOIN auction on artwork.cod_art=auction.cod_art3
            LEFT JOIN sale on artwork.cod_art=sale.cod_art4
            
            WHERE   artwork.status_step_art='send-buyer' AND sale.cod_sa=?
            
            GROUP by artwork.cod_art`;
        }else{
            query=`SELECT  
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
            sale.cod_bu4,
            auction.cod_bu3,
            
            IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,
            
            IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,
            
            IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,
            
            IFNULL((SELECT auction.parcel_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_url_parcel,
            IFNULL((SELECT auction.cod_rast_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art='send-buyer'  ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS auction_rast_parcel,
            
            IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer' ), 'NULL') AS date_paid_art,
            
            IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer'), 'NULL') AS id_sale,
            
            IFNULL((SELECT sale.parcel_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer' ), 'NULL') AS sale_url_parcel,
            IFNULL((SELECT sale.cod_rast_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art='send-buyer'), 'NULL') AS sale_rast_parcel,
            
            (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes
            
            FROM artwork
            
            LEFT JOIN auction on artwork.cod_art=auction.cod_art3
            LEFT JOIN sale on artwork.cod_art=sale.cod_art4
            
            WHERE   artwork.status_step_art='send-buyer' AND auction.cod_au=?
            
            GROUP by artwork.cod_art`;
        }
connection.query(query,[id_saleAuction] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};



artworkModel.getArtistForIdArt = (callback,idArt) => {
    if(connection){

        connection.query(`SELECT artist.cod_ar FROM artwork 
        INNER JOIN artist on artist.cod_ar=artwork.cod_ar2
        WHERE artwork.cod_art=?`,[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

  }};


  artworkModel.getArtsAuctionsInCurseAsideBuyer = (callback,cod_buyer, limit) => {
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
                MINUTE(TIMEDIFF(artwork.expiration_date_art, now())), ' minutes ',
                SECOND(TIMEDIFF(artwork.expiration_date_art, now())), ' seconds '
            ))  AS time_to_finish,
    
    
    (SELECT IF(COUNT(likee.cod_li)>0,'LIKE','NOLIKE') FROM likee WHERE likee.cod_bu2=? AND likee.cod_art2=artwork.cod_art LIMIT 1) AS iam_like,
    (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) AS number_likes
    
    FROM artwork
    
    INNER JOIN auction on auction.cod_art3=artwork.cod_art
    
    WHERE  auction.cod_bu3=? AND auction.status_au='pending' AND TIMESTAMPDIFF(SECOND,now(), artwork.expiration_date_art)>0
    
    GROUP by artwork.cod_art
    
    ORDER BY number_likes DESC LIMIT `+limit;
    
    connection.query(query,[cod_buyer, cod_buyer, cod_buyer] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};


artworkModel.getArtsLikesMostPopular = (callback,cod_buyer, limit) => {
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

    
    (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes
    
    FROM artwork

    WHERE (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) > 0
    
    GROUP by artwork.cod_art
    
    ORDER BY number_likes DESC LIMIT `+limit;
    
    connection.query(query,[] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};

//artist aside info

artworkModel.getInfoArtistAside = (callback,cod_artist) => {
    if(connection){
    let query=`SELECT 

    (SELECT  COUNT(*)
   FROM (SELECT  
           COUNT(artwork.cod_art)
           FROM artwork 
           LEFT JOIN auction on artwork.cod_art=auction.cod_art3
           LEFT JOIN sale on artwork.cod_art=sale.cod_art4
           WHERE (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review') AND (sale.cod_ar5=`+cod_artist+` OR auction.cod_ar4=`+cod_artist+`)
           GROUP by artwork.cod_art) as tmp1) AS number_sale_arts,
   
   (SELECT  COUNT(*)
   FROM (SELECT  
       COUNT(artwork.cod_art)
       FROM artwork
       WHERE artwork.cod_ar2=`+cod_artist+`  AND artwork.status_step_art="paid" 
       GROUP by artwork.cod_art)  as tmp1) AS number_pending_send,
       
   (SELECT  COUNT(*)
   FROM (SELECT  
           COUNT(artwork.cod_art)
           FROM artwork 
           LEFT JOIN auction on artwork.cod_art=auction.cod_art3
           LEFT JOIN sale on artwork.cod_art=sale.cod_art4
           WHERE artwork.status_step_art='received-buyer' AND (sale.cod_ar5=`+cod_artist+` OR auction.cod_ar4=`+cod_artist+`)
           GROUP by artwork.cod_art)  as tmp1) AS number_test_by_buyer,
   (SELECT  COUNT(*)
   FROM (SELECT  
           COUNT(artwork.cod_art)
           FROM artwork 
           LEFT JOIN auction on artwork.cod_art=auction.cod_art3
           LEFT JOIN sale on artwork.cod_art=sale.cod_art4
           WHERE  artwork.status_step_art='send-buyer' AND (sale.cod_ar5=`+cod_artist+` OR auction.cod_ar4=`+cod_artist+`)
           GROUP by artwork.cod_art)  as tmp1) AS number_send_buyer,
           
    (SELECT  COUNT(*)
   FROM (SELECT  
       COUNT(artwork.cod_art)
       FROM artwork
       
       INNER JOIN auction on auction.cod_art3=artwork.cod_art
       
       WHERE  auction.cod_ar4=`+cod_artist+` AND auction.status_au='pending-paid-auction'
       
       GROUP by artwork.cod_art)  as tmp1) AS number_pending_paid_buyer,
       
   (SELECT  COUNT(*)
   FROM (SELECT  
    COUNT(artwork.cod_art)
    FROM artwork 
           LEFT JOIN auction on artwork.cod_art=auction.cod_art3
           LEFT JOIN sale on artwork.cod_art=sale.cod_art4
           WHERE  artwork.status_step_art='returned' AND (sale.cod_ar5=`+cod_artist+` OR auction.cod_ar4=`+cod_artist+`)
           GROUP by artwork.cod_art)  as tmp1) AS number_arts_returned,           
(SELECT  COUNT(*)
FROM  (SELECT * FROM follow WHERE follow.cod_ar6=`+cod_artist+`) as tmp1) AS number_followers,

(SELECT  COUNT(*)
FROM  (SELECT artwork.cod_art FROM artwork WHERE artwork.type_sale_art='direct' AND artwork.cod_ar2=`+cod_artist+` AND (artwork.status_step_art='idle' )) as tmp1) AS number_arts_in_sale,

(SELECT  COUNT(*)
FROM  (SELECT artwork.cod_art FROM artwork WHERE artwork.type_sale_art='auction' AND artwork.cod_ar2=`+cod_artist+`
AND (artwork.status_step_art='idle' OR artwork.status_step_art='pending' )) as tmp1) AS number_arts_in_auction,

(SELECT (SUM(auction.amount_au)-((SUM(auction.amount_au) * `+config_commissions.commissions_porcent_auctions+`)/100))  FROM auction WHERE auction.status_au='finished' AND auction.cod_ar4=`+cod_artist+`)
AS mont_pending_paid_auctions,

(SELECT (SUM(sale.amount_sa)-((SUM(sale.amount_sa) * `+config_commissions.commissions_porcent_direct_sales+`)/100))  FROM sale WHERE sale.status_sa='finished' AND sale.cod_ar5=`+cod_artist+`)
AS mont_pending_paid_direct,

(SELECT ROUND(AVG(rating.rating_ra))  FROM rating WHERE rating.cod_ar1=`+cod_artist+`) AS avg_rating

       FROM artist WHERE artist.cod_ar=`+cod_artist+``;
    
    connection.query(query,[] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};

/////////BUYERS aside info

artworkModel.getInfoBuyerAside = (callback,cod_artist) => {
    if(connection){
    let query=`SELECT 
    (SELECT  COUNT(*)
    FROM (SELECT  
        artwork.cod_art
        FROM artwork 
        LEFT JOIN auction on artwork.cod_art=auction.cod_art3
        LEFT JOIN sale on artwork.cod_art=sale.cod_art4
        WHERE (artwork.status_step_art='finished' OR artwork.status_step_art='pending-review') AND (sale.cod_bu4=`+cod_artist+` OR auction.cod_bu3=`+cod_artist+`)
        GROUP by artwork.cod_art)  as tmp1) AS number_buy,
    (SELECT  COUNT(*)
    FROM (SELECT  
    artwork.cod_art
    FROM artwork
    
    INNER JOIN auction on auction.cod_art3=artwork.cod_art
    
    WHERE  auction.cod_bu3=`+cod_artist+` AND auction.status_au='pending' AND TIMESTAMPDIFF(SECOND,now(), artwork.expiration_date_art)>0
    
    GROUP by artwork.cod_art)  as tmp1) AS number_my_offers,
    (SELECT  COUNT(*)
    FROM  (SELECT  
        artwork.cod_art
        FROM artwork 
        LEFT JOIN auction on artwork.cod_art=auction.cod_art3
        LEFT JOIN sale on artwork.cod_art=sale.cod_art4
        WHERE artwork.status_step_art='paid' AND (sale.cod_bu4=`+cod_artist+` OR auction.cod_bu3=`+cod_artist+`)
        GROUP by artwork.cod_art)  as tmp1) AS number_pending_send,
    (SELECT  COUNT(*)
    FROM (SELECT  
    artwork.cod_art
    FROM artwork 
    LEFT JOIN auction on artwork.cod_art=auction.cod_art3
    LEFT JOIN sale on artwork.cod_art=sale.cod_art4
    WHERE  (sale.cod_bu4=`+cod_artist+` OR auction.cod_bu3=`+cod_artist+`) AND  artwork.status_step_art="send-buyer" 
    GROUP by artwork.cod_art)  as tmp1) AS in_rute,
    (SELECT  COUNT(*)
    FROM (SELECT  
        artwork.cod_art
        FROM artwork 
        LEFT JOIN auction on artwork.cod_art=auction.cod_art3
        LEFT JOIN sale on artwork.cod_art=sale.cod_art4
        WHERE (artwork.status_step_art='received-buyer' OR artwork.status_step_art='pending-review') AND (sale.cod_bu4=`+cod_artist+` OR auction.cod_bu3=`+cod_artist+`) 
        GROUP by artwork.cod_art)  as tmp1) AS in_test,
    (SELECT  COUNT(*)
    FROM (SELECT  
    artwork.cod_art
    FROM artwork
    
    INNER JOIN auction on auction.cod_art3=artwork.cod_art
    
    WHERE  auction.cod_bu3=`+cod_artist+`  AND auction.status_au='pending-paid-auction'
    
    GROUP by artwork.cod_art)  as tmp1) AS number_pending_paid,
    (SELECT  COUNT(*)
    FROM (SELECT  
        artwork.cod_art
        FROM artwork 
        LEFT JOIN auction on artwork.cod_art=auction.cod_art3
        LEFT JOIN sale on artwork.cod_art=sale.cod_art4
        WHERE artwork.status_step_art='returned' AND (sale.cod_bu4=`+cod_artist+` OR auction.cod_bu3=`+cod_artist+`)
        GROUP by artwork.cod_art)  as tmp1) AS number_returned,
        (SELECT  COUNT(*)
FROM  (SELECT * FROM follow WHERE follow.cod_bu5=`+cod_artist+`) as tmp1) AS number_followers


       FROM buyer WHERE buyer.cod_bu=`+cod_artist+``;
    
    connection.query(query,[] ,(err, data) =>{
    if(err){
        callback(err,null);
    
       }else{
        callback(null, data);
       }
    
    });
}};


//////////////////////////

artworkModel.artsMorePopularList = (callback, limit, cantToShow) => {
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

IFNULL((SELECT auction.amount_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art="paid" ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS offer_winner,

IFNULL((SELECT auction.offer_date_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art="paid" ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS date_offer_winner,

IFNULL((SELECT auction.cod_au FROM auction WHERE auction.cod_art3=artwork.cod_art AND artwork.status_step_art="paid" ORDER by auction.amount_au DESC LIMIT 1), 'NULL') AS id_auction,

IFNULL((SELECT sale.purchase_date_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art="paid"), 'NULL') AS date_paid_art,

IFNULL((SELECT sale.cod_sa FROM sale WHERE sale.cod_art4=artwork.cod_art AND artwork.status_step_art="paid"), 'NULL') AS id_sale,

(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes

FROM artwork

WHERE (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art)>0

GROUP by artwork.cod_art

ORDER BY number_likes DESC

LIMIT `+limit+` , `+cantToShow+`
`;

connection.query(query,[] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};

artworkModel.artsMorePopularListCount = (callback) => {
    if(connection){

let query=`SELECT  
artwork.cod_art,
(SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art) as number_likes
FROM artwork

WHERE (SELECT COUNT(likee.cod_li) FROM likee WHERE likee.cod_art2=artwork.cod_art)>0

GROUP by artwork.cod_art

ORDER BY number_likes DESC`;

connection.query(query,[] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });

}};


//////////////////////////////////update status pedning
artworkModel.eraseArt = (callback,idArt) => {
    if(connection){

        connection.query("DELETE FROM artwork WHERE artwork.cod_art=?",[idArt] ,(err, data) =>{
            if(err){
                callback(err,null);
            
               }else{
                callback(null, data);
               }
    
        });
}};
module.exports = artworkModel;