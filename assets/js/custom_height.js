$(window).bind("load resize", function () {
    setHeightDesktop();
    var isDrawerOpen = localStorage.getItem("IsCashDrawerOpen");

    if (isDrawerOpen == "true") {

        $('.flat-toggle.cm-flat-toggle').addClass("on");
    }
    $('button.swipclock').on('click', function () {
        $(".secmk").toggleClass('cm-swipper');
    });

    if ($('.flat-toggle.cm-flat-toggle').hasClass("on")) {
        $('.cm-user-switcher .flat-toggle').find("span").addClass('open');
        $('.cm-user-switcher .flat-toggle').find("span").removeClass('close');
    } else {
        $('.cm-user-switcher .flat-toggle').find("span").addClass('close');
        $('.cm-user-switcher .flat-toggle').find("span").removeClass('open');
    }
    $('.flat-toggle.cm-flat-toggle').on('click', function () {
        // $(this).toggleClass('on');
        if ($(this).hasClass("on")) {

            $(this).find("span").addClass('open');
            $(this).find("span").removeClass('close');
            //  showModal('OpeningFloat');
        } else {
            // hideModal();
            // showModal('ClosingFloat');
            $(this).find("span").addClass('close');
            $(this).find("span").removeClass('open');
        }
    });
    /**
         *  Created By:aman 
         * Created Date:22/07/2020
         * Description : for automatically show the toggle open, when clicking cross button of close register popup.   
         */
    $('#closeRegister').on('click', function () {
        $('.flat-toggle.cm-flat-toggle').addClass("on");
        $('.cm-user-switcher .flat-toggle').find("span").addClass('open');
        $('.cm-user-switcher .flat-toggle').find("span").removeClass('close');
    });
    $(".full_height_modal").on("show.bs.modal", function () {
        var height = $(window).height() - ($(".nameSearch").height() + 100);
        $(this).find(".modal-body").css("height", height);
    });

    $(".full_height_one").on("show.bs.modal", function () {
        var height = $(window).height() - 130;
        $(this).find(".modal-body").css("height", height);
    });
});


// datepicker for calender
function showdate() {
    if( $('#datepicker-inline')) {
       $('#datepicker-inline').datepicker();
    }
    $('#datepicker-inline').on('changeDate', function () {
        $('#my_hidden_input').val(
            $('#datepicker').datepicker('getFormattedDate')
        );
    });

}
$('#datepicker-inline').on('changeDate', function () {

    $('#my_hidden_input').val(
        $('#datepicker-inline').datepicker('getFormattedDate')
    );
    hideModal('EXPERTSDemo')
    showModal('EXPERTSDemo2')
});

// Overlay popup setting
function showModal() {
    $('#registeropenclose1').appendTo("body").modal('show');
    $('.modal-backdrop').addClass('backdrop-changing');
}
function hideModal() {
    $('#registeropenclose1').appendTo("body").modal('hide');
    $('.modal-backdrop').removeClass('backdrop-changing');
}


// Auto Focusd tile view input

function autoFocus() {
    if (!("autoFocus" in document.createElement("input"))) {
        document.getElementById("my-input").focus();

    }
    // $('body').keypress(function() {
    //     if(document.getElementById("my-input"))
    //     {
    //     document.getElementById("my-input").focus();
    //     }
    // })
}

// Key Press title view

// $('body').keypress(function() {
//     if(document.getElementById("my-input"))
//         {
//     document.getElementById("my-input").focus();
//         }
// })


// Set Documents Heights

