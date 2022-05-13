// import $ from 'jquery';
//==================[Scroll Bar Init]======================//
$(document).ready(function () {
    // if ($(".scrollbar").length > 0) {
    //     $('.scrollbar').scrollbar();
    // }
    if ($(".basic-single").length > 0) {
        $('.basic-single').select2({
            // placeholder: "Select an option",
            width: '100%'
        });
    }
    if ($(".datepicker").length > 0) {    
        $('.datepicker').datepicker();
    }
}); 
// jQuery(document).ready(function(){
//     jQuery('.scrollbar-dynamic').scrollbar();
// });
//==================[Popup Call by Function]======================//
function showModal(id) {
    $("#"+id).removeClass('hide');
}

function hideModal(id) {
    $("#"+id).addClass('hide');
}

//==================[Page Redirect by Function]======================//
function pageRedirect(page) {
    // alert(page);
    window.location.href = page;
}      


function pageRedirectInTime(page, time) {
    setTimeout(function () {
        window.location.href = page;
    }, time);
}

function goBack() {
    window.history.back();
}
