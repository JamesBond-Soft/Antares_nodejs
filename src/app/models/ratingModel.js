
connection = require('../../config/database');

let ratingModel = {};
 
ratingModel.setRating = (callback,cod_ar1, cod_bu1, rating_ra) => {
    if(connection){
            connection.query('INSERT INTO rating (rating.cod_ar1, rating.cod_bu1, rating.rating_ra) VALUES (?,?,?)',[cod_ar1, cod_bu1, rating_ra] ,(err, data) =>{
            if(err){
               callback(err,null);
           
              }else{
                callback(null, data);
    }}
     )}
    
};

module.exports = ratingModel;