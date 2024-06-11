$(document).ready(function(){

    var $backToTop = $(".back-to-top");
    $backToTop.hide();


    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 100) {
            $backToTop.fadeIn();
        } else {
            $backToTop.fadeOut();
        }
    });

    $backToTop.on('click', function(e) {
        $("html, body").animate({scrollTop: 0}, 500);
    });

    $(".to-creature").click(function(){
        $("html, body").animate({
            scrollTop: $("#second-content").offset().top-100
        }, 500);
    });

    $(".to-contact").click(function(){
        $("html, body").animate({
            scrollTop: $("#footer").offset().top-100
        }, 500);
    });
});