function setHeightDesktop() {

    if($(window).height() > 800) {
        $(".row-col-equal").height($(window).height() - ($(".card-our-expert-top").height() + $('.userbridge-heading').outerHeight() + 180));
    }
    else {
        $(".row-col-equal").height("auto");
    }

    var passFooterHeight;
    var passFooterHeight2;
    
    if ($(".checkfooter").hasClass("ifConnectButtonShow")) {
        passFooterHeight = $(".checkfooter").height() + 30,
            passFooterHeight2 = $(".checkfooter").height()
    }
    else {
        passFooterHeight = 0,
            passFooterHeight2 = 0
    }
    // alert(passFooterHeight2)

    var optiontablebtnHeight = 0;
    if ($("#optiontablebtn").hasClass("optiontablebtn")) {
        optiontablebtnHeight = $("#optiontablebtn").height()
    }
    else {
            optiontablebtnHeight = 0
    }


    var cart_header = $(".cart_header").height();
    var bodyHeight = $(window).height() - ($("#colorFullHeader").height() + 16);
    $(".tile-view-columns").height((bodyHeight - (124 + passFooterHeight2)) / 5);
    $(".cm-body-init-scroll").height($(window).height() - ($(".cm-switcher").height() + $(".cm-sec-acc").height() + 38));
    $(".cm-body-init-scroll2").height($(window).height() - ($(".cm-sec-acc").height() + 10));
    // A_B_height S_C_height
    $("#A_B_height").height($(".A_B_height").height() - 15);
    $("#S_C_height").height($(".S_C_height").height() - 15);
    $("#side_head_foot").height($(window).height() - ($(".head_sidebar").height() + $(".sidebarFoot").height()));

    /*
    $(".window-header").height(bodyHeight - 20);
    $("#allProductHeight").height(bodyHeight - ($(".item-heading").height() + 35));
    $("#cart_product_list").height(bodyHeight - ($(".panel-right-side .panel-heading").height() + $(".table-calculate-price").height() + 4));
    */

    $(".window-header").height(bodyHeight - (passFooterHeight2 + 20));
    $(".window-header2").height(bodyHeight - (passFooterHeight2 + 20));
    $("#allProductHeight").height(bodyHeight - ($(".item-heading").height() + 45 + passFooterHeight2));
    $("#cart_product_list").height(bodyHeight - ($(".panel-right-side .panel-heading").height() + $(".table-calculate-price").height() + 4 + passFooterHeight2 + optiontablebtnHeight));



    if($(window).width() < 768) {
        $(".window-header").height("auto");
        $("#allProductHeight").height(bodyHeight - (115 + passFooterHeight2));

        $(".tile-view-columns").height("auto");
        $(".tile-view-columns").css({
            "min-height": 120
        });
    }

    /*------Activity Page------*/
    $(".window-header-search").height(bodyHeight - $(".searchDiv").height() - 2);
    $(".window-header-search-printer").height(bodyHeight - ($(".searchDiv").height()*2) - 2);
    $(".window-header-cname_chistory").height(bodyHeight - ($(".topRecordPanel").height() + $(".topRecordPanelTwo").height() + $(".topRecordPanelTitle").height() + passFooterHeight + 187));
    /*------CheckOut Refund-----*/
    $(".full_height_button").height(bodyHeight - 44);
    $("#UserInfo_checkoutCustomer").height(bodyHeight - ($(".item-heading").height() + $("#userinfo_footer").height() + 95));
    $("#UserInfo_checkout").height(bodyHeight - ($(".item-heading").height() + $("#userinfo_footer").height() + 110));
    $("#UserInfo_refund").height(bodyHeight - ($(".item-heading").height() + 79));
    $("#UserInfo_withbtn").height(bodyHeight - ($("#height90").height() + $(".item-heading").height() + 100));
    $("#buttonGroupPanel").height(bodyHeight - ($(".item-heading").height() + 70));
    $("#buttonGroup").height($(".items.preson_info").height() - ($(".panel.panelCalculator").height() + 57));
    /*-----customer view page-----*/
    $(".table_customer-history").height(bodyHeight - ($(".customer_name").height() + $(".customer_history").height() + $(".panel-footer-heading").height() + 132));

    $("#activityLeftPanel").height(bodyHeight - ($(".createnewcustomer").height() + $(".item-heading").height() + $(".search_customer_input").height() + 15));

    $("#header-search-button").height(bodyHeight - ($(".create-new-customer").height() + $(".item-heading").height() + $(".search_customer_input").height() + 76));
    /*----customer display Page------*/
    $(".product_selled .advertise_img img").height(bodyHeight + 18);
    $("#cart_product_list_cview").height(bodyHeight - ($(".panel-right-side .panel-heading").height() + $(".table-calculate-price").height() - 17));
    /*----cash report------*/
    $(".cash-report").height(bodyHeight - ($(".customer_name").height() + $(".customer_history").height() + $(".table_head").height() + $("#cashblanceheight").height() + 65));

    var fixmodaltowindow = $(window).height() - 150;
    $("#fullHeightPopup").css("height", fixmodaltowindow);



    // Set Height For Quick Menus Body
    var quickMenus = $(".quick_menu_panel");

    $(quickMenus).height(bodyHeight);
    if ($('.quick_menu_header').length) {
        var quickmenuheader = $('.quick_menu_header').outerHeight();
    }
    if ($('.quick_menu_footer').length) {
        var quickmenufooter = $('.quick_menu_footer').outerHeight();
    }

    $(".quick_menu_body").height(bodyHeight);
    $("#login_user_list").height(bodyHeight - $(".box-logout").height());

    var switch_pin_row = $('.switch_pin_row');
    if (switch_pin_row.length) {
        var strSetHeight = (bodyHeight - $(".employee-details").outerHeight()) / switch_pin_row.length;
        switch_pin_row.find('.switch_pin_input').height(strSetHeight);
    }

    var add_note_form = $('.add_note_form');
    if (add_note_form.length) {
        $(add_note_form).height(bodyHeight - ($(".box-logout").height() + 10));
        $(".quick-note-textarea-field").height(bodyHeight - ($(".box-logout").height() + 105))
    }

    $('.pgsectionfilter').height(bodyHeight - ($(".ol-button-lg").height() + $(".webSearch").outerHeight() + 15));

    $('.add_fee_form').height(bodyHeight - ($(".box-logout").height() + $(".employee-details_auto").outerHeight() + 10));
    //alert($(".box-logout").height());
    //alert($(".employee-details_auto").outerHeight());
    setTimeout(function () {
        var add_fee_row = $('.add-fee-row');
        if (add_fee_row.length) {

            var getColumnHeight = $(".add_fee_form").outerHeight();

            setTimeout(function () {

                var afrSetHeight = getColumnHeight / add_fee_row.length;

                $('.add-fee-row td').height(afrSetHeight - 1);

            }, 200);
        }
    }, 500);

    // For dropdown and daimond section
    setTimeout(function () {
        $("#true_diamond .diamondSectionHeight").height(bodyHeight - ($(".item-heading").height() + 50));
        $(".select-picker-custom .dropdown-menu").css({
            "height": $(".panel .tab-pane.active").innerHeight(),
        });
    }, 300);


    EnableContentScroll();
}

