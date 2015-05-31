var Mod = {}

Mod.initView = function() {
	var buttons = $("#runButton").parent();

	var playImage = $('<img>')
											.attr("src", "../../media/1x1.gif")
											.attr("class", "run icon21");

	var runCustomCodeButton = $('<button></button>')
															.attr("id", "runCustomCodeButton")
															.attr("class", "secondary")
															.html("Run Custom")
															.prepend(playImage);

	runCustomCodeButton.click(function() {
		var currentCode = Mod.getCurrentCode();
		Mod.executeTurtleCode(currentCode)
	});
															
	buttons.append(runCustomCodeButton);

	$("#custom-code").focus();
}

Mod.initializeEditor = function() {
	var savedCustomCode = localStorage.getItem('editor');
	ace.edit("editor").setValue(savedCustomCode);

	$("#editor").keydown(function(e){
		var currentCode = Mod.getCurrentCode();

		if (e.ctrlKey && e.keyCode == 13) {
	    Mod.executeTurtleCode(currentCode);
	    e.preventDefault();
		}
		else {
			localStorage.setItem('editor', currentCode);	
		}
	})
}


Mod.executeTurtleCode = function(code) {
	Turtle.reset();

	Turtle.blockMode = false;

	BlocklyApps.log = [];
	BlocklyApps.ticks = 1000000;
	
	try {
	  eval(code);
	} catch (e) {
	  // Null is thrown for infinite loop.
	  // Otherwise, abnormal termination is a user error.
	  if (e !== Infinity) {
	    alert(e);
	  }
	}
}

Mod.getCurrentCode = function() {
	return ace.edit("editor").getValue();
}


$(document).ready(function() {
	Mod.initView();
	Mod.initializeEditor();
});