// (function($) {
    
//     "use strict";

    var allPanels = $('.wrapper_accordion .expandable_accordion').hide();
    $('.wrapper_accordion .accordion_header').click(function( event  ) {        
        if ( $(this).data("isopen") ) {
            allPanels.slideUp();
            if ( $('.accordion_header').hasClass('slideUp') ) {
                $('.slideUp').slideDown().removeClass('slideUp');
            }

            $(this).slideUp().addClass('slideUp');
            $('.accordion_header').not('.slideUp').closest('.d-none').hide();

            $(this).parent().find('.expandable_accordion').slideDown();
            return true;
        } else {    
                                  
            if ( event.target.nodeName.toLowerCase() === "button" ) {
                //alert("f")
            } else if ( event.target.nodeName.toLowerCase() === "img" 
           // || event.target.nodeName.toLowerCase() === "h2"
             ) {
                allPanels.slideUp();
                if ( $('.accordion_header').hasClass('slideUp') ) {
                    $('.slideUp').slideDown().removeClass('slideUp');
                }
                $(this).addClass('slideUp');
                $('.accordion_header').not('.slideUp').closest('.d-none').hide();
                
                $(this).closest('.accordion_header').slideUp().addClass('slideUp');
                $(this).closest('.accordion_header').parent().find('.expandable_accordion').slideDown();
                return true;
            }
        }
    });


    $('.wrapper_accordion .accordion_close').click(function() {
       allPanels.slideUp();
       $('.accordion_header').not('.slideUp').closest('.d-none').show();
       $(".accordion_header").slideDown();
       $(".accordion_header_park").slideDown();
       return false;
    });


    
    // var paymountVal = $("#pay_amount").val();
    // if(paymountVal!=''){
    //     alert(paymountVal);
    // }    

    // add content to full Height
    function boxHeight(){
//alert()
        //Set Row Height Of Park Table Row  
        var ptr =  $('.park_table_row'); 
        if(ptr.length){
            var ptrSetHeight = ($(window).height() - 190) / ptr.length;
            ptr.find('input').height(ptrSetHeight);    
        } 

        /*-====set table tr equal heights---===*/
        var ath =  $('.cash-row'); 
        if(ath.length){
            var athFix = ($(window).height() - 195) / ath.length;
            ath.find('input').height(athFix);    
        }

        /*-====set table tr equal heights for chat calculator---===*/
        var athi =  $('.amount_tendered_height_inner'); 
        if(athi.length){
            var athiFix = ($(window).height() - ($(".accordion_header").height() + $("#total_tender_amount").height() + $(".box__block_caption").height() + $("#colorFullHeader").outerHeight() + 50)) / athi.length;
            athi.find('input').height(athiFix);    
        }

        /*========= set amount panel inside body height =====*/
        var atdb =  $(".giftcard_body");
        if (atdb.length) {
            var atdbFix = ($(window).height() - ($(".accordion_header").height() + $("#total_tender_amount").height() + $(".box__block_caption").height() + $(".box__block_button ").height() + $("#colorFullHeader").outerHeight() + 170));
            atdb.height(atdbFix);    
        }

        var atgb =  $(".global-body");
        if (atgb.length) {
            var atgbFix = ($(window).height() - ($(".accordion_header").height() + $("#total_tender_amount").height() + $(".box__block_caption").height() + $(".box__block_button ").height() + $("#colorFullHeader").outerHeight() + 80));
            atgb.height(atgbFix);    
            $(".global_body").height(atgbFix);   
        }

        var atsb =  $(".stripe_body");
        if (atsb.length) {
            var atsbFix = ($(window).height() - ($(".accordion_header").height() + $("#total_tender_amount").height() + $(".box__block_caption").height() + $(".box__block_button ").height() + $("#colorFullHeader").outerHeight() + 180));
            atsb.height(atsbFix);    
        }
        
        if ($('.full_height').length){
            $('.full_height').height($(window).height() - 100);
        }
    }    

    // Add Scroll ON Content
    function scrollBar(){
        if ($('.overflowscroll')){
            if ($('.overflowscroll').length) {
                var scrollbar = $('.overflowscroll'); 
                scrollbar.mCustomScrollbar ({
                        theme: "minimal-dark"
                });
            }   
        }
    }      

    $(window).on('resize', function() {
        boxHeight();
    });     

    $(window).on('load', function() {
        boxHeight();
        scrollBar();  
    });
