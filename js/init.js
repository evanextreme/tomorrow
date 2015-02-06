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

    var list = JSON.parse("[" + localStorage["list"] + "]");

    function reloadList() {
      var temp = "";
      for (var i = 0; i < list.length; ++i) {
        temp += '"' + list[i] + '",';
      }
      temp = temp.substring(0, temp.length - 1); // Cut off last comma
      localStorage["list"] = temp;
      if ($('#list').length > 0) {
        $( "#list" ).empty();
        for (var i = 0; i < list.length; ++i) {
          $( "#list" ).append('<div id="' + i + '" class="card"><div class="card-content"><p><span id="content">' + list[i] + '</span><a class="waves-effect waves-green btn-flat delete">Done</a></p></div></div>');
        }
      }
      list = JSON.parse("[" + localStorage["list"] + "]");
    }

    reloadList();

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
        reloadList();
        toast('Item completed.', 5000, 'rounded');
      });
    });

    $( "#float" ).click(function() {
      $('#new').openModal();
      $('#newitem').focus();
    });

    $('#newitem').keypress(function(event){
     var keycode = (event.keyCode ? event.keyCode : event.which);
     if(keycode == '13'){
      var newitem = document.getElementById("newitem").value;
      list.unshift(newitem);
      reloadList();
      document.getElementById("newitem").value = "";
      $('#new').closeModal();
     }
    });

  }

  $(window).load(function() {
   $('.preloader-wrapper').fadeOut( "slow", function() {});
   $('#main').fadeIn( "slow", function() {});
   $('#float').fadeIn( "slow", function() {});
  });

});