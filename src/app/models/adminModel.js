
connection = require('../../config/database');

let artistModel = {};
 
artistModel.getArtists = (callback,id) => {
if(connection){
    connection.query('SELECT * FROM artist WHERE cod_ar = ?',[id] ,(err, rows) =>{
    if(err){
       callback(err,null);
    }else{
        callback(null, rows);
    }
}
)

}

};



module.exports = artistModel;