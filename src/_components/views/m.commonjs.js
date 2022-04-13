import $ from 'jquery';
export const  refresh=()=>{
   setTimeout(() => {
        /*-----Search Open And Close-----*/
        $('div[data-target="search-out"]').click(function () {
            var target = $(this).data("target");
            $(this).parent().addClass("fadeOut").removeClass("fadeIn");
            $("#" + target).removeClass("fadeOut");
            $("#" + target).addClass("fadeIn");
        });
        $('button[data-target="slide_out_self"]').click(function () {
            var self = $(this);
            $(".appProductSlide").removeClass("fadeOut");
            $(".appProductSlide").addClass("fadeIn");
            $("#search-out").removeClass("fadeIn");
        });
    /*-----Sidebar Open And Close-----*/
    $('button[data-target="slide-out"]').click(function () {
        var target = $(this).data("target");
        $("#" + target).css("transform", "translateX(0%)");
        $(".sidenav-overlay").css({
            "display": "block",
            "opacity": 0.88
        });
    });
    $('div[data-target="slide-out"], a[data-target="slide-out"]').click(function () {
        var target = $(this).data("target");
        $("#" + target).removeAttr("style");
        $(".sidenav-overlay").removeAttr("style");
    });
    /*-----Sidebar Open And Close END-----*/
    // $(document).ready(function () {
    //     $('.scrollbar').scrollbar();
    // }); 
}, 500);
}