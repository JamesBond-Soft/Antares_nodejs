
$( document ).ready(function() {

    $("#login-btn-top").hide();
    $("#register-btn-top").hide();

$("#form-login").hide();
$("#form-register").hide();

    $( "#login-btn" ).click(function() {
        $("#form-init").hide();
        $("#strores-form").hide();
        $( "#form-login" ).fadeIn( "slow", function() {});
        $( "#register-btn-top" ).fadeIn( "slow", function() {});
      });

      $( "#register-btn" ).click(function() {
        $("#form-init").hide();
        $("#strores-form").hide();
        $( "#form-register" ).fadeIn( "slow", function() {});
        $( "#login-btn-top" ).fadeIn( "slow", function() {});
      });

      $( "#login-btn-top" ).click(function() {
        $("#login-btn-top").hide();
        $("#form-init").hide();
        $("#strores-form").hide();
        $( "#form-login" ).fadeIn( "slow", function() {});
        $("#form-register").hide();
        $( "#register-btn-top" ).fadeIn( "slow", function() {});
       
    
      });

      $( "#register-btn-top" ).click(function() {
        $("#register-btn-top").hide();
        $("#form-init").hide();
        $("#strores-form").hide();
        $( "#form-register" ).fadeIn( "slow", function() {});
        $( "#login-btn-top" ).fadeIn( "slow", function() {});
        $("#form-login").hide();
      });
   

      
});
