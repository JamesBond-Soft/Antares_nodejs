const helpers = require('../helpers/helpers');
const  artworkModel = require('../models/artworkModel');
const  saleModel = require('../models/saleModel');
const  auctionModel = require('../models/auctionModel');
const  notificationModel = require('../models/notificationModel');
const  configTime = require('../../config/config-time');

var fs = require('fs');
var CronJob = require('cron').CronJob;


module.exports = (app, passport) => {
  
     //every 1 seconds delete arworks time over and idle status
    const job = new CronJob('*/1 * * * * *', () =>{
   
      artworkModel.getArworksTimeOverAndIdleStatus((err,data) => {
        job.stop();
        if(err){
          job.stop();
          console.log("error in cron job 1:");
          console.log(JSON.stringify(err));
        }else{
          var worksDeleteBd=[];
          var worksDeleteResources=[];

          for(var i=0; i<data.length; i++){
         
            worksDeleteResources.push(
               new Promise(function(resolve, reject) {
                    if(data[i].type_art=='image'){
                      fs.unlink('./src/public/imagesArs/'+data[i].url_art, function() {
                        if (err) {
                          reject(err);
                      } else {
                          resolve(true);
                      }
                      });
                    }else{
                      fs.unlink('./src/public/videosArs/'+data[i].url_art, function() {
                        if (err) {
                          reject(err);
                      } else {
                          resolve(true);
                      }
                      });
                    }
              })
              );

              worksDeleteBd.push(

                new Promise(function(resolve, reject) {
                  artworkModel.deleteArtwork((err,response) => {
                    if(err){
                      job.stop();
                      console.log("error in cron job 1:");
                      console.log(JSON.stringify(err));
                    }else{
                      if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                    }
                   },data[i].cod_art)

                })
              );
          }

          Promise.all(worksDeleteResources).then(values => { 
            Promise.all(worksDeleteBd).then(values => { 
              job.start();
            });
          });
        }
    });
    });
    job.start();

    //every 1 seconds CHECK WINNERS AUCTIONS
   const job2 = new CronJob('*/1 * * * * *', () =>{

    var mastersProimises=[];

    var updateStatusAuction=[];
    var updateStatusArt=[];
 

    var updateStatusAuctionLose=[];

    var notificationsArtist=[];
    var notificationsBuyerWin=[];
    var notificationsBuyerLose=[];

    artworkModel.getArworksForKnowWinner((err,data) => {
      job2.stop();
      if(err){
        job2.stop();
        console.log("error in cron job 2:");
        console.log(JSON.stringify(err));
      }else{

        artworkModel.getArworksForKnowWinner2((err,dataForLoses) => {
          if(err){
            job2.stop();
            console.log("error in cron job 2:");
            console.log(JSON.stringify(err));
          }else{

        for(var i=0; i<data.length; i++){
          var flagPush=true;
         
      mastersProimises.push(
       new Promise(function(resolve, reject) {
      artworkModel.getArworkForKnowWinnerById((err,data2) => {
  
        if(err){
          reject(err);
          job2.stop();
          console.log("error in cron job 2:");
          console.log(JSON.stringify(err));
        }else{


            for(var i2=0; i2<data2.length; i2++){
           if(i2==0){//is winner
      /////////update auction status
      updateStatusAuction.push(
        new Promise(function(resolve, reject) {
          auctionModel.updateArtStatusPendingPaidAuction((err,response) => {
            if(err){
              job2.stop();
              console.log("error in cron job 1:");
              console.log(JSON.stringify(err));
            }else{
              if (err) {
                reject(err);
            } else {
                resolve(true);
            }
            }
           },data2[i2].cod_au)
        })
      );
        /////////update artwork status
      updateStatusAuction.push(
      new Promise(function(resolve, reject) {
            artworkModel.updateArtStatusPendingPaidAuction((err,response) => {
              if(err){
                job2.stop();
                console.log("error in cron job 1:");
                console.log(JSON.stringify(err));
              }else{
                if (err) {
                  reject(err);
              } else {
                  resolve(true);
              }
              }
             },data2[i2].cod_art)
          })
        );
                  /////////send notifications artist
                  if(i>=data.length && flagPush){
                    notificationsArtist.push(
                      new Promise(function(resolve, reject) {
                    //artist vars for notification
                    var  cod_type_user_no_artist=data2[i2].cod_bu3;
                    var  title_no_artist='La subasta de  tu  obra: '+data2[i2].title_art+" - "+data2[i2].measurements+" ha sido cerrada en "+helpers.setFormatMoneyMxn(data2[i2].amount_au);
                    var  description_no_artist="La subasta de tu obra: "+data2[i2].title_art+" - "+data2[i2].measurements+" ha sido cerrada por el monto de "+helpers.setFormatMoneyMxn(data2[i2].amount_au)+" ahora a entrado en etapa de pago por parte del comprador"; 
                    var  type_no_artist='setSendBuyer';
                    var  url_no_artist='artist-pending-auctions';
                    var  code_insert_artist=data2[i2].cod_ar2;
                    helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);
                     resolve(true);
                             })
                           );
                  }

               
                   /////////send notifications buyers winner
                   if(i>=data.length && flagPush){
                    notificationsBuyerWin.push(
                      new Promise(function(resolve, reject) {
                    //buyer vars for notification
                    var  cod_type_user_no_buyer=data2[i2].cod_ar2;
                    var  title_no_buyer='Felicidades has ganado la subasta de: '+data2[i2].title_art+" - "+data2[i2].measurements;
                    var  description_no_buyer='Ganaste la subasta de '+data2[i2].title_art+" - "+data2[i2].measurements+" con tu oferta de "+helpers.setFormatMoneyMxn(data2[i2].amount_au)+" ahora la subasta ha entrado en proceso de pago es muy importante que pagues la subasta que has ganado";
                    var  type_no_buyer='newAuctionBid';
                    var  url_no_buyer='buyers-paid-pending-auction';
                    var  code_insert_buyer=data2[i2].cod_bu3;
                    helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
                     resolve(true);
                         })
                     );
                   }
              
           }else{ //is lose

               /////////update auction status
        updateStatusAuctionLose.push(
        new Promise(function(resolve, reject) {
          auctionModel.updateArtStatusLoseAuction((err,response) => {
            if(err){
              job2.stop();
              console.log("error in cron job 1:");
              console.log(JSON.stringify(err));
            }else{
              if (err) {
                reject(err);
            } else {
                resolve(true);
            }
            }
           },data2[i2].cod_au)
        })
        );

 
            }
            flagPush=false;
            
            }
         
           
            resolve(true);
          }

   
          },data[i].cod_art);

        }));
        }
      }

   
        ///////////////
        Promise.all(mastersProimises).then(values => { 
          Promise.all(updateStatusAuction).then(values => { 
            Promise.all(updateStatusArt).then(values => { 
              Promise.all(updateStatusAuctionLose).then(values => {
            
                for(var i=0; i<dataForLoses.length; i++){
                  artworkModel.getArworkForKnowWinnerById2((err,data2) => {

                    for(var i2=0; i2<data2.length; i2++){
                      if(i2!=0){
                        notificationsBuyerLose.push(
                          new Promise(function(resolve, reject) {
                        var  cod_type_user_no_buyer=data2[i2].cod_ar2;
                        var  title_no_buyer='La subasta de  la  obra: '+data2[i2].title_art+" - "+data2[i2].measurements+" ha sido cerrada en: "+helpers.setFormatMoneyMxn(data2[0].max_amount);
                        var  description_no_buyer='No has ganado la subasta de '+data2[i2].title_art+" - "+data2[i2].measurements+" con la oferta de "+helpers.setFormatMoneyMxn(data2[i2].max_amount);
                        var  type_no_buyer='newAuctionBid';
                        var  url_no_buyer='buyers';
                        var  code_insert_buyer=data2[i2].cod_bu3;
                        helpers.sendNotificationBuyer( cod_type_user_no_buyer, description_no_buyer, title_no_buyer, type_no_buyer, url_no_buyer, code_insert_buyer);
                         resolve(true);
                             })
                         );
                      }
                    }
                  },dataForLoses[i].cod_art);
                }
         
                Promise.all(notificationsArtist).then(values => { 
                  Promise.all(notificationsBuyerWin).then(values => { 
                    Promise.all(notificationsBuyerLose).then(values => { 
                      job2.start();
                    });
                  });
                });
              });
            });
          });
        });

      })//
      }
     })  
   });
    job2.start();

    ///////////////////////////check test data

    const job3 = new CronJob('*/1 * * * * *', () =>{
      var minutesToFinishStatusTest=configTime.timeForTestArts;
      var updateStatusArts=[];

      var updateStatusAuction=[];
      var updateStatusSaleDirect=[];

      var notifications=[];

      artworkModel.getArtsInTestCron((err,response) => {
        job3.stop();
        if(err){
          job3.stop();
          console.log("error in cron job 3:");
          console.log(JSON.stringify(err));
        }else{

          for(var i=0; i<response.length; i++){
            if(response[i].type_sale_art=="direct"){
   
     updateStatusSaleDirect.push(
   new Promise(function(resolve, reject) {
  saleModel.updateArtStatusPendingReviewSale((err,data) => {
    if(err){
      job3.stop();
      console.log("error in cron job 3:");
      console.log(JSON.stringify(err));
      reject(err);
    }else{
      resolve(true);
    }
  },response[i].id_sale)}));

            }else{
     updateStatusAuction.push(
                new Promise(function(resolve, reject) {
                  auctionModel.updateArtStatusPendingReviewAuction((err,data) => {
                 if(err){
                   job3.stop();
                   console.log("error in cron job 3:");
                   console.log(JSON.stringify(err));
                   reject(err);
                 }else{
                   resolve(true);
                 }
               },response[i].id_auction)}));
            }
////////update arts
updateStatusArts.push(
  new Promise(function(resolve, reject) {
    artworkModel.updateArtPendingReviewStatus((err,data) => {
   if(err){
     job3.stop();
     console.log("error in cron job 3:");
     console.log(JSON.stringify(err));
     reject(err);
   }else{
     resolve(true);
   }
 },response[i].cod_art)}));

 ///////////notifications artsist
 notifications.push(
  new Promise(function(resolve, reject) {
    var  cod_type_user_no_artist=null;
  if(response[i].type_sale_art=="direct"){
    cod_type_user_no_artist=response[i].cod_bu4;
  }else{
    cod_type_user_no_artist=response[i].cod_bu3;
  }
    var  title_no_artist='El tiempo de prueba del comprador de tu obra: '+response[i].title_art+" - "+response[i].measurements+" ha terminado ";
    var  description_no_artist="El tiempo de prueba del comprador de tu obra: "+response[i].title_art+" - "+response[i].measurements+" ha terminado ahora será abonado a tus transferencias pendientes el monto correspondiente"; 
    var  type_no_artist='setSendBuyer';
    var  url_no_artist='artist-arts-bought';
    var  code_insert_artist=response[i].cod_ar2;
    helpers.sendNotificationArtist( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);


     resolve(true);
  })
 );

  ///////////notifications buyers
  notifications.push(
    new Promise(function(resolve, reject) {

      var cod_type_user_no_artist=response[i].cod_ar2;
      var  title_no_artist='El tiempo de prueba de la obra: '+response[i].title_art+" - "+response[i].measurements+" ha terminado ";
      var  description_no_artist="El tiempo de prueba de la obra: "+response[i].title_art+" - "+response[i].measurements+" ha terminado ahora será abonado el monto correspondiente al creador, te invitamos a que le des una calificación al creador"; 
      var  type_no_artist='setSendBuyer';
      var  url_no_artist='buyers-in-test';
      var  code_insert_artist=null;
      if(response[i].type_sale_art=="direct"){
        code_insert_artist=response[i].cod_bu4;
      }else{
        code_insert_artist=response[i].cod_bu3;
      }

      helpers.sendNotificationBuyer( cod_type_user_no_artist, description_no_artist, title_no_artist, type_no_artist, url_no_artist,code_insert_artist);
       resolve(true);
    })
   );

          }
 
          Promise.all(updateStatusAuction).then(values => { 
            Promise.all(updateStatusSaleDirect).then(values => { 
              Promise.all(updateStatusArts).then(values => { 
                Promise.all(notifications).then(values => { 
                  job3.start();
                });
              });
            });
          });

        }
       },minutesToFinishStatusTest);

    });
    job3.start();

};