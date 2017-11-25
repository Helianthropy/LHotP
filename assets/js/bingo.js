
//jQuery plugin deserialize
$.fn.deserialize = function (serializedString) 
	{
		var $form = $(this);
		$form[0].reset();
		//serializedString = decodeURI(serializedString);
		serializedString = serializedString.replace(/\[/g, '\\\[');
		serializedString = serializedString.replace(/\]/g, '\\\]');
		serializedString = serializedString.replace(/\+/g, '%20');
		var formFieldArray = serializedString.split("&");

		// Loop over all name-value pairs
		$.each(formFieldArray, function(i, pair){
			var nameValue = pair.split("=");
			var name = decodeURIComponent(nameValue[0]);
			//console.log("Saved field name: " + name);
			var value = decodeURIComponent(nameValue[1]);
			// Find one or more fields
			var $field = $form.find('[name="' + name.replace(/(\[\])/g, '\\\$1') + '"]');

			// Checkboxes and Radio types need to be handled differently
			if ($field[0].type == "radio" || $field[0].type == "checkbox") 
			{
				var $fieldWithValue = $field.filter('[value="' + value + '"]');
				var isFound = ($fieldWithValue.length > 0);
				// Special case if the value is not defined; value will be "on"
				if (!isFound && value == "on") {
					$field.first().prop("checked", true);
				} else {
					$fieldWithValue.prop("checked", isFound);
				} 
			} else { // input, textarea
				$field.val(value);
			}
		});
		return this;
	}
	
//Fisher-Yates Shuffle algorithm
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//Save form data for retrieval on page restore
function saveLHotP(){
	console.log("Saving…");
	try {
		localStorage.setItem('LHotP', $('#lhotp').serialize());
	} catch(e) {
		console.log(e);
	}
}

function restoreLHotP(){
	try {
		var savedContent = localStorage.getItem('LHotP');	
		console.log(savedContent);	
		$('#lhotp').deserialize(savedContent);
		lhotpItems = JSON.parse($("#bingo-tiles").attr("value"));
		for (var key in lhotpItems) {
		  if (lhotpItems.hasOwnProperty(key)) {
			$("#bingo" + key).attr("value", lhotpItems[key]);
			$("#label" + key).html(lhotpItems[key]);
		  }
		}
		$('#lhotp').deserialize(savedContent);
	} catch(e){
		console.log(e);
		shuffleLHotP();
	}
}

function initLHotP(){
	for (i=0; i < 24; i++) {
		bingoCell = $("<input>").attr("id", "bingo" + i).attr("name", "bingo" + i).attr("type", "checkbox");
		bingoLabel = ($("<label>").attr("for", "bingo" + i).attr("id", "label" + i));
		$("#cell" + i).html(bingoCell).append(bingoLabel);
	}
}

function shuffleLHotP(){
	$('#lhotp input:checkbox').prop('checked', false);
	lhotpItems = shuffle(lhotpTiles);
	bingoTiles = {};
	for (i = 0; i < 24; i++) {
		console.log("Bingo " + i + ": " + lhotpItems[i]);
		//bingoCell = $("<input>").setAttribute("id", bingo + i).html($("<label>").html(lhotpItems[i]));
		$("#label" + i).html(lhotpItems[i]);
		$("#bingo" + i).attr("value", lhotpItems[i]);
		bingoTiles[i] = lhotpItems[i];
	}
	$("#bingo-tiles").attr("value", JSON.stringify(bingoTiles));
	return true;
}

$(document).ready(function() {
	initLHotP();
	restoreLHotP();
	$('#reset-lhotp').on("click", function(){
		console.log("Shuffling bingo tiles.");
		shuffleLHotP();
	});
	$("#lhotp input").on("click", function(){
		saveLHotP();
	});
});