// Remove Loader
$(window).on('load', function() {
    setTimeout(removeLoader, 1000);
});

function removeLoader() {
    $("#loading").fadeOut(100, function() {
        $("#loading").addClass("hideMe");
    });
}
$('.flat-toggle').on('click', function() {
    $(this).toggleClass('on');
});
$(document).ready(function() {
    setHeightDocument();
    $(".li-menu").click(function() {
        $('.li-menu').removeClass("sidebar-active");
        $(this).addClass("sidebar-active");
    });
    $(function() {
        var links = $('.ulsidebar > li');
        links.on('click', function() {
            links.removeClass('selected');
            $(this).addClass('selected');
        });
    });
    $(function() {
        $('input[name="daterange"]').daterangepicker({
            opens: 'left'
        }, function(start, end, label) {
            console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        });
    });
    $(".nicescroll").niceScroll({
        styler: "fb",
        cursorcolor: "#2BB6E2",
        cursorwidth: '3',
        cursorborderradius: '10px',
        background: '#d5d5d5',
        spacebarenabled: false,
        cursorborder: '',
        scrollspeed: 60,
        cursorfixedheight: 70
    });
    if ($(".overflowscroll")){
        $(".overflowscroll").mCustomScrollbar({
            theme: "minimal-dark"
        });
    }
    $('#toggleMenuButton , .overlay').on('click', function() {
        $('#sidebar').toggleClass('active');
        $('.overlay').fadeToggle();
        $(this).toggleClass('active');
    });
});
$(window).resize(function() {
    setHeightDocument();
});

function setHeightDocument() {
    varHeight = $(".right_spacer").height() + 35;
    $(".sidebar-brand, .right_spacer_logo").css({
        "height": varHeight,
    });
    $(".menuscroll-init").height($(window).height() - (varHeight + 70));
      $(".menuscroll-init01").height($(window).height() - (varHeight + 140));
    // $(".right_spacer_logo .icon.icon-owl").height($(".right_spacer").height() + 25);
    var window_height = $(window).height();
    var header_height = $("#header").height();
    var wp_adminbar = $("#wpadminbar").height() + 2;
    $("#wpwrap").height(window_height - wp_adminbar);
    $("#adminmenuwrap").height(window_height - wp_adminbar);
    var wp_custom_header = header_height + wp_adminbar;
    $(".from_text_configuration").height(window_height - (wp_custom_header + 105));
    if ($("#discount-page-content")) {
        $("#discount-page-content").height(window_height - wp_custom_header);
        $(".setHeight-body-pgSetting").height(window_height - (wp_custom_header + $(".height80").height() + 5));
        $(".discount_form").height(window_height - (wp_custom_header + $(".height80").height() + $(".form_btn").height() + 20));
        var minHeightForDropdown = window_height - (wp_custom_header + $(".height80").height() + $(".form_btn").height());
        $("#mCSB_7_container").css("min-height", minHeightForDropdown);
    }
    if ($("#roles-page-content")) {
        $("#roles-page-content").height(window_height - (wp_custom_header + 0));
        $(".setHeight-body-pgSetting").height(window_height - (wp_custom_header + $(".height80").height()));
        $(".roles_form").height(window_height - (wp_custom_header + $(".height80").height() + 102 + $(".form_btn").height()));
    }
    if ($("#general-page-content")) {
        $("#general-page-content").height(window_height - wp_custom_header);
        $(".form_general").height(window_height - (wp_custom_header + $(".form_btn").height() + 30));
        $("#mCSB_2_container").css("min-height", window_height - (wp_custom_header + $(".form_btn").height() + 14));
    }
    if ($(window).height() < 767) {
        $(".fileuploadjs").height(window_height - (wp_custom_header + $(".form_btn").height() + 150));
    }
    if ($(window).height() < 550) {
        $(".fileuploadjs").height(window_height - (wp_custom_header + $(".form_btn").height() + 50));
    }
    var highestBox = 0;
    $('.setcolumnheight').each(function() {
        if ($(this).height() > highestBox) {
            highestBox = $(this).height();
        }
    });
    $('.setcolumnheight').height(highestBox);
    $('.setcolumnheight').css("min-height", highestBox);
    $('.setcolumnheight').css("max-height", highestBox);
    if ($("#acc-page-content")) {
        $("#acc-page-content").height(window_height - wp_custom_header);
        $(".form_acc").height(window_height - (wp_custom_header + $(".form_btn").height() + 14));
    }
    if ($(".register-page-content")) {
        if ($(".addoutlets").length) {
            repeatHeight = $(".height80").height();
        } else {
            repeatHeight = 0;
        }
        $(".setHeight-body").height(window_height - (wp_custom_header + $(".height80").height() + repeatHeight + 5));
        $(".register_form").height(window_height - (wp_custom_header + $(".height80").height() + $("#recieptformatregirster").height() + $(".form_btn").height() + 3));
    }
    $(".staff_innertab").height(window_height - (wp_custom_header + ($(".height80").height() * 2) + $(".tablegetheadHeight").height() + 5));
    $(".staff_addpopup").height($(".col-height").height());
    if (409 > (window_height / 2)) {
        $(".setHeighto_getFormHeight").height(409);
    } else {
        $(".setHeighto_getFormHeight").height(window_height / 2);
    }
}

 