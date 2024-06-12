$(document).ready(function () {

    var $backToTop = $(".back-to-top");
    $backToTop.hide();
    var lastScrollTop = 0

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 100) {
            $backToTop.fadeIn();
        } else {
            $backToTop.fadeOut();
        }

        var st = $(this).scrollTop();
        if (st > 1) {
            if (st > lastScrollTop) {
                // downscroll code
                $('#navbar').slideUp()
            } else {
                // uproll code
                $('#navbar').slideDown()
            }
        } else {
            $('#navbar').slideDown()

        }
        lastScrollTop = st
    });

    $backToTop.on('click', function (e) {
        $("html, body").animate({ scrollTop: 0 }, 500);
    });

    $(".to-creature").click(function () {
        $("html, body").animate({
            scrollTop: $("#second-content").offset().top - 100
        }, 500);
    });

    $(".to-contact").click(function () {
        $("html, body").animate({
            scrollTop: $("#footer").offset().top - 100
        }, 500);
    });
});