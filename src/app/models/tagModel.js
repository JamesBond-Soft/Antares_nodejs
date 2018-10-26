
connection = require('../../config/database');

let tagModel = {};
 
tagModel.setTagCategory = (callback, cod_ca, cod_art) => {
    if(connection){
        connection.query('INSERT INTO tag_ca  (cod_ca20, cod_art20) VALUES(?, ?)',[cod_ca, cod_art] ,(err, data) =>{
        if(err){
           callback(err,null);
       
          }else{
            
            callback(null, data);
         
          }}
    )}};

    tagModel.setTagTechnique = (callback, cod_te, cod_art) => {
        if(connection){
            connection.query('INSERT INTO tag_te  (cod_te21, cod_art21) VALUES(?, ?)',[cod_te, cod_art] ,(err, data) =>{
            if(err){
               callback(err,null);
           
              }else{
                
                callback(null, data);
             
              }}
        )}};

        tagModel.setTagThematic = (callback, cod_th, cod_art) => {
            if(connection){
                connection.query('INSERT INTO tag_th  (cod_th22, cod_art22) VALUES(?, ?)',[cod_th, cod_art] ,(err, data) =>{
                if(err){
                   callback(err,null);
               
                  }else{
                    
                    callback(null, data);
                 
                  }}
            )}};
    



module.exports = tagModel;