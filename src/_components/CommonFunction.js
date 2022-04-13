//import { TicketEventPrint } from '../../CheckoutPage/components/TicketEventPrint';
import moment from 'moment';
import $ from 'jquery';
var JsBarcode = require('jsbarcode');
var _env=localStorage.getItem('env_type');
var print_bar_code;
var currentpagename='';
var rendercount=0;
var DateTime=0;

export const  textToBase64Barcode=(text)=> {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, {
        format: "CODE39", displayValue: false, width: 1,
        height: 30,
    });
    print_bar_code = canvas.toDataURL("image/png");
    return print_bar_code;
}
export const updaterefreshwebManu=()=>{  
        rendercount=0;    
}
export const  refreshwebManu=()=>{
    $('#sidebarCollapse , .overlay').on('click', function() {
        $('#sidebar').toggleClass('active');
        // $('#wrapper-module-with-slidebar').toggleClass('active');
        // $('.overlay').fadeToggle();
        $(this).toggleClass('active');
    });
    $(".nav-flip-switch").click(function(){
        $('.nav-flip-switch').removeClass('flipped');
         $(this).toggleClass('flipped');
     })
    
     $(".closeTabPane").click(function(){
        setTimeout(function(){
            $(".nav-flip-switch").removeClass('flipped');
        }, 100);
        $(".tab-pane.fade").removeClass("active in");
        $(".home-tab-menus li").removeClass("active");
    })
    
    $(".nav-flip-switch").click(function(){ 
        $(".nav-flip-switch").removeClass('flipped');
        $(this).toggleClass('flipped');    
    })
    // function Search Close And Search Icons Change
    $('.expand_magnify_search').on('click', function(){
        $(".expand_search").toggleClass("expand_search_open");
    
        if ($('.expand_search').hasClass('expand_search_open')) {
            $('.expand_search').focus();
            // $(".expand_search").val('');
        } else {
            $('.expand_search').blur();
          }
    
        if ( $(".expand_search").hasClass("expand_search_open") ) {
            $(this).removeClass("magnify-white").addClass("magnify-black");
        } else {
            $(this).removeClass("magnify-black").addClass("magnify-white");
        }
    });
    
$('.expand_search_close').click( function(){
$(".expand_search").val('');
$(".expand_search").keyup();
});

$('.magnify-black').click( function(){
$(this).removeClass("magnify-black").addClass("magnify-white");
});



$(".expand_search").keyup(function(){  	
if ( $(this).val().length > 0 ) {
$(".expand_search_close").css({"display": "inline-block"})
$(".expand_magnify_search").removeClass("magnify-black");
$('.expand_magnify_search').css({
   "display" : "none",
})
} else {
$(".expand_search_close").css({"display": "none"})
$(".expand_magnify_search").addClass("magnify-black");
$('.expand_magnify_search').css({
   "display" : "",
})
}
});

// Notification And User Switch Add Fee And Free=================================================
$(".list ul li, .close-note-link").on("click", function() {
if($(this).hasClass('add_note')) {
$("#quick-fee").hide();
$("#quick-note").addClass("transform-100");
$(this).closest(".view-port").toggleClass('push');
$("#panel-user").toggleClass('manage-othercontent');    
}
else if($(this).hasClass('add_fee')) {
$("#quick-note").hide();
$("#quick-fee").addClass("transform-200");
$(this).closest(".view-port").toggleClass('push');
$("#panel-user").toggleClass('manage-othercontent');    
}
else {
$(this).closest(".view-port").toggleClass('push');
$("#panel-user").toggleClass('manage-othercontent');    
}
});
$(".close-note-link").on("click", function() {
$("#quick-note").removeClass("transform-100");
$("#quick-fee").removeClass("transform-200");
$("#quick-note").show();
$("#quick-fee").show();
});
}

export const  refreshToggle=()=>{
    var isDrawerOpen=localStorage.getItem("IsCashDrawerOpen");
   
    if(isDrawerOpen=="true"){
     
        $('.flat-toggle.cm-flat-toggle').addClass("on")
    }
    if ($('.flat-toggle.cm-flat-toggle').hasClass("on")) {
        $('.cm-user-switcher .flat-toggle').find("span").addClass('open');
        $('.cm-user-switcher .flat-toggle').find("span").removeClass('close');
    } else {
        $('.cm-user-switcher .flat-toggle').find("span").addClass('close');
        $('.cm-user-switcher .flat-toggle').find("span").removeClass('open');
    }
    $('.flat-toggle.cm-flat-toggle').on('click', function () { 
        $(this).toggleClass('on');
        if ($(this).hasClass("on")) {
                      $(this).find("span").addClass('open');
            $(this).find("span").removeClass('close');
        } else {
            showModal('ClosingFloat');
            $(this).find("span").addClass('close');
            $(this).find("span").removeClass('open');
        }
    });
}
export const getCurrentDateTime=()=>{
    var d = new Date();
    var dateStringWithTime = moment(d).format('YYYY-MM-DD HH:mm:ss Z');     
    return dateStringWithTime;
}
export const selectRefresh=()=> {
    if ($(".selectpicker").length != 0) {
        $(".selectpicker").selectpicker({
            iconBase: "now-ui-icons",
            tickIcon: "ui-1_check"
        });
        $('.selectpicker').selectpicker('refresh');
    };    
}