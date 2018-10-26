const helpers = require('../helpers/helpers');
const  thematicModel = require('../models/thematicModel');
const  techniqueModel = require('../models/techniqueModel');
const  categoryModel = require('../models/categoryModel');
const  artworkModel = require('../models/artworkModel');
const  tagModel = require('../models/tagModel');
const  notificationModel = require('../models/notificationModel');
const  configTime = require('../../config/config-time');

const path = require('path');
var multer = require('multer');
var fs = require('fs');



const fileFilterImage = (req, file, cb)=>{
    var errors= [];
    if(file.mimetype != 'image/jpeg' && file.mimetype != 'image/jpg' && file.mimetype != 'image/png'){
        errors.push({msg:'Solo puede subir formatos de imagen jpg, jpeg y png'});
    }

    req.fileValidationError=errors;

    if(errors.length>0){
        cb(null, false, req.fileValidationError);
    }else{
        cb(null, true);
    }
};
const fileFilterVideo = (req, file, cb)=>{
    var errors= [];
    if(file.mimetype != 'video/mp4'){
        errors.push({msg:'Solo puede subir formatos de video mp4'});
    }

    req.fileValidationError=errors;

    if(errors.length>0){
        cb(null, false, req.fileValidationError);
    }else{
        cb(null, true);
    }
};

var uploadImages = multer({ dest: path.join(__dirname,'../../tmp' ) , fileFilter: fileFilterImage});

var uploadVideos = multer({ dest: path.join(__dirname,'../../tmp' ), fileFilter: fileFilterVideo});


