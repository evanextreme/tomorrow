$(document).ready(function(){

	$('#setup').hide();
	$('#main').hide();
	$('#settings').hide();
	$('#add').hide();
	$('#save-trigger').hide();

	if (document.addEventListener && window.localStorage) {
    	console.log("Compatible web browser detected.");
	} else {
		$('#warning').openModal();
	}

	// If setup is marked as complete
	if (localStorage.getItem("setup") === "completed") {

		// Load todaylist from localStorage

		var todaylist = JSON.parse("[" + localStorage["todaylist"] + "]");
		var tomorrowlist = JSON.parse("[" + localStorage["tomorrowlist"] + "]");

		// Find date

		var d = new Date();
		var month = d.getMonth()+1;
		var day = d.getDate();
		var date = d.getFullYear() + (month<10 ? '0' : '') + month + (day<10 ? '0' : '') + day;
		if (localStorage.getItem("lastopened") === null || localStorage.getItem("lastopened") === "") {
			localStorage["lastopened"] = date;
		}
		if (localStorage.getItem("lastopened") != date) {
			todaylist = tomorrowlist;
			tomorrowlist = JSON.parse("[]");
			localStorage["lastopened"] = date;
		}

		// Weather forecast

		if (localStorage.getItem("weather") === "true") {

			$.simpleWeather({
			location: localStorage['zip'],
			woeid: '',
			unit: 'f',
			success: function(weather) {
				$("#today-weather").append("<div class='card'><div class='card-content'><table><tr><th style='width: 80px;'><img src='" + weather.thumbnail + "' style='width: 80px; height: auto;' /></th><th><p>It's currently " + weather.temp + "&deg;" + weather.units.temp + " and " + weather.currently +  ".</p><p style='font-style: italic; font-size: 12px;'>Weather provided by Yahoo Weather.</p></th></tr></table></div></div>");
				$("#tomorrow-weather").append("<div class='card'><div class='card-content'><table><tr><th style='width: 80px;'><img src='" + weather.forecast[1].thumbnail + "' style='width: 80px; height: auto;' /></th><th><p>It's going to be " + weather.forecast[1].low + "&deg;" + weather.units.temp + "/" + weather.forecast[1].high + "&deg;" + weather.units.temp + " and " + weather.forecast[1].text +  ".</p><p style='font-style: italic; font-size: 12px;'>Weather provided by Yahoo Weather.</p></th></tr></table></div></div>");
			},
			error: function(error) {
				toast('Error fetching the weather.', 3000, 'rounded');
			}
			});

		}

		// Reload everything after changes

		function reloadData() {

			var todaytemp = "";
			for (var i = 0; i < todaylist.length; ++i) {
				todaytemp += '"' + todaylist[i] + '",';
			}
			var tomorrowtemp = "";
			for (var i = 0; i < tomorrowlist.length; ++i) {
				tomorrowtemp += '"' + tomorrowlist[i] + '",';
			}
			todaytemp = todaytemp.substring(0, todaytemp.length - 1); // Cut off last comma
			tomorrowtemp = tomorrowtemp.substring(0, tomorrowtemp.length - 1); // Cut off last comma
			localStorage["todaylist"] = todaytemp;
			localStorage["tomorrowlist"] = tomorrowtemp;
			var url = new RegExp(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim);
			// Generate today list
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

			// Generate tomorrow list
			if($('#tomorrowlist').length > 0) {
				$("#tomorrowlist").empty();
				if(tomorrowlist.length === 0){
					$("#tomorrowlist").append('<div class="card"><div class="card-content"><i>This is where your items pushed to tomorrow appear.</i></div></div>');
				} else {
					for (var i = 0; i < tomorrowlist.length; ++i) {
						$( "#tomorrowlist" ).append('<div class="card"><div class="card-content">' + tomorrowlist[i] + '</div></div>');
					}
				}
			}

			// Reload variables from updated localStorage sources
			todaylist = JSON.parse("[" + localStorage["todaylist"] + "]");
			tomorrowlist = JSON.parse("[" + localStorage["tomorrowlist"] + "]");

			// Fix for night mode not applying to reloaded cards
			if (localStorage.getItem("night") === "true") {
				$(".card").css("background", "#151515", 'important');
				$("a").css("color", "#FFFFFF", 'important');
			}
		}

		reloadData();

		// Read values of settings from localStorage

		$("#settings-firstname").val(localStorage['firstname']);
		$("#settings-lastname").val(localStorage['lastname']);
		$("#settings-zip").val(localStorage['zip']);
		$("#settings-weather").prop('checked', JSON.parse(localStorage['weather']));
		$("#settings-night").prop('checked', JSON.parse(localStorage['night']));

		// Actions for settings buttons

		$('#settings-trigger').click(function() {
			$('#add').fadeOut( "slow", function() {});
			$('#settings').fadeIn( "slow", function() {});
			$('#save-trigger').fadeIn( "slow", function() {});
		});

		// Actions for save button

		$('#save-trigger').click(function() {
			if( ($("#settings-firstname").val() == 0) || ($("#settings-lastname").val() == 0) || ($("#settings-zip").val() == 0) )
			{
				// Tell user to fill out everything
				toast('Fill out everything before saving!', 3000, 'rounded');
			} else {
				localStorage['firstname'] = $("#settings-firstname").val();
				localStorage['lastname'] = $("#settings-lastname").val();
				localStorage['zip'] = $("#settings-zip").val();
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
			}
		});

		// Actions for dismiss button

		$(document).on('click', ".delete", function() {
			var item = $(this).parent().parent().parent().attr('id');
			// Remove item from today list
			todaylist.splice(item,1);
			$( "#" + item ).fadeOut( 500, function() {
				reloadData();
				toast('Task completed.', 3000, 'rounded');
			});
		});

		// Actions for push button

		$(document).on('click', ".push", function() {
			var item = $(this).parent().parent().parent().attr('id');
			var task = $( ".task" + item ).text();
			console.log("item: " + item);
			console.log("task: " + task);
			todaylist.splice(item,1); // Remove item from today list
			tomorrowlist.unshift(task); // Add item to tomorrow list
			$( "#" + item ).fadeOut( 500, function() {
				$('#confirm').closeModal();
				reloadData();
				toast('Task pushed to tomorrow.', 3000, 'rounded');
			});
		});

		// Actions for floating add button

		$( "#add" ).click(function() {
			$('#new').openModal();
			$('#task').focus();
		});

		// Actions for ENTER keypress in add modal

		$('#task').keypress(function(event){
		 var keycode = (event.keyCode ? event.keyCode : event.which);
		 if(keycode == '13'){
		 	if(document.getElementById("task").value == 0) {
				toast('Enter a task!', 3000, 'rounded');
			} else {
				var task = document.getElementById("task").value;
				if ($('#new-toggle').is(':checked')) {
					// Add item to tomorrow list
					tomorrowlist.unshift(task);
					// Reset checkbox
					$("#new-toggle").prop('checked', false);
				} else {
					// Add item to today list
					todaylist.unshift(task);
				}
				reloadData();
				document.getElementById("task").value = "";
				$('#new').closeModal();
				toast('Task added.', 3000, 'rounded');
			}
		 }
		});

		// Actions to do after everything is finished loading

		$(window).load(function() {

			// Night mode
			if (localStorage.getItem("night") === "true") {
				$(".navbar").css("background", "#212121", 'important');
				$("#add").css("background", "#424242", 'important');
				$("#settings-trigger").css("background", "#212121", 'important');
				$("#save-trigger").css("background", "#424242", 'important');
				$("#settings").css("background", "#000000", 'important');
				$(".modal").css("background", "#424242", 'important');
				$(".settings-item").css("border-bottom", "#424242", 'important');
				$("#main").css("background", "#000000", 'important');
				$(".card").css("background", "#212121", 'important');
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
			if( ($("#setup-firstname").val() == 0) || ($("#setup-lastname").val() == 0) || ($("#setup-zip").val() == 0) )
			{
				// Tell user to fill out everything
				toast('Fill out everything and try again!', 3000, 'rounded');
			} else {
				// Save contents of text fields to localStorage
				localStorage['firstname'] = $("#setup-firstname").val();
				localStorage['lastname'] = $("#setup-lastname").val();
				localStorage['zip'] = $("#setup-zip").val();
				localStorage["weather"] = "true";
				localStorage['setup'] = "completed";
				localStorage["todaylist"] = '"This is a sample list item. You can delete these easily by tapping the Dismiss button.","Look what happens when you add a link! http://www.google.com/"';
				localStorage["tomorrowlist"] = "";
				localStorage['night'] = "false";
				location.reload();
			}
		});

	} else {

		localStorage["setup"] = "";
		location.reload();
	}

});
