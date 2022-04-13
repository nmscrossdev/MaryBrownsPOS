$(window).bind("load resize", function() {
  selfCheckoutJs();
});
function selfCheckoutJs(){
  var windowSize = $(window).height();

  // Sale Complete Page Height Set
  if(windowSize <= 900) {
    $(".self-checkout-all-product").height(windowSize - ($(".payment-page-title").height() + $(".payment-button-group").outerHeight() + 185));
  }
  else {
    $(".self-checkout-all-product").height(400);
  }

  var selfcheckoutparent = $(".self-checkout-content").height();
  $(".self-checkout-scroll-1").height(selfcheckoutparent);
  $(".self-checkout-scroll-2").height(selfcheckoutparent - ($(".widget-search").height() + 50));
  $(".self-checkout-table-scroll").height(187);

  var selfcheckoutparent2 = $(".self-checkout-content2").height();
  $(".self-checkout-scroll-12").height(selfcheckoutparent2);
  $(".self-checkout-scroll-22").height(windowSize - ($(".widget-search").height() + 45));
  
  if(windowSize <= 800) {
    $(".self-checkout-all-product2").height(windowSize - 430);
  }
  else if(windowSize <= 600) {
    $(".self-checkout-all-product2").height(350);
  }
  else {
    $(".self-checkout-all-product2").height(485);
  }  
    //console.log(windowSize);
    // if(windowSize <= 900) {
    //   $(".self-checkout-all-product2").height(windowSize - ($(".payment-button-group").outerHeight() + 300));
    // }
    // else {
    //   $(".self-checkout-all-product2").height(485);
    // }

    //Payment Option
    // if(windowSize <= 900) {
    //   $(".payment-otp").height(windowSize - ($(".payment-page-title").outerHeight() + $(".spacer-40").outerHeight() + $(".payment-footer").outerHeight() + 300));
    // }
    // else {
      $(".payment-otp").height(350);
      var SetHeightCart = $(".card.card-sc-profile .card-header").outerHeight() +  $(".card.card-sc-profile .card-footer").outerHeight() + $(".card.card-sc-profile .container-fluid.card-sc-total").outerHeight() + 70 + 27;
      if(windowSize <= 700) {
        var SetHeightCart = $(".card.card-sc-profile .card-header").outerHeight() +  $(".card.card-sc-profile .card-footer").outerHeight() + $(".card.card-sc-profile .container-fluid.card-sc-total").outerHeight() + 55;
      }     
      $(".SetHeightCart").height(windowSize - SetHeightCart);
} 


// $('.form-wizard-next-btn').click(function() {

//   var parentFieldset = jQuery(this).parents('.wizard-fieldset');
//   var currentActiveStep = jQuery(this).parents('.form-wizard').find('.form-wizard-steps .active');
//   var next = jQuery(this);
//   var nextWizardStep = true;
//   parentFieldset.find('.wizard-required').each(function(){
//     var thisValue = jQuery(this).val();

//     if( thisValue == "") {
//       jQuery(this).siblings(".wizard-form-error").slideDown();
//       nextWizardStep = false;
//     }
//     else {
//       jQuery(this).siblings(".wizard-form-error").slideUp();
//     }
//   });
//   if( nextWizardStep) {
//     next.parents('.wizard-fieldset').removeClass("show","400");
//     currentActiveStep.removeClass('active').addClass('activated').next().addClass('active',"400");
//     next.parents('.wizard-fieldset').next('.wizard-fieldset').addClass("show","400");
//     jQuery(document).find('.wizard-fieldset').each(function(){
//       if(jQuery(this).hasClass('show')){
//         var formAtrr = jQuery(this).attr('data-tab-content');
//         jQuery(document).find('.form-wizard-steps .form-wizard-step-item').each(function(){
//           if(jQuery(this).attr('data-attr') == formAtrr){
//             jQuery(this).addClass('active');
//             var innerWidth = jQuery(this).innerWidth();
//             var position = jQuery(this).position();
//             jQuery(document).find('.form-wizard-step-move').css({"left": position.left, "width": innerWidth});
//           }else{
//             jQuery(this).removeClass('active');
//           }
//         });
//       }
//     });
//   }
// });

