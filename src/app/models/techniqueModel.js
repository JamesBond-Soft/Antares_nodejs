
connection = require('../../config/database');

let techniqueModel = {};
 
techniqueModel.getTechniques = (callback,idCategory) => {
    if(connection){
        connection.query('SELECT * FROM technique INNER JOIN category on category.cod_ca=technique.cod_ca1 WHERE category.cod_ca=?',[idCategory] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}};


    


module.exports = techniqueModel;