// function activityLeftPannel(){
//     var bodyHeight1 = $(window).height() - ($("#colorFullHeader").height() + 16);
//     $(".updatHigh").height(bodyHeight1 - $(".item-heading").height());
// }



function siderbarInit() {

}


$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        // $('#wrapper-module-with-slidebar').toggleClass('active');
        // $('.overlay').fadeToggle();
        $('.overlay').toggleClass('active');
    });
    $('.overlay').on('click', function () {
        $('#sidebar').toggleClass('active');
        // $('#wrapper-module-with-slidebar').toggleClass('active');
        // $('.overlay').fadeToggle();
        $(this).toggleClass('active');
    });

    // $(".overflowscroll").mCustomScrollbar({
    //     theme: "minimal-dark",
    //     advanced: {
    //         updateOnContentResize: true,
    //         updateOnImageLoad: true
    //     }
    // });

    $(".overflowscroll-dark").mCustomScrollbar({
        theme: "dark",
        advanced: {
            updateOnContentResize: true,
            updateOnImageLoad: true
        }
    });
    $(".chooseregisterLinksScroll").mCustomScrollbar({
        theme: "minimal-dark",
        setHeight: 230,
        setTop: 0,
    });
});

function EnableContentScroll() {
    // alert();
    if ($(".overflowscroll")) {
        $(".overflowscroll").mCustomScrollbar({
            theme: "minimal-dark",
        });
        
        if ($(".horizontalScroll")) {
            $(".horizontalScroll").mCustomScrollbar({
            axis:"x",
            theme:"dark-3"
            });
        
        }
        // $(".overflowscroll-dark").mCustomScrollbar({
        //     theme: "minimal-dark",
        // });
    }
}


$('.expand_magnify_search').on('click', function () {
    $(".expand_search").toggleClass("expand_search_open");

    if ($('.expand_search').hasClass('expand_search_open')) {
        $('.expand_search').focus();
        // $(".expand_search").val('');
    } else {
        $('.expand_search').blur();
    }

    if ($(".expand_search").hasClass("expand_search_open")) {
        $(this).removeClass("magnify-white").addClass("magnify-black");
    } else {
        $(this).removeClass("magnify-black").addClass("magnify-white");
    }
});

$('.expand_search_close').click(function () {
    $(".expand_search").val('');
    $(".expand_search").keyup();
});

$('.magnify-black').click(function () {
    $(this).removeClass("magnify-black").addClass("magnify-white");
});



$(".expand_search").keyup(function () {
    if ($(this).val().length > 0) {
        $(".expand_search_close").css({ "display": "inline-block" })
        $(".expand_magnify_search").removeClass("magnify-black");
        $('.expand_magnify_search').css({
            "display": "none",
        })
    } else {
        $(".expand_search_close").css({ "display": "none" })
        $(".expand_magnify_search").addClass("magnify-black");
        $('.expand_magnify_search').css({
            "display": "",
        })
    }
});


// function niceSrcollcall(){
//     if($(".chooseregisterLinks").length)
//     {
//         $(".chooseregisterLinks").niceScroll({}).remove();