module.exports = (app, passport) => {

 

    app.get('/artist',helpers.isLogged,(req, res) => {
       

        res.render('artist/artist',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger')
        });
    });

    app.post('/getCategories',helpers.isLogged,(req, res) => {

        categoryModel.getCategories((err,data) => {
          
        
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                res.send(data);
            }

        });
       
     });

     app.post('/getTechniques',helpers.isLogged,(req, res) => {
           var idCategory=req.body.idCategory;
           techniqueModel.getTechniques((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                res.send(data);
            }

        }, idCategory);
       
     });

     app.post('/getThematics',helpers.isLogged,(req, res) => {

        thematicModel.getThematics((err,data) => {
          
        
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                res.send(data);
            }

        });
       
     });

     app.post('/getArtworksArtist',helpers.isLogged,(req, res) => {
        var cod_artist=req.session.user.cod_ar;
          
        var offset=parseInt(req.body.offset);
        var limit=parseInt(req.body.limit);

        console.log("este es offset: "+offset+" este es limit: "+limit);
        artworkModel.getArtworksArtist((err,data) => {
            if(err){
                res.send(JSON.stringify({status:false, msg: err})); 
            }else{
                res.send(data);
            }
        },cod_artist, offset, limit);
     });

 app.post('/addArtPicture',helpers.canUpload,  uploadImages.single('artImg'),helpers.isLogged, (req, res) => {

      var  titleArt=req.body.titleArt;
      var  autor=req.body.autor;

      var  saleDirectMoney=req.body.saleDirectMoney;
      var  auctionMoney=req.body.auctionMoney;
      
      var  height_artp=req.body.height_art;
      var  width_artp=req.body.width_art;
      var  depth_artp=req.body.depth_art;

      var  tagsThematic=req.body.tagsThematic;
      var  tagsCategory=req.body.tagsCategory;
      var  tagsTechnique=req.body.tagsTechnique;


      var myErrors=[];

      myErrors.push({field: titleArt, msg:'El titulo solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
      myErrors.push({field: autor, msg:'El autor solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });

      myErrors.push({field: titleArt, msg:'El  titulo del arte no puede estar vacio', validatorType: 'noEmpty', params:null });
      myErrors.push({field: autor, msg:'El   autor no puede estar vacio', validatorType: 'noEmpty', params:null });

      myErrors.push({field: saleDirectMoney, msg:'El campo venta directa solo puede contener numeros enteros', validatorType: 'isNumeric', params:null });
      myErrors.push({field: auctionMoney, msg:'El campo subastar obra  solo puede contener numeros enteros', validatorType: 'isNumeric', params:null });

      myErrors.push({field: saleDirectMoney, msg:'Es necesario ingresar monto para venta directa o subasta', validatorType: 'onlyOne', params:{otherField:auctionMoney} });


      myErrors.push({field: saleDirectMoney, msg:'Es necesario que el monto para venta directa o subasta sea mayor a 500 o higual', validatorType: 'greaterThan', params:{min:500} });
      myErrors.push({field: auctionMoney, msg:'Es necesario que el monto para venta directa o subasta sea mayor a 500 o higual', validatorType: 'greaterThan', params:{min:500} });

      myErrors.push({field: height_artp, msg:'Es necesario que la altura sea mayor a 5 cm', validatorType: 'greaterThan', params:{min:5} });
      myErrors.push({field: width_artp, msg:'Es necesario que el ancho sea mayor a 5 cm', validatorType: 'greaterThan', params:{min:5} });
      myErrors.push({field: depth_artp, msg:'Es necesario que la profundiad sea mayor a 5 cm', validatorType: 'greaterThan', params:{min:5} });

      myErrors.push({field: tagsCategory, msg:'Es necesario que almenos elija 1 categoría como tag', validatorType: 'arrayGreaterThan', params:{min:1} });
      myErrors.push({field: tagsThematic, msg:'Es necesario que almenos elija 1 tematica como tag', validatorType: 'arrayGreaterThan', params:{min:1} });
  
try {
    if(req.fileValidationError.length>0){
       var errorFile= req.fileValidationError;
        for(var a in errorFile) {
            myErrors.push({field: null, msg:errorFile[a].msg, validatorType: 'customErros', params:null });
        }
    }
}catch(err){
    if(req.file==undefined){
        myErrors.push({field: null, msg:"Debe cargar una imagen o foto del arte", validatorType: 'customErros', params:null });

    }

}

try {
    var mb=(req.file.size/(1024*1024));
   
if(mb>5){ //20mb
    myErrors.push({field: null, msg:"Solo puede subir imagenes menores a 5 mb", validatorType: 'customErros', params:null });
}
}catch(err){}

 
 
    myErrors = helpers.validators(myErrors);
    if(myErrors.length>0){
         
    myErrors=helpers.serializeValidators(myErrors);
                 
                    res.json({status:false, msg: myErrors}); 
                  try {fs.unlinkSync(req.file.path);}catch(err) {}
     }else{
        path.join( ) 

        

     var extension=req.file.originalname.split('.').pop();
     fs.rename(req.file.path, path.join(__dirname,'../../public/imagesArs/'+req.session.user.cod_ar+'_'+req.file.filename+"."+extension ));
      
     //
     var hoursForDeleteSale=configTime.timeForEraseArtsDirectSale; //normal arion porpuse 24
     var hoursForDeleteAuction=configTime.timeForEraseArtsAuction;//normal arion porpuse 36

     var title_art=titleArt;

     var height_art=height_artp;
     var width_art=width_artp;
     var depth_art=depth_artp;

     if(height_artp == ""){
        height_art=0;
     }
     if(width_art == ""){
        width_art=0;
    }

    if(depth_art == ""){
        depth_art=0;
    }


  
     var author_art=autor;
     var type_art='image';
     var url_art=req.session.user.cod_ar+'_'+req.file.filename+"."+extension;
     var type_sale_art='';
     var minimum_bid_art=auctionMoney;
     var sale_price_art=saleDirectMoney;
     var status_art=true;
     var description_art='';
     var cod_ar2=req.session.user.cod_ar;
     var hours_for_delete=0;

     if(saleDirectMoney>0){
        type_sale_art='direct';
        hours_for_delete=hoursForDeleteSale;
     }else if(auctionMoney>0){
        type_sale_art='auction';
        hours_for_delete=hoursForDeleteAuction;
     }
  
     artworkModel.setArtImageMinutes((err,data) => {
        if(err){
            res.json({status:false, msg: err}); 
        }else{

            var codArt=JSON.parse(JSON.stringify(data))[0]['last_insert_id()'];
            var serTagsCategory=helpers.serializeStringToArray(tagsCategory);
            var serTagsThematic=helpers.serializeStringToArray(tagsThematic);
            var serTagsTechnique=helpers.serializeStringToArray(tagsTechnique);
            console.log("este es el array de tematiocas: "+tagsThematic);
            console.log("este es el array de categorias: "+tagsCategory);
            console.log("este es el array de tecnicas: "+tagsTechnique);
          
            if(serTagsCategory.length>0){
                for(var a=0;a<serTagsCategory.length;a++){
                    tagModel.setTagCategory((err,data) => {},parseInt(serTagsCategory[a]), codArt);
                }
            }

            if(serTagsThematic.length>0){
                for(var a=0;a<serTagsThematic.length;a++){
                    tagModel.setTagThematic((err,data) => { if(err){ console.log(err)}},parseInt(serTagsThematic[a]), codArt);
                }
            }

            if(serTagsTechnique.length>0){
                for(var a=0;a<serTagsTechnique.length;a++){
                    tagModel.setTagTechnique((err,data) => {if(err){ console.log(err)}},parseInt(serTagsTechnique[a]), codArt);
                }
            }

           

            req.flash('alert_success', 'El arte ha sido agregado correctamente');

            res.json({status:true, msg: 'success'}); 

        }},title_art, height_art, width_art, depth_art, author_art, type_art, url_art, type_sale_art,  minimum_bid_art, sale_price_art, status_art, description_art, cod_ar2, hours_for_delete);

     //
    }
           

     });

     app.post('/addArtVideo',helpers.canUpload, uploadVideos.single('videoArt'),helpers.isLogged, (req, res) => {

       

        var  titleArt=req.body.titleArt;
        console.log(titleArt);
        var  autor=req.body.autor;
  
  
        var  saleDirectMoney=req.body.saleDirectMoney;
        var  auctionMoney=req.body.auctionMoney;
        
        var  height_artp=req.body.height_art;
        var  width_artp=req.body.width_art;
        var  depth_artp=req.body.depth_art;
  
        var  tagsThematic=req.body.tagsThematic;
        var  tagsCategory=req.body.tagsCategory;
        var  tagsTechnique=req.body.tagsTechnique;
  
  
  
  
        var myErrors=[];
  
        myErrors.push({field: titleArt, msg:'El titulo solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
        myErrors.push({field: autor, msg:'El autor solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
  
        myErrors.push({field: titleArt, msg:'El  titulo del arte no puede estar vacio', validatorType: 'noEmpty', params:null });
        myErrors.push({field: autor, msg:'El   autor no puede estar vacio', validatorType: 'noEmpty', params:null });
  
        myErrors.push({field: saleDirectMoney, msg:'El campo venta directa solo puede contener numeros enteros', validatorType: 'isNumeric', params:null });
        myErrors.push({field: auctionMoney, msg:'El campo subastar obra  solo puede contener numeros enteros', validatorType: 'isNumeric', params:null });
  
        myErrors.push({field: saleDirectMoney, msg:'Es necesario ingresar monto para venta directa o subasta', validatorType: 'onlyOne', params:{otherField:auctionMoney} });
  
  
        myErrors.push({field: saleDirectMoney, msg:'Es necesario que el monto para venta directa o subasta sea mayor a 500 o higual', validatorType: 'greaterThan', params:{min:500} });
        myErrors.push({field: auctionMoney, msg:'Es necesario que el monto para venta directa o subasta sea mayor a 500 o higual', validatorType: 'greaterThan', params:{min:500} });
  
        myErrors.push({field: height_artp, msg:'Es necesario que la altura sea mayor a 5 cm', validatorType: 'greaterThan', params:{min:5} });
        myErrors.push({field: width_artp, msg:'Es necesario que el ancho sea mayor a 5 cm', validatorType: 'greaterThan', params:{min:5} });
        myErrors.push({field: depth_artp, msg:'Es necesario que la profundiad sea mayor a 5 cm', validatorType: 'greaterThan', params:{min:5} });
  
        myErrors.push({field: tagsCategory, msg:'Es necesario que almenos elija 1 categoría como tag', validatorType: 'arrayGreaterThan', params:{min:1} });
        myErrors.push({field: tagsThematic, msg:'Es necesario que almenos elija 1 tematica como tag', validatorType: 'arrayGreaterThan', params:{min:1} });
    
  try {
      if(req.fileValidationError.length>0){
         var errorFile= req.fileValidationError;
          for(var a in errorFile) {
              myErrors.push({field: null, msg:errorFile[a].msg, validatorType: 'customErros', params:null });
          }
      }
  }catch(err){
      if(req.file==undefined){
          myErrors.push({field: null, msg:"Debe cargar un video del arte", validatorType: 'customErros', params:null });
  
      }
  
  }
  
  try {
      var mb=(req.file.size/(1024*1024));
     
  if(mb>75){ //30mb
      myErrors.push({field: null, msg:"Solo puede subir videos menores a 60 mb", validatorType: 'customErros', params:null });
  }
  }catch(err){}
  
   
   
      myErrors = helpers.validators(myErrors);
      if(myErrors.length>0){
           
      myErrors=helpers.serializeValidators(myErrors);
                   
                      res.json({status:false, msg: myErrors}); 
                    try {fs.unlinkSync(req.file.path);}catch(err) {}
       }else{
                     
       var extension=req.file.originalname.split('.').pop();
       fs.rename(req.file.path, path.join(__dirname,'../../public/videosArs/'+req.session.user.cod_ar+'_'+req.file.filename+"."+extension ));
        
       //
       var hoursForDeleteSale=configTime.timeForEraseArtsDirectSale; //normal arion porpuse 24
       var hoursForDeleteAuction=configTime.timeForEraseArtsAuction; //normal arion porpuse 36
  
       var title_art=titleArt;
  
       var height_art=height_artp;
       var width_art=width_artp;
       var depth_art=depth_artp;
  
       if(height_artp == ""){
          height_art=0;
       }
       if(width_art == ""){
          width_art=0;
      }
  
      if(depth_art == ""){
          depth_art=0;
      }
  
  
    
       var author_art=autor;
       var type_art='video';
       var url_art=req.session.user.cod_ar+'_'+req.file.filename+"."+extension;
       var type_sale_art='';
       var minimum_bid_art=auctionMoney;
       var sale_price_art=saleDirectMoney;
       var status_art=true;
       var description_art='';
       var cod_ar2=req.session.user.cod_ar;
       var hours_for_delete=0;
  
       if(saleDirectMoney>0){
          type_sale_art='direct';
          hours_for_delete=hoursForDeleteSale;
       }else if(auctionMoney>0){
          type_sale_art='auction';
          hours_for_delete=hoursForDeleteAuction;
       }
    
       artworkModel.setArtImageMinutes((err,data) => {
          if(err){
              res.json({status:false, msg: err}); 
          }else{
  
              var codArt=JSON.parse(JSON.stringify(data))[0]['last_insert_id()'];
              var serTagsCategory=helpers.serializeStringToArray(tagsCategory);
              var serTagsThematic=helpers.serializeStringToArray(tagsThematic);
              var serTagsTechnique=helpers.serializeStringToArray(tagsTechnique);
              console.log("este es el array de tematiocas: "+tagsThematic);
              console.log("este es el array de categorias: "+tagsCategory);
              console.log("este es el array de tecnicas: "+tagsTechnique);
            
              if(serTagsCategory.length>0){
                  for(var a=0;a<serTagsCategory.length;a++){
                      tagModel.setTagCategory((err,data) => {},parseInt(serTagsCategory[a]), codArt);
                  }
              }
  
              if(serTagsThematic.length>0){
                  for(var a=0;a<serTagsThematic.length;a++){
                      tagModel.setTagThematic((err,data) => { if(err){ console.log(err)}},parseInt(serTagsThematic[a]), codArt);
                  }
              }
  
              if(serTagsTechnique.length>0){
                  for(var a=0;a<serTagsTechnique.length;a++){
                      tagModel.setTagTechnique((err,data) => {if(err){ console.log(err)}},parseInt(serTagsTechnique[a]), codArt);
                  }
              }
  
              req.flash('alert_success', 'El arte ha sido agregado correctamente');
  
              res.json({status:true, msg: 'success'}); 
  
          }},title_art, height_art, width_art, depth_art, author_art, type_art, url_art, type_sale_art,  minimum_bid_art, sale_price_art, status_art, description_art, cod_ar2, hours_for_delete);
  
       //
       
  
                      
  
      }
             
  
       });

 
  
       /////////////////////////////////////////////////////notifications
app.post('/getNotificationsArtist',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;

    notificationModel.getNotificationsArtist((err,data) => {
        if(err){
           // res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send(data);
        }
    },cod_buyer);
 
  });

  app.post('/getNotificationsArtistCount',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;

    notificationModel.getNotificationsArtistCount((err,data) => {
        if(err){
           // res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send(data);
        }
    },cod_buyer);
 
  });

  

  app.post('/setReadNotificationArtist',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;

    var  notifiId=req.body.notifiId;
    var  readORNot=req.body.readORNot;
    var  link=req.body.link;
    var  description=req.body.description;

    notificationModel.setReadNotificationArtist((err,data) => {
        if(err){
           // res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
            req.flash('alert_info', description);
            res.send(true);
           
           // res.redirect('/'+link);
        }else{
            req.flash('alert_info', description);
            res.send(true);
           
         //   res.redirect('/'+link);
        }
    },notifiId);
 
  });

    

    /////////////////////////////////////////////////////notifications likes
app.post('/getNotificationsBuyerLikes',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;

    notificationModel.getNotificationsBuyerLikes((err,data) => {
        if(err){
           // res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send(data);
        }
    },cod_buyer);
 
  });

  app.post('/getNotificationsBuyerCountLikes',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;

    notificationModel.getNotificationsBuyerCountLikes((err,data) => {
        if(err){
           // res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send(data);
        }
    },cod_buyer);
 
  });

  

  app.post('/setReadNotificationBuyerLikes',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;
    var  notifiId=req.body.notifiId;

    notificationModel.setReadNotificationBuyerLikes((err,data) => {
        if(err){
           // res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        
            res.send(true);
           
           // res.redirect('/'+link);
        }else{
           
            res.send(true);
           
         //   res.redirect('/'+link);
        }
    },notifiId);
 
  });


  app.post('/getArtistNotificationList',helpers.isLogged,(req, res) => {
    var cod_artist=req.session.user.cod_ar;
    var limit=req.body.limit;
    var cantToShow=req.body.cantToShow;

    var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

    notificationModel.getArtistNotificationList((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
        }else{
            notificationModel.getArtistNotificationListCount((err,numberData) => {
                if(err){
                    res.send(JSON.stringify({status:false, msg: err})); 
                }else{
    
                    res.send({data:data,count:numberData.length} );
                }
            },cod_artist);
        }
    },cod_artist, newLimit,cantToShow);
});
 

app.post('/getArtistNotificationsLikesList',helpers.isLogged,(req, res) => {
    var cod_artist=req.session.user.cod_ar;
    var limit=req.body.limit;
    var cantToShow=req.body.cantToShow;

    var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

    notificationModel.getArtistNotificationsLikesList((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
        }else{
            notificationModel.getArtistNotificationsLikesListCount((err,numberData) => {
                if(err){
                    res.send(JSON.stringify({status:false, msg: err})); 
                }else{
    
                    res.send({data:data,count:numberData.length} );
                }
            },cod_artist);
        }
    },cod_artist, newLimit,cantToShow);
});
    


app.post('/getArtsLikesMostPopular',helpers.isLogged,(req, res) => {
    var cod_buyer=req.session.user.cod_ar;
    var  limit=req.body.limit;

    artworkModel.getArtsLikesMostPopular((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send({data:data});
        }
    },cod_buyer,limit);
 
  });

  app.post('/getInfoArtistAside',helpers.isLogged,(req, res) => {
    var cod_artist=req.session.user.cod_ar;
 

    artworkModel.getInfoArtistAside((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
            console.log(err);
        }else{
            res.send({data:data});
        }
    },cod_artist);
 
  });

  ///

  app.post('/artsMorePopularList',helpers.isLogged,(req, res) => {
    var cod_artist=req.session.user.cod_ar;
    var limit=req.body.limit;
    var cantToShow=req.body.cantToShow;

    var newLimit=(parseInt(limit-1))*parseInt(cantToShow);

    artworkModel.artsMorePopularList((err,data) => {
        if(err){
            res.send(JSON.stringify({status:false, msg: err})); 
        }else{
            artworkModel.artsMorePopularListCount((err,numberData) => {
                if(err){
                    res.send(JSON.stringify({status:false, msg: err})); 
                }else{
                    res.send({data:data,count:numberData.length} );
                }
            });
        }
    }, newLimit,cantToShow);
});


app.post('/eraseArtForId',helpers.isLogged,(req, res) => {
    var idArt=req.body.idArt;

    artworkModel.validateStatusBid((err,data) => {
        if(err){
            console.log(JSON.stringify(err));
            req.flash('alert_danger', 'Ocurrio un error');
            res.redirect('/buyers-bid/'+cod_art);
        }else{
           
            if(data.length>0){
              
                artworkModel.eraseArt((err,data) => {
                    if(err){
                        req.flash('alert_info', 'El arte no puede ser eliminado ya que se encuentra en proceso de venta/subasta o ya ha sido eliminada de Antares.');
                        res.redirect('/artist');
                    }else{
                        req.flash('alert_success', 'Se ha eliminado el arte correctamente.');
                        res.redirect('/artist');        
                    }

                },idArt);

            }else{
                req.flash('alert_info', 'El arte no puede ser eliminado ya que se encuentra en proceso de venta/subasta o ya ha sido eliminada de Antares.');
                res.redirect('/artist');
            }
        }
},idArt);

});

};

