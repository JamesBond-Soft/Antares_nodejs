
connection = require('../../config/database');

let thematicModel = {};
 
thematicModel.getThematics = (callback) => {
    if(connection){
        connection.query('SELECT * FROM thematic',[] ,(err, data) =>{
        if(err){
           callback(err,null);
        }else{
            callback(null, data);
        }
    }
    )}};

module.exports = thematicModel;