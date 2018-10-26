
connection = require('../../config/database');

let categoryModel = {};
 
categoryModel.getCategories = (callback) => {
    if(connection){
        connection.query('SELECT * FROM category',[] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}};

module.exports = categoryModel;