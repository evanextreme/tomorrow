$(document).ready(function(){

	// Initialize buttons

	$('.button-collapse').sideNav();
	$('.parallax').parallax();
	$('.tooltipped').tooltip({"delay": 150});

	// Make sure localStorage variablies exist

	if (localStorage.getItem("firstname") === null) {
		localStorage['firstname'] = 'Unknown';	
	}
	if (localStorage.getItem("lasttname") === null) {
		localStorage['lastename'] = 'Unknown';	
	}
	if (localStorage.getItem("zip") === null) {
		localStorage['zip'] = 'Unknown';	
	}

	// Setup code

	if ( $( "body" ).is( ".setup" ) ) {
		// do stuff
	}
});