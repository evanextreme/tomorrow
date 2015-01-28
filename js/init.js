$(document).ready(function(){

	// Initialize buttons

	$('.button-collapse').sideNav();
	$('.parallax').parallax();
	$('.tooltipped').tooltip({"delay": 150});

	// Make sure localStorage variablies exist

	if (localStorage.getItem("firstname") === null) {
		localStorage['firstname'] = '';	
	}
	if (localStorage.getItem("lastname") === null) {
		localStorage['lastname'] = '';	
	}
	if (localStorage.getItem("zip") === null) {
		localStorage['zip'] = '';	
	}

	// Setup code

	if ( $( "body" ).is( ".setup" ) ) {
		document.getElementById("first_name").value = localStorage['firstname'];
		document.getElementById("last_name").value = localStorage['lastname'];
		document.getElementById("zip").value = localStorage['zip'];
	}

	$('#getstarted').click(function() {
		if( (document.getElementById("first_name").value == 0) || (document.getElementById("last_name").value == 0) || (document.getElementById("zip").value == 0) )
		{
		   toast('Fill out everything and try again!', 10000000, 'rounded');
		} else {
			localStorage['firstname'] = document.getElementById("first_name").value;
			localStorage['lastname'] = document.getElementById("last_name").value;
			localStorage['zip'] = document.getElementById("zip").value;
			window.location.replace("today.html");
		}
	});
});