//everything navbar do
$( document ).ready(function() {
    //mobile navbar popup
    let isPoped = false

    $(".nav-popup").click(function(){
        $(".mobile-nav").slideToggle("slow",function(){});
    });

    $( window ).on( "scroll", function() {
        
        $(".navbar-container").css("position","fixed");
    });

    
});