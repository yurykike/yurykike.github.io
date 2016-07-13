$(document).ready(function(){
    $("#morebtn").click(function () {

            if ($("#more").is(":visible")) {
                $("#morebtn").text("read more");
                $("#more").slideUp();
            } else {
                $("#morebtn").text("read less");
                $("#more").slideDown();
            }


        });
        $(".botones").hover(function () {
                    
                    $(this).css({
                         'fontSize': '24px',
                         'backgroundColor': 'transparent'
                    })} , function () {
                    $(this).css('fontSize', '18px');
                });
});