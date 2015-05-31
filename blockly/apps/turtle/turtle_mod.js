var Mod = {}

Mod.delay = function(time) {
  var d1 = new Date();
  var d2 = new Date();
  while (d2.valueOf() < d1.valueOf() + time) {
    d2 = new Date();
  }
}

Mod.run = function(params) {
	var currentCode = Mod.getCurrentCode();
	Mod.executeTurtleCode(currentCode, params);
};

Mod.initView = function() {
	var buttons = $("#runButton").parent();

	var playImage = $('<img>')
											.attr("src", "../../media/1x1.gif")
											.attr("class", "run icon21");

	var runCustomCodeButton = $('<button></button>')
															.attr("id", "runCustomCodeButton")
															.attr("class", "secondary")
															.html("Run Custom")
															.prepend(playImage)
															.on("click", function() {
																Mod.run({
																	slowAnimation: true,
																	displayAtEnd: false
																})
															});
															
	buttons.append(runCustomCodeButton);

	$("#custom-code").focus();
}

Mod.initializeEditor = function() {
	var savedCustomCode = localStorage.getItem('editor');
	ace.edit("editor").setValue(savedCustomCode);

	$("#editor").keyup(function(e){
		var currentCode = Mod.getCurrentCode();

		if (e.ctrlKey && e.keyCode == 13) {
	    Mod.executeTurtleCode(currentCode);
	    e.preventDefault();
		}
		else {
			localStorage.setItem('editor', currentCode);
			Mod.run({
				supressWarnings: true,
				displayAtEnd: true
			});
		}
	})
}


Mod.executeTurtleCode = function(code, params) {
	params = params || {};
	Turtle.reset();
	Turtle.slowAnimation = true;

	Turtle.blockMode = false;
	Turtle.displayAtEnd = params.displayAtEnd || false;

	BlocklyApps.ticks = 1000000;

	
	try {
	  eval(code);
	  Turtle.display();
	} catch (e) {
	  // Null is thrown for infinite loop.
	  // Otherwise, abnormal termination is a user error.
	  if (e !== Infinity) {
	  	console.log(e);
	  	if (!params.supressWarnings) {
	  		alert(e);	
	  	}
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