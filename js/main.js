"use strict";


//Customización del navBar
$(document).ready(function () {
    $(".botones").hover(
        function () {
                    
            $(this).css({

                'fontSize': '24px',
                'backgroundColor': 'transparent'
            });
        }, function () {
                    $(this).css('fontSize', '18px');
    });
});
            
            //Efecto Parallax.

$(window).scroll(function () {
    var barra = $(window).scrollTop();
    var posicion = barra * 0.01;

    $('body').css({
        'backgroundPosition': '0 -' + posicion + 'px'
    })

})



         