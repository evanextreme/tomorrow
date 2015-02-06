$(document).ready(function(){

  $('#setup').hide();
  $('#main').hide();
  $('#float').hide();

	// Code for setup process

	if (localStorage.getItem("setup") === null) {

    // Show setup because it's not complete
		$('#setup').show();

    // Actions when 'Get Started' button is pressed on setup
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
				localStorage['setup'] = "completed";
				localStorage["list"] = '"This is a sample list item.","You can delete these easily!"';
				location.reload();
			}
		});

	} else {

    // Load list from localStorage

    function loadList() {
      $( "#list" ).empty();
      var list = JSON.parse("[" + localStorage["list"] + "]");
      for (var i = 0; i < list.length; ++i) {
        $( "#list" ).append('<div id="' + i + '" class="card"><div class="card-content"><p><span id="content">' + list[i] + '</span><a class="waves-effect waves-green btn-flat delete">Done</a></p></div></div>');
      }
    }

    // Save list array into localStorage

    function saveList() {
      var temp = "";
      for (var i = 0; i < list.length; ++i) {
        temp += '"' + list[i] + '",';
      }
      temp = temp.substring(0, temp.length - 1); // Cut off last comma
      localStorage["list"] = temp;
    }

	  // Load list

    var list = JSON.parse("[" + localStorage["list"] + "]");
    loadList();

    // Weather forecast

	  $.simpleWeather({
    location: localStorage['zip'],
    woeid: '',
    unit: 'f',
    success: function(weather) {
      html = "<div class='card'><div class='card-content'><table><tr><th style='width: 80px;'><img src='" + weather.thumbnail + "' style='width: 80px; height: auto;' /></th><th><p>It's currently " + weather.temp + "&deg;" + weather.units.temp + " and " + weather.currently +  ".</p><p style='font-style: italic; font-size: 12px;'>Weather provided by Yahoo Weather.</p></th></tr></table></div></div>";

      $("#weather").html(html);
    },
    error: function(error) {
      toast('There was an error fetching the weather.', 5000, 'rounded');
    }
    });

    $( ".delete" ).click(function() {
      var item = $(this).parent().parent().parent().attr('id');
      list.splice(item,1);
      $( "#" + item ).fadeOut( 500, function() {
        $( "#" + item ).remove();
        toast('Item completed.', 5000, 'rounded');
      });
      saveList();
    });

    $( "#float" ).click(function() {
      $('#new').openModal();
      $('#newitem').focus();
    });

    $( "#additem" ).click(function() {
      var newitem = document.getElementById("newitem").value;
      list.unshift(newitem);
      saveList();
      loadList();
      document.getElementById("newitem").value = "";
      $('#additem').closeModal();
    });

	}

  $(window).load(function() {
   $('.preloader-wrapper').fadeOut( "slow", function() {});
   $('#main').fadeIn( "slow", function() {});
   $('#float').fadeIn( "slow", function() {});
  });

});