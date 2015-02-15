$(document).ready(function(){

	$('#setup').hide();
	$('#main').hide();
	$('#float').hide();

	// If setup is marked as complete
	if (localStorage.getItem("setup") === "completed") {

		// Load list from localStorage

		var list = JSON.parse("[" + localStorage["list"] + "]");

		function reloadList() {
			var temp = "";
			for (var i = 0; i < list.length; ++i) {
				temp += '"' + list[i] + '",';
			}
			temp = temp.substring(0, temp.length - 1); // Cut off last comma
			localStorage["list"] = temp;
			var url = new RegExp(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim);
			if($('#list').length > 0) {
				$("#list").empty();
				if(list.length === 0){
					$("#list").append('<div class="card"><div class="card-content"><p><i>Theres nothing here! Add a list item by pressing the Add button in the lower-right corner of the screen.</i></p></div></div>');
				} else {
					for (var i = 0; i < list.length; ++i) {
						$( "#list" ).append('<div id="' + i + '" class="card"><div class="card-content"><div class="task">' + list[i] + '</div><div class="actions"><a class="waves-effect waves-green btn-flat delete">Dismiss</a></div></div></div>');
						// Detect links in task
						var result;
						while((result = url.exec(list[i])) !== null) {
							$( ".actions" ).append('<a href="' + result[1] + '" target="_blank" class="waves-effect waves-green btn-flat link">Open Link</a>');
						}
					}
				}
			}
			list = JSON.parse("[" + localStorage["list"] + "]");
		}

		function exportList() {
			var temp = "";
			for (var i = 0; i < list.length; ++i) {
				temp += '"' + list[i] + '",';
			}
			temp = temp.substring(0, temp.length - 1); // Cut off last comma
			var textToWrite = localStorage["list"];
			var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
			var downloadLink = document.createElement("a");
			downloadLink.download = "list.txt";
			downloadLink.innerHTML = "Download File";
			if (window.webkitURL != null)
			{
				downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
				toast('List exported.', 3000, 'rounded');
			}
			else
			{
				downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
				downloadLink.onclick = destroyClickedElement;
				downloadLink.style.display = "none";
				document.body.appendChild(downloadLink);
			}

			downloadLink.click();
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
			toast('Error fetching the weather.', 5000, 'rounded');
		}
		});

		$(document).on('click', ".delete", function() {
			var item = $(this).parent().parent().parent().attr('id');
			list.splice(item,1);
			$( "#" + item ).fadeOut( 500, function() {
				reloadList();
				toast('Task completed.', 5000, 'rounded');
			});
		});

		$( "#float" ).click(function() {
			$('#new').openModal();
			$('#task').focus();
		});

		$('#task').keypress(function(event){
		 var keycode = (event.keyCode ? event.keyCode : event.which);
		 if(keycode == '13'){
		 	if(document.getElementById("task").value == 0) {
				toast('Enter a task!', 5000, 'rounded');
			} else {
				var task = document.getElementById("task").value;
				list.unshift(task);
				reloadList();
				document.getElementById("task").value = "";
				$('#new').closeModal();
				toast('Task added.', 5000, 'rounded');
			}
		 }
		});

		$(window).load(function() {
			$('.preloader-wrapper').fadeOut( "slow", function() {});
			$('#main').fadeIn( "slow", function() {});
			$('#float').fadeIn( "slow", function() {});
		});

	// If setup is not marked as complete
	} else if (localStorage.getItem("setup") === null) {

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
		console.log("insert error message here or whatver");
	}

});