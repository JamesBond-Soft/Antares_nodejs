$( document ).ready(function() {

    $('.go-top').click(function(){
$('body, html').animate({
    scrollTop: '0px'
}, 300);
    });

    $(window).scroll(function(){
if($(this).scrollTop() > 0){
    $('.go-top').slideDown(300);

}else{
    $('.go-top').slideUp(300);
}
    });

});