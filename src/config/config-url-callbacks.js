let base_url='https://antaresssl-1949576132.us-east-2.elb.amazonaws.com';

const config = {
paypal_return_url: base_url+'/payDirectSuccess',
paypal_cancel_url: base_url+'/payDirectCancel',

payAuctionSuccess: base_url+'/payAuctionSuccess',
payAuctionCancel: base_url+'/payAuctionCancel',

passport_url_facebook: base_url+'/auth/facebook/callback' ,
passport_url_twitter: base_url+'/auth/twitter/callback',
base_url: base_url+'/'

};
module.exports = config;