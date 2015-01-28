$(document).ready(function(){

	// Initialize everything

	$("#setup").hidden();

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

	// Code for setup process

	if (localStorage.getItem("setup") === null) {
	  $("#setup").show();
		// Sets contents of text fields on setup screen to localStorage
		document.getElementById("first_name").value = localStorage['firstname'];
		document.getElementById("last_name").value = localStorage['lastname'];
		document.getElementById("zip").value = localStorage['zip'];

		$('#getstarted').click(function() {
		  // Test if any of the text fields are empty
	  	if( (document.getElementById("first_name").value == 0) || (document.getElementById("last_name").value == 0) || (document.getElementById("zip").value == 0) )
	  	{
	  		// Tell user to fill out everything
	  		toast('Fill out everything and try again!', 5000, 'rounded');
  		} else {
  			// Save contents of text fields to localStorage
	  		localStorage['firstname'] = document.getElementById("first_name").value;
	  		localStorage['lastname'] = document.getElementById("last_name").value;
	  		localStorage['zip'] = document.getElementById("zip").value;
	  		window.location.replace("today.html");
	  	}
  	});
	}
});