// jQuery('.form-wizard-next-btn').click(function() {
//   var parentFieldset = jQuery(this).parents('.wizard-fieldset');
//   var currentActiveStep = jQuery(this).parents('.form-wizard').find('.form-wizard-steps .active');
//   var next = jQuery(this);
//   var nextWizardStep = true;
//   parentFieldset.find('.wizard-required').each(function(){
//     var thisValue = jQuery(this).val();

//     if( thisValue == "") {
//       jQuery(this).siblings(".wizard-form-error").slideDown();
//       nextWizardStep = false;
//     }
//     else {
//       jQuery(this).siblings(".wizard-form-error").slideUp();
//     }
//   });
//   if( nextWizardStep) {
//     next.parents('.wizard-fieldset').removeClass("show","400");
//     currentActiveStep.removeClass('active').addClass('activated').next().addClass('active',"400");
//     next.parents('.wizard-fieldset').next('.wizard-fieldset').addClass("show","400");
//     jQuery(document).find('.wizard-fieldset').each(function(){
//       if(jQuery(this).hasClass('show')){
//         var formAtrr = jQuery(this).attr('data-tab-content');
//         jQuery(document).find('.form-wizard-steps .form-wizard-step-item').each(function(){
//           if(jQuery(this).attr('data-attr') == formAtrr){
//             jQuery(this).addClass('active');
//             var innerWidth = jQuery(this).innerWidth();
//             var position = jQuery(this).position();
//             jQuery(document).find('.form-wizard-step-move').css({"left": position.left, "width": innerWidth});
//           }else{
//             jQuery(this).removeClass('active');
//           }
//         });
//       }
//     });
//   }
// });
// jQuery('.form-wizard-previous-btn').click(function() {
//   var counter = parseInt(jQuery(".wizard-counter").text());;
//   var prev =jQuery(this);
//   var currentActiveStep = jQuery(this).parents('.form-wizard').find('.form-wizard-steps .active');
//   prev.parents('.wizard-fieldset').removeClass("show","400");
//   prev.parents('.wizard-fieldset').prev('.wizard-fieldset').addClass("show","400");
//   currentActiveStep.removeClass('active').prev().removeClass('activated').addClass('active',"400");
//   jQuery(document).find('.wizard-fieldset').each(function(){
//     if(jQuery(this).hasClass('show')){
//       var formAtrr = jQuery(this).attr('data-tab-content');
//       jQuery(document).find('.form-wizard-steps .form-wizard-step-item').each(function(){
//         if(jQuery(this).attr('data-attr') == formAtrr){
//           jQuery(this).addClass('active');
//           var innerWidth = jQuery(this).innerWidth();
//           var position = jQuery(this).position();
//           jQuery(document).find('.form-wizard-step-move').css({"left": position.left, "width": innerWidth});
//         }else{
//           jQuery(this).removeClass('active');
//         }
//       });
//     }
//   });
// });
// jQuery(document).on("click",".form-wizard .form-wizard-submit" , function(){
//   var parentFieldset = jQuery(this).parents('.wizard-fieldset');
//   var currentActiveStep = jQuery(this).parents('.form-wizard').find('.form-wizard-steps .active');
//   parentFieldset.find('.wizard-required').each(function() {
//     var thisValue = jQuery(this).val();
//     if( thisValue == "" ) {
//       jQuery(this).siblings(".wizard-form-error").slideDown();
//     }
//     else {
//       jQuery(this).siblings(".wizard-form-error").slideUp();
//     }
//   });
// });
// jQuery(".form-control").on('focus', function(){
//   var tmpThis = jQuery(this).val();
//   if(tmpThis == '' ) {
//     jQuery(this).parent().addClass("focus-input");
//   }
//   else if(tmpThis !='' ){
//     jQuery(this).parent().addClass("focus-input");
//   }
// }).on('blur', function(){
//   var tmpThis = jQuery(this).val();
//   if(tmpThis == '' ) {
//     jQuery(this).parent().removeClass("focus-input");
//     jQuery(this).siblings('.wizard-form-error').slideDown("3000");
//   }
//   else if(tmpThis !='' ){
//     jQuery(this).parent().addClass("focus-input");
//     jQuery(this).siblings('.wizard-form-error').slideUp("3000");
//   }

// });