//         $(".chooseregisterLinks").niceScroll({
//             styler:"fb",
//             cursorcolor:"#2BB6E2", 
//             cursorwidth: '4',
//             cursorborderradius: '7px',
//             background: '#d7d7d7', 
//             spacebarenabled:false,
//             cursorborder: '',
//             zindex: '1000', 
//             scrollspeed: 100,
//             mousescrollstep: 60
//         });


//     }
// }    


$(document).ready(function () {
    $('.collapse').on('shown.bs.collapse', function () {
        $(this).parent().find(".glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
    }).on('hidden.bs.collapse', function () {
        $(this).parent().find(".glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
    });
});

// $('a[data-toggle="tab"]').on('click', function () {
//     var checkTrueFalse = $(this).attr('aria-expanded');
//     if (checkTrueFalse == "true") {
//         $(this).attr( 'aria-expanded', 'false');
//         $("tab-pane fade active in").tab("hide")
//     }
// });


$(".nav-flip-switch").click(function () {
    $('.nav-flip-switch').removeClass('flipped');
    $(this).toggleClass('flipped');
})
// var activeTab = localStorage.getItem('activeTab');
// if (activeTab) {
//     $('a[href="' + activeTab + '"]').tab('show');
//     $('a[href="' + activeTab + '"]').click();
// }

$(".closeTabPane").click(function () {
    // alert();
    setTimeout(function () {
        $(".nav-flip-switch").removeClass('flipped');
    }, 100);
    $(".tab-pane.fade").removeClass("active in");
    $(".home-tab-menus li").removeClass("active");

})

$(".nav-flip-switch").click(function () {
    $(".nav-flip-switch").removeClass('flipped');
    $(this).toggleClass('flipped');
})

// Swipe Panel - 18/7/2019
$(".list ul li, .close-note-link").on("click", function () {
    if ($(this).hasClass('add_note')) {
        $("#quick-fee").hide();
        $("#quick-note").addClass("transform-100");
        $(this).closest(".view-port").toggleClass('push');
        $("#panel-user").toggleClass('manage-othercontent');
    }
    else if ($(this).hasClass('add_fee')) {
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
$(".close-note-link").on("click", function () {
    $("#quick-note").removeClass("transform-100");
    $("#quick-fee").removeClass("transform-200");
    $("#quick-note").show();
    $("#quick-fee").show();
});

// function backscreenquickmenu() {
//     $("#quick-note").removeClass("transform-100");
//     $("#quick-fee").removeClass("transform-200");
//     $(".view-port").removeClass('push');

//     // $("#quick-note").show();
//     // $("#quick-fee").show();
// }
// End Swipe Panel - 18/7/2019

//header swipe or close panel - 18/7/2019


$('#drp-content-customer').on('change', function (e) {
    var $optionSelected = $("option:selected", this);
    $optionSelected.tab('show')
});

//End header swipe or close panel - 18/7/2019

if ($(".selectpicker").length != 0) {
    $(".selectpicker").selectpicker({
        iconBase: "now-ui-icons",
        tickIcon: "ui-1_check"
    });
};


function selectRefresh() {
    $('.selectpicker').selectpicker('refresh');
}

function setMargins() {
    var $box = $('.dialog-content');
    var boxLeft = ($(window).width()) / 2 - ($box.width() / 2),
        boxTop = ($(window).height()) / 2 - ($box.height() / 2);
    $box.css({
        top: boxTop
    });
}
$(document).ready(function () {
    setMargins();
    $(window).resize(function () {
        setMargins();
    });

    var browserWidth = $(window).width();

    if (navigator.userAgent.match(/(iPad)/)) {
        if (browserWidth == 768) {
            $('#whichkey').css({ 'display': 'none' });
        } else if (browserWidth == 1024) {
            $('#whichkey').css({ 'display': 'none' });
        }
    }
});

/**
 *  Created By: Aman 
 * Created Date:27/07/2020
 * Description : for automatically show the navbar open   
 */
$(window).on('load', function () {
    $('.block___open_register_menu').removeClass('active');
    $('.block___open_register_menu_overlay').addClass('active')
    // $('#OpeningFloat').modal('show');
});

function changeOverlay() {
    $('.overlay2').addClass('overlay');
}

$("#close_hard_blocker").click(function () {
    $(".close_hard_blocker").hide();
});

// // uncheck other checkbox if local selected and vice versa
// $('.checkBoxClass').change(function () {
//     var cloudPrinterName = $(this).prop('name')
//     cloudPrinterName == 'setLocalPrinter' ? $(`input[name=setCloudPrinter]:checked`).click():''
//     cloudPrinterName == 'setCloudPrinter' ? $('input[name=setLocalPrinter]:checked').click():''   
      
// });