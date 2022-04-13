$(window).resize(function () { 
    modifyWpCss();
    setHeightOngoingCont();
});
$(document).ready( function () {

    $('[data-toggle="popover"]').popover(); 

    modifyWpCss();
    setHeightOngoingCont();
});



function setHeightOngoingCont()
{

    var window_height = $(window).height();
    var header_height = $("#header").height();
    var spacetopbottom_div = $(".spaceTopBottom").height();
    var wp_adminbar = $("#wpadminbar").height() + 2;

    $(".step_info_scroll , .display-table").height(window_height - (wp_adminbar + spacetopbottom_div + $(".getLeftPanelHeadHeight").height() +  $(".getLeftPanelfootHeight").height() + $(".ongoingfooter").height() + 25)); 

    $("body").niceScroll({}).remove();
    addCustomScroll();
}

//infotab script

function modifyWpCss(){
    if($("#wpbody-content").length)
    {
        $("#wpbody-content").css("padding-bottom", "0");
        
        var wp_adminbar = $("#wpadminbar").height() + 2;
        var window_height = $(window).height();

        $("#wpwrap").height(window_height - wp_adminbar); 
        $("#wpbody-content").height(window_height - wp_adminbar); 
        $("#adminmenuwrap").height(window_height - wp_adminbar); 

        $("#adminmenuwrap").mCustomScrollbar({
            theme: "minimal-dark"
        });
    

    }
}    

function addCustomScroll() {

    $(".step_info_scroll").mCustomScrollbar({
        theme: "minimal-dark"
    });

    $("body").niceScroll({
            styler:"fb",
            cursorcolor:"#2BB6E2",
            cursorwidth: '3',
            cursorborderradius: '10px',
            background: '#d5d5d5', 
            spacebarenabled:false, 
            cursorborder: '', 
            scrollspeed: 60,
            cursorfixedheight: 70
    });
}