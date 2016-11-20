$(document).ready(function() {

$('body').hide(0).fadeIn(1000);
$('body').css('display', 'none');

$('body').fadeIn(1000);



$('.link').click(function(event) {

event.preventDefault();

newLocation = this.href;

$('body').fadeOut(1000, newpage);

});



function newpage() {

window.location = newLocation;

}

});