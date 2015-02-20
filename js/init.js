$(document).ready(function(){

	$('#setup').hide();
	$('#main').hide();
	$('#settings').hide();
	$('#add').hide();
	$('#save-trigger').hide();

	// If setup is marked as complete
	if (localStorage.getItem("setup") === "completed") {

		// Load todaylist from localStorage

		var todaylist = JSON.parse("[" + localStorage["todaylist"] + "]");
		var tomorrowlist = JSON.parse("[" + localStorage["tomorrowlist"] + "]");

		function reloadtodaylist() {
			var temp = "";
			for (var i = 0; i < todaylist.length; ++i) {
				temp += '"' + todaylist[i] + '",';
			}
			temp = temp.substring(0, temp.length - 1); // Cut off last comma
			localStorage["todaylist"] = temp;
			var url = new RegExp(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim);
			if($('#todaylist').length > 0) {
				$("#todaylist").empty();
				if(todaylist.length === 0){
					$("#todaylist").append('<div class="card"><div class="card-content"><p><i>Theres nothing here! Add an item by pressing the Add button in the lower-right corner of the screen.</i></p></div></div>');
				} else {
					for (var i = 0; i < todaylist.length; ++i) {
						$( "#todaylist" ).append('<div id="' + i + '" class="card"><div class="card-content"><div class="task task' + i + '">' + todaylist[i] + '</div><div class="actions actions' + i + '"><a class="waves-effect waves-green btn-flat delete">Dismiss</a><a class="waves-effect waves-green btn-flat push">Push</a></div></div></div>');
						// Detect links in task
						var result;
						while((result = url.exec(todaylist[i])) !== null) {
							$( ".actions" + i ).append('<a href="' + result[1] + '" target="_blank" class="waves-effect waves-green btn-flat link">Open Link</a>');
						}
					}
				}
			}
			todaylist = JSON.parse("[" + localStorage["todaylist"] + "]");
		}

		function reloadtomorrowlist() {
			var temp = "";
			for (var i = 0; i < tomorrowlist.length; ++i) {
				temp += '"' + tomorrowlist[i] + '",';
			}
			temp = temp.substring(0, temp.length - 1); // Cut off last comma
			localStorage["tomorrowlist"] = temp;
			if($('#tomorrowlist').length > 0) {
				$("#tomorrowlist").empty();
				if(tomorrowlist.length === 0){
					$("#tomorrowlist").append('<div class="card"><div class="card-content"><i>This is where your items pushed to tomorrow appear.</i></div></div>');
				} else {
					for (var i = 0; i < tomorrowlist.length; ++i) {
						$( "#tomorrowlist" ).append('<div id="' + i + '" class="card"><div class="card-content"><div class="task">' + tomorrowlist[i] + '</div></div></div>');
					}
				}
			}
			tomorrowlist = JSON.parse("[" + localStorage["tomorrowlist"] + "]");
		}

		reloadtodaylist();
		reloadtomorrowlist();

		// Read values of settings from localStorage

		document.getElementById("settings-firstname").value = localStorage['firstname'];
		document.getElementById("settings-lastname").value = localStorage['lastname'];
		document.getElementById("settings-zip").value = localStorage['zip'];
		$("#settings-weather").prop('checked', JSON.parse(localStorage['weather']));
		$("#settings-night").prop('checked', JSON.parse(localStorage['night']));

		// Action for settings buttons

		$('#settings-trigger').click(function() {
			$('#add').fadeOut( "slow", function() {});
			$('#settings').fadeIn( "slow", function() {});
			$('#save-trigger').fadeIn( "slow", function() {});
		});

		$('#save-trigger').click(function() {
			localStorage['firstname'] = document.getElementById("settings-firstname").value;
			localStorage['lastname'] = document.getElementById("settings-lastname").value;
			localStorage['zip'] = document.getElementById("settings-zip").value;
			if ($("#settings-weather").is(":checked")) {
				localStorage['weather'] = "true";
			} else {
				localStorage['weather'] = "false";
			}
			if ($("#settings-night").is(":checked")) {
				localStorage['night'] = "true";
			} else {
				localStorage['night'] = "false";
			}
			location.reload();
		});

		// Weather forecast

		if (localStorage.getItem("weather") === "true") {
			$.simpleWeather({
			location: localStorage['zip'],
			woeid: '',
			unit: 'f',
			success: function(weather) {
				today = "<div class='card'><div class='card-content'><table><tr><th style='width: 80px;'><img src='" + weather.thumbnail + "' style='width: 80px; height: auto;' /></th><th><p>It's currently " + weather.temp + "&deg;" + weather.units.temp + " and " + weather.currently +  ".</p><p style='font-style: italic; font-size: 12px;'>Weather provided by Yahoo Weather.</p></th></tr></table></div></div>";
				$("#todaylist").prepend(today);

				tomorrow = "<div class='card'><div class='card-content'><table><tr><th style='width: 80px;'><img src='" + weather.forecast[1].thumbnail + "' style='width: 80px; height: auto;' /></th><th><p>It's going to be " + weather.forecast[1].low + "&deg;" + weather.units.temp + " - " + weather.forecast[1].high + "&deg;" + weather.units.temp + " and " + weather.forecast[1].text +  ".</p><p style='font-style: italic; font-size: 12px;'>Weather provided by Yahoo Weather.</p></th></tr></table></div></div>";
				$("#tomorrowlist").prepend(tomorrow);
			},
			error: function(error) {
				toast('Error fetching the weather.', 3000, 'rounded');
			}
			});
		}

		$(document).on('click', ".delete", function() {
			var item = $(this).parent().parent().parent().attr('id');
			todaylist.splice(item,1);
			$( "#" + item ).fadeOut( 500, function() {
				reloadtodaylist();
				reloadtomorrowlist();
				toast('Task completed.', 3000, 'rounded');
			});
		});

		$(document).on('click', ".push", function() {
			var item = $(this).parent().parent().parent().attr('id');
			var task = $( ".task" + item ).text();
			$('#confirm').openModal();
			$( ".confirm-ok" ).click(function() {
				todaylist.splice(item,1);
				tomorrowlist.unshift(task);
				console.log(tomorrowlist);
				$( "#todaylist > #" + item ).fadeOut( 500, function() {
					reloadtodaylist();
					reloadtomorrowlist();
					toast('Task pushed to tomorrow.', 3000, 'rounded');
				});
			});
		});

		$( "#add" ).click(function() {
			$('#new').openModal();
			$('#task').focus();
		});

		$('#task').keypress(function(event){
		 var keycode = (event.keyCode ? event.keyCode : event.which);
		 if(keycode == '13'){
		 	if(document.getElementById("task").value == 0) {
				toast('Enter a task!', 3000, 'rounded');
			} else {
				var task = document.getElementById("task").value;
				todaylist.unshift(task);
				reloadtodaylist();
				reloadtomorrowlist();
				document.getElementById("task").value = "";
				$('#new').closeModal();
				toast('Task added.', 3000, 'rounded');
			}
		 }
		});

		$(window).load(function() {

			// Night mode

			if (localStorage.getItem("night") === "true") {
				$(".navbar").css("background", "#151515", 'important');
				$("#add").css("background", "#151515", 'important');
				$("#settings-trigger").css("background", "#151515", 'important');
				$("#save-trigger").css("background", "#151515", 'important');
				$("#settings").css("background", "#000000", 'important');
				$(".collection-item").css("border-bottom", "#151515", 'important');
				$("#main").css("background", "#000000", 'important');
				$(".card").css("background", "#151515", 'important');
				$(".switch label input[type=checkbox]:first-child:checked+.lever").css("background", "#151515", 'important');
				$("body").css("color", "#FFFFFF", 'important');
				$("a").css("color", "#FFFFFF", 'important');
				$("input").css("color", "#FFFFFF", 'important');
			}

			// Show everything

			$('.preloader-wrapper').fadeOut( "slow", function() {});
			$('#main').fadeIn( "slow", function() {});
			$('#add').fadeIn( "slow", function() {});
		});

	// If setup is not marked as complete
	} else if (localStorage.getItem("setup") != "completed") {

		// Show setup because it's not complete
		$('#setup').show();

		// Actions when 'Get Started' button is pressed on setup
		$('#getstarted').click(function() {
				// Test if any of the text fields are empty
			if( (document.getElementById("first_name").value == 0) || (document.getElementById("last_name").value == 0) || (document.getElementById("zip").value == 0) )
			{
				// Tell user to fill out everything
				toast('Fill out everything and try again!', 3000, 'rounded');
			} else {
				// Save contents of text fields to localStorage
				localStorage['firstname'] = document.getElementById("first_name").value;
				localStorage['lastname'] = document.getElementById("last_name").value;
				localStorage['zip'] = document.getElementById("zip").value;
				localStorage["weather"] = 'true';
				localStorage['setup'] = "completed";
				localStorage["todaylist"] = '"This is a sample todaylist item. You can delete these easily by tapping the Dismiss button.","Look what happens when you add a link! http://www.google.com/"';
				localStorage["tomorrowlist"] = '';
				localStorage['night'] = "false";
				location.reload();
			}
		});

	} else {
		console.log("insert error message here or whatver");
	}

});