const helpers = require('../helpers/helpers');
const  artistModel = require('../models/artistModel');
const  buyerModel = require('../models/buyerModel');

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



var uploadImages = multer({ dest: path.join(__dirname,'../../tmp' ), fileFilter: fileFilterImage});

module.exports = (app, passport) => {

    app.get('/buyers-profile',helpers.isLogged, (req, res) => {


        artistModel.getArtist((err,data) => {
          
        
            if(err){
                res.redirect('/');
            }else{
                        
        res.render('buyers/buyers-profile',{
            alert_success: req.flash('alert_success'),
            alert_info: req.flash('alert_info'),
            alert_warning: req.flash('alert_warning'),
            alert_danger: req.flash('alert_danger'),
            tab: req.flash('tab'),
            data:data[0]
        });
        }

        },req.session.user.cod_ar);
        
    });


app.post('/updateInfoPersonalBuyer',uploadImages.single('image_ar'),helpers.isLogged, (req, res) => {
    
var name_ar=req.body.name_ar;
var email_ar=req.body.email_ar;
var image_final=req.body.image_ar_tmp;

var myErrors=[];

myErrors.push({field: name_ar, msg:'El nombre solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: email_ar, msg:'El formato de email no es valido', validatorType: 'isEmail', params:null });

myErrors.push({field: name_ar, msg:'El  nombre no puede estar vacio', validatorType: 'noEmpty', params:null });
myErrors.push({field: email_ar, msg:'El   email no puede estar vacio', validatorType: 'noEmpty', params:null });

artistModel.checkIfExistLocalForUpdate((err,data) => {
    if(err){
        console.log('este es el error: '+err);
     }else{
               if(data.length>0){
              
myErrors.push({field: null, msg:'El email ya esta siendo utilizado porfavor intento con otro', validatorType: 'customErros', params:null });
               }
    }


//errors upload image
try {
    if(req.fileValidationError.length>0){
       var errorFile= req.fileValidationError;
        for(var a in errorFile) {
            myErrors.push({field: null, msg:errorFile[a].msg, validatorType: 'customErros', params:null });
        }
    }
}catch(err){


}

//validate mb image
try {
    var mb=(req.file.size/(1024*1024));
   
if(mb>5){ //5mb
    myErrors.push({field: null, msg:"Solo puede subir imagenes menores a 5 mb", validatorType: 'customErros', params:null });
}
}catch(err){ }


myErrors = helpers.validators(myErrors);
if(myErrors.length>0){
     
myErrors=helpers.serializeValidators(myErrors);

try {fs.unlinkSync(req.file.path);}catch(err) { }
req.flash('tab','tab1');
req.flash('alert_danger', myErrors);
res.redirect('/buyers-profile');
 }else{
  
  
    if(req.file!=undefined){
        var extension=req.file.originalname.split('.').pop();
    fs.rename(req.file.path, path.join(__dirname,'../../public/imagesUsers/'+req.session.user.cod_ar+'_'+req.file.filename+"."+extension));
    image_final=req.session.user.cod_ar+'_'+req.file.filename+"."+extension;
    }

  

    
artistModel.updateInfoPersonal((err,data) => {
    if(err){
        console.log('este es el error: '+err);
     }else{
        buyerModel.updateInfoPersonal((err,data) => {
            if(err){
                console.log('este es el error: '+err);
             }else{
                req.session.user.image_ar=image_final;
                req.session.user.name_ar=name_ar;
                req.session.user.email_ar=email_ar;
                req.flash('tab','tab1');
                req.flash('alert_success', 'Actualizado correctamente');
                res.redirect('/buyers-profile');
             }
            },req.session.user.cod_ar, email_ar, name_ar, image_final);
     }
    },req.session.user.cod_ar, email_ar, name_ar, image_final);
 }

},email_ar,req.session.user.cod_ar);


    });


app.post('/updateInfoPaymentsBuyer',helpers.isLogged, (req, res) => {

var paypal_account_ar=req.body.paypal_account_ar;
var bank_beneficiary=req.body.bank_beneficiary;
var bank_clabe=req.body.bank_clabe;
var bank_name=req.body.bank_name;

var method=req.body.method;

var myErrors=[];

var bankObject;

if(method=='paypal'){

    myErrors.push({field: paypal_account_ar, msg:'El formato de la cuenta paypal no es valido', validatorType: 'isEmail', params:null });
    myErrors.push({field: paypal_account_ar, msg:'La cuenta paypal no puede estar vacia', validatorType: 'noEmpty', params:null });

}else if(method=='bank'){
    myErrors.push({field: bank_beneficiary, msg:'El nombre de beneficiario solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
    myErrors.push({field: bank_clabe, msg:'La clabe solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
    myErrors.push({field: bank_name, msg:'La institucion bancaria solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
  
    myErrors.push({field: bank_beneficiary, msg:'El nombre de beneficiario no puede estar vacio', validatorType: 'noEmpty', params:null });
    myErrors.push({field: bank_clabe, msg:'La clabe no puede estar vacia', validatorType: 'noEmpty', params:null });
    myErrors.push({field: bank_name, msg:'La institucion bancaria no puede estar vacia', validatorType: 'noEmpty', params:null });


}else{
    myErrors.push({field: null, msg:"Para guardar debe almenos elejir un metodo de pago", validatorType: 'customErros', params:null });
}

bankObject={
    bank_beneficiary:bank_beneficiary,
    bank_clabe: bank_clabe,
    bank_name: bank_name
};

myErrors = helpers.validators(myErrors);
if(myErrors.length>0){
     
myErrors=helpers.serializeValidators(myErrors);
req.flash('alert_danger', myErrors);
req.flash('tab','tab2');
res.redirect('/buyers-profile');


}else{
   

    
    artistModel.updateInfoPayments((err,data) => {
        if(err){
            console.log('este es el error: '+err);
         }else{
            buyerModel.updateInfoPayments((err,data) => {
                if(err){
                    console.log('este es el error: '+err);
                 }else{
                    req.flash('tab','tab2');
                    req.flash('alert_success', 'Actualizado correctamente');
                    res.redirect('/buyers-profile');
                 }
                },req.session.user.cod_ar, paypal_account_ar, JSON.stringify(bankObject), method);
         }
        },req.session.user.cod_ar, paypal_account_ar, JSON.stringify(bankObject), method);
}

});


app.post('/updateInfoShipmentBuyer',helpers.isLogged, (req, res) => {

 var name_receiver=req.body.name_receiver;
 var street=req.body.street;
 var no_ext=req.body.no_ext;
 var no_int=req.body.no_int;
 var zip_code=req.body.zip_code;
 var city= req.body.city;
 var province=req.body.province;
 var country=req.body.country;
 var delegation=req.body.delegation;
 var phone=req.body.phone;
 var details=req.body.details;
 var myErrors=[];

myErrors.push({field: name_receiver, msg:'El campo nombre de receptor solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: street, msg:'El campo calle solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: no_ext, msg:'El campo exterior solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: no_int, msg:'El campo interior solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: zip_code, msg:'El campo código postal solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: city, msg:'El campo ciudad solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: province, msg:'El campo estado o provincia solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: country, msg:'El campo país solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: delegation, msg:'El campo municipio o delegación solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: phone, msg:'El campo teléfono de contacto solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
myErrors.push({field: details, msg:'El campo detalles adicionales solo puede contener caracteres alfanumericos', validatorType: 'alpanumericSpaces', params:null });
    

myErrors.push({field: name_receiver, msg:'El campo nombre de receptor no puede estar vacio', validatorType: 'noEmpty', params:null });
myErrors.push({field: street, msg:'El campo calle no puede estar vacio', validatorType: 'noEmpty', params:null });
myErrors.push({field: zip_code, msg:'El campo código postal no puede estar vacio', validatorType: 'noEmpty', params:null });
myErrors.push({field: city, msg:'El campo ciudad no puede estar vacio', validatorType: 'noEmpty', params:null });
myErrors.push({field: province, msg:'El campo estado o provincia no puede estar vacio', validatorType: 'noEmpty', params:null });
myErrors.push({field: country, msg:'El campo país no puede estar vacio', validatorType: 'noEmpty', params:null });
myErrors.push({field: delegation, msg:'El campo municipio o delegación no puede estar vacio', validatorType: 'noEmpty', params:null });
myErrors.push({field: phone, msg:'El campo teléfono de contacto no puede estar vacio', validatorType: 'noEmpty', params:null });
  
   
      
   var  dataShipment={
     name_receiver: req.body.name_receiver,
     street: req.body.street,
     no_ext: req.body.no_ext,
     no_int: req.body.no_int,
     zip_code: req.body.zip_code,
     city: req.body.city,
     province: req.body.province,
     country: req.body.country,
     delegation: req.body.delegation,
     phone: req.body.phone,
     details: req.body.details};
 
    
    myErrors = helpers.validators(myErrors);

    if(myErrors.length>0){
         
    myErrors=helpers.serializeValidators(myErrors);
    req.flash('tab','tab4');
    req.flash('alert_danger', myErrors);
    res.redirect('/buyers-profile');
    
    
    }else{
       
    
        
        artistModel.updateInfoShipment((err,data) => {
            if(err){
                console.log('este es el error: '+err);
             }else{
                buyerModel.updateInfoShipment((err,data) => {
                    if(err){
                        console.log('este es el error: '+err);
                     }else{
                        req.flash('tab','tab4');
                        req.flash('alert_success', 'Actualizado correctamente');
                        res.redirect('/buyers-profile');
                     }
                    },req.session.user.cod_ar, JSON.stringify(dataShipment));
             }
            },req.session.user.cod_ar, JSON.stringify(dataShipment));
    }
    
    });


    
};