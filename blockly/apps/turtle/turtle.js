/**
 * Blockly Apps: Turtle Graphics
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Turtle application.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Turtle = {};
Turtle.blockMode = false;
Turtle.displayAtEnd = false;
Turtle.ticks = 0;

Turtle.modDisplay = function() {
  Turtle.ticks += 1;

  // console.log(Turtle.ticks)
  if (Turtle.ticks > 5000) {
    var action = confirm("Infinite Loop Detected! Do you want to stop it?")
    if (action === true) {
      throw "Infinite Loop..."  
    }
    
  }
  if(Turtle.displayAtEnd) {

  }
  else {
    if (Turtle.slowAnimation) {
      // Mod.delay(1000);
    }
    Turtle.display();
  }
}

// Supported languages.
BlocklyApps.LANGUAGES =
    ['ar', 'ca', 'da', 'de', 'el', 'en', 'es', 'fa', 'fr', 'hu', 'is', 'it',
     'ko', 'nl', 'pt-br', 'ro', 'ru', 'sv', 'tr', 'uk', 'vi',
     'zh-hans', 'zh-hant'];
BlocklyApps.LANG = BlocklyApps.getLang();

document.write('<script type="text/javascript" src="generated/' +
               BlocklyApps.LANG + '.js"></script>\n');

Turtle.HEIGHT = 400;
Turtle.WIDTH = 400;

/**
 * PID of animation task currently executing.
 */
Turtle.pid = 0;

/**
 * Should the turtle be drawn?
 */
Turtle.visible = true;

/**
 * Initialize Blockly and the turtle.  Called on page load.
 */
Turtle.init = function() {
  BlocklyApps.init();

  var rtl = BlocklyApps.isRtl();
  var toolbox = document.getElementById('toolbox');
  Blockly.inject(document.getElementById('blockly'),
      {path: '../../',
       rtl: rtl,
       toolbox: toolbox,
       trashcan: true});

  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  BlocklyApps.checkTimeout(%1);\n';

  // Add to reserved word list: API, local variables in execution evironment
  // (execute) and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('Turtle,code');

  window.addEventListener('beforeunload', function(e) {
    if (Blockly.mainWorkspace.getAllBlocks().length > 2) {
      e.returnValue = BlocklyApps.getMsg('Turtle_unloadWarning');  // Gecko.
      return BlocklyApps.getMsg('Turtle_unloadWarning');  // Webkit.
    }
    return null;
  });
  var blocklyDiv = document.getElementById('blockly');
  var visualization = document.getElementById('visualization');
  var onresize = function(e) {
    var top = visualization.offsetTop;
    blocklyDiv.style.top = Math.max(10, top - window.scrollY) + 'px';
    blocklyDiv.style.left = rtl ? '10px' : '420px';
    blocklyDiv.style.width = (window.innerWidth - 440) + 'px';
  };
  window.addEventListener('scroll', function() {
      onresize();
      Blockly.fireUiEvent(window, 'resize');
    });
  window.addEventListener('resize', onresize);
  onresize();
  Blockly.fireUiEvent(window, 'resize');

  // Hide download button if browser lacks support
  // (http://caniuse.com/#feat=download).
  if (!(goog.userAgent.GECKO ||
       (goog.userAgent.WEBKIT && !goog.userAgent.SAFARI))) {
    document.getElementById('captureButton').className = 'disabled';
  } else {
    BlocklyApps.bindClick('captureButton', Turtle.createImageLink);
  }

  // Initialize the slider.
  var sliderSvg = document.getElementById('slider');
  Turtle.speedSlider = new Slider(10, 35, 130, sliderSvg);

  var defaultXml =
      '<xml>' +
      '  <block type="draw_move" x="70" y="70">' +
      '    <value name="VALUE">' +
      '      <block type="math_number">' +
      '        <title name="NUM">100</title>' +
      '      </block>' +
      '    </value>' +
      '  </block>' +
      '</xml>';
  BlocklyApps.loadBlocks(defaultXml);

  Turtle.ctxDisplay = document.getElementById('display').getContext('2d');
  Turtle.ctxScratch = document.getElementById('scratch').getContext('2d');
  Turtle.reset();

  BlocklyApps.bindClick('runButton', Turtle.runButtonClick);
  BlocklyApps.bindClick('resetButton', Turtle.resetButtonClick);

  // Lazy-load the syntax-highlighting.
  window.setTimeout(BlocklyApps.importPrettify, 1);
};

window.addEventListener('load', Turtle.init);

/**
 * Reset the turtle to the start position, clear the display, and kill any
 * pending tasks.
 */
Turtle.reset = function() {
  Turtle.ticks = 0;
  Turtle.moving = false;
  Turtle.slowAnimation = false;
  // Starting location and heading of the turtle.
  Turtle.x = Turtle.HEIGHT / 2;
  Turtle.y = Turtle.WIDTH / 2;
  Turtle.heading = 0;
  Turtle.penDownValue = true;
  Turtle.visible = true;

  // Clear the display.
  Turtle.ctxScratch.canvas.width = Turtle.ctxScratch.canvas.width;
  Turtle.ctxScratch.strokeStyle = '#000000';
  Turtle.ctxScratch.fillStyle = '#000000';
  Turtle.ctxScratch.lineWidth = 1;
  Turtle.ctxScratch.lineCap = 'round';
  Turtle.ctxScratch.font = 'normal 18pt Arial';
  Turtle.display();

  // Kill any task.
  if (Turtle.pid) {
    window.clearTimeout(Turtle.pid);
  }
  Turtle.pid = 0;

  Turtle.blockMode = true;
};

/**
 * Copy the scratch canvas to the display canvas. Add a turtle marker.
 */
Turtle.display = function() {
  Turtle.ctxDisplay.globalCompositeOperation = 'copy';
  Turtle.ctxDisplay.drawImage(Turtle.ctxScratch.canvas, 0, 0);
  Turtle.ctxDisplay.globalCompositeOperation = 'source-over';
  // Draw the turtle.
  if (Turtle.visible) {
    // Make the turtle the colour of the pen.
    Turtle.ctxDisplay.strokeStyle = Turtle.ctxScratch.strokeStyle;
    Turtle.ctxDisplay.fillStyle = Turtle.ctxScratch.fillStyle;

    // Draw the turtle body.
    var radius = Turtle.ctxScratch.lineWidth / 2 + 10;
    Turtle.ctxDisplay.beginPath();
    Turtle.ctxDisplay.arc(Turtle.x, Turtle.y, radius, 0, 2 * Math.PI, false);
    Turtle.ctxDisplay.lineWidth = 3;
    Turtle.ctxDisplay.stroke();

    // Draw the turtle head.
    var WIDTH = 0.3;
    var HEAD_TIP = 10;
    var ARROW_TIP = 4;
    var BEND = 6;
    var radians = 2 * Math.PI * Turtle.heading / 360;
    var tipX = Turtle.x + (radius + HEAD_TIP) * Math.sin(radians);
    var tipY = Turtle.y - (radius + HEAD_TIP) * Math.cos(radians);
    radians -= WIDTH;
    var leftX = Turtle.x + (radius + ARROW_TIP) * Math.sin(radians);
    var leftY = Turtle.y - (radius + ARROW_TIP) * Math.cos(radians);
    radians += WIDTH / 2;
    var leftControlX = Turtle.x + (radius + BEND) * Math.sin(radians);
    var leftControlY = Turtle.y - (radius + BEND) * Math.cos(radians);
    radians += WIDTH;
    var rightControlX = Turtle.x + (radius + BEND) * Math.sin(radians);
    var rightControlY = Turtle.y - (radius + BEND) * Math.cos(radians);
    radians += WIDTH / 2;
    var rightX = Turtle.x + (radius + ARROW_TIP) * Math.sin(radians);
    var rightY = Turtle.y - (radius + ARROW_TIP) * Math.cos(radians);
    Turtle.ctxDisplay.beginPath();
    Turtle.ctxDisplay.moveTo(tipX, tipY);
    Turtle.ctxDisplay.lineTo(leftX, leftY);
    Turtle.ctxDisplay.bezierCurveTo(leftControlX, leftControlY,
        rightControlX, rightControlY, rightX, rightY);
    Turtle.ctxDisplay.closePath();
    Turtle.ctxDisplay.fill();
  }
};

/**
 * Click the run button.  Start the program.
 */
Turtle.runButtonClick = function() {
  Turtle.blockMode = true;
  var runButton = document.getElementById('runButton');
  var resetButton = document.getElementById('resetButton');
  // Ensure that Reset button is at least as wide as Run button.
  if (!resetButton.style.minWidth) {
    resetButton.style.minWidth = runButton.offsetWidth + 'px';
  }
  runButton.style.display = 'none';
  resetButton.style.display = 'inline';
  document.getElementById('spinner').style.visibility = 'visible';
  Blockly.mainWorkspace.traceOn(true);
  Turtle.execute();
};

/**
 * Click the reset button.  Reset the Turtle.
 */
Turtle.resetButtonClick = function() {
  document.getElementById('runButton').style.display = 'inline';
  document.getElementById('resetButton').style.display = 'none';
  document.getElementById('spinner').style.visibility = 'hidden';
  Blockly.mainWorkspace.traceOn(false);
  Turtle.reset();
};


/**
 * Execute the user's code.  Heaven help us...
 */
Turtle.execute = function() {
  Turtle.manualOverride = false;
  BlocklyApps.log = [];
  BlocklyApps.ticks = 1000000;

  var code = Blockly.JavaScript.workspaceToCode();
  try {
    eval(code);
  } catch (e) {
    // Null is thrown for infinite loop.
    // Otherwise, abnormal termination is a user error.
    if (e !== Infinity) {
      alert(e);
    }
  }

  // BlocklyApps.log now contains a transcript of all the user's actions.
  // Reset the graphic and animate the transcript.
  Turtle.reset();
  Turtle.pid = window.setTimeout(Turtle.animate, 100);
};

/**
 * Iterate through the recorded path and animate the turtle's actions.
 */
Turtle.animate = function() {
  // All tasks should be complete now.  Clean up the PID list.
  Turtle.pid = 0;

  var tuple = BlocklyApps.log.shift();
  if (!tuple) {
    document.getElementById('spinner').style.visibility = 'hidden';
    Blockly.mainWorkspace.highlightBlock(null);
    return;
  }
  var command = tuple.shift();
  BlocklyApps.highlight(tuple.pop());
  Turtle.step(command, tuple);
  Turtle.display();

  // Scale the speed non-linearly, to give better precision at the fast end.
  var stepSpeed = 1000 * Math.pow(1 - Turtle.speedSlider.getValue(), 2);
  Turtle.pid = window.setTimeout(Turtle.animate, stepSpeed);
};

/**
 * Execute one step.
 * @param {string} command Logo-style command (e.g. 'FD' or 'RT').
 * @param {!Array} values List of arguments for the command.
 */

Turtle.fd = function(distance) {
  if (Turtle.penDownValue) {
    Turtle.ctxScratch.beginPath();
    Turtle.ctxScratch.moveTo(Turtle.x, Turtle.y);
  }
  var distance = distance;
  if (distance) {
    Turtle.x += distance * Math.sin(2 * Math.PI * Turtle.heading / 360);
    Turtle.y -= distance * Math.cos(2 * Math.PI * Turtle.heading / 360);
    var bump = 0;
  } else {
    // WebKit (unlike Gecko) draws nothing for a zero-length line.
    var bump = 0.1;
  }
  if (Turtle.penDownValue) {
    Turtle.ctxScratch.lineTo(Turtle.x, Turtle.y + bump);
    Turtle.ctxScratch.stroke();
  }
}

Turtle.rt = function(angle) {
  Turtle.heading += angle;
  Turtle.heading %= 360;
  if (Turtle.heading < 0) {
    Turtle.heading += 360;
  }
}

Turtle.pu = function() {
  Turtle.penDownValue = false;
}

Turtle.pd = function() {
  Turtle.penDownValue = true;
}

Turtle.pw = function(width) {
  Turtle.ctxScratch.lineWidth = width;
}

Turtle.pc = function(colour) {
  Turtle.ctxScratch.strokeStyle = colour;
  Turtle.ctxScratch.fillStyle = colour;
}

Turtle.dp = function(text) {
  Turtle.ctxScratch.save();
  Turtle.ctxScratch.translate(Turtle.x, Turtle.y);
  Turtle.ctxScratch.rotate(2 * Math.PI * (Turtle.heading - 90) / 360);
  Turtle.ctxScratch.fillText(text, 0, 0);
  Turtle.ctxScratch.restore();
}

Turtle.df = function(font, size, style) {
  Turtle.ctxScratch.font = style + ' ' + size + 'pt ' + font;
}

Turtle.ht = function() {
  Turtle.visible = false;
}

Turtle.st = function() {
  Turtle.visible = true;
}


Turtle.step = function(command, values) {
  var arg0 = values[0];
  var arg1 = values[1];
  var arg2 = values[2];

  switch (command) {
    case 'FD':  // Forward
      Turtle.fd(arg0)
      break;
    case 'RT':  // Right Turn
      Turtle.rt(arg0);
      break;
    case 'DP':  // Draw Print
      Turtle.dp(arg0);
      break;
    case 'DF':  // Draw Font
      Turtle.df(arg0, arg1, arg2);
      break;
    case 'PU':  // Pen Up
      Turtle.pu();
      break;
    case 'PD':  // Pen Down
      Turtle.pd();
      break;
    case 'PW':  // Pen Width
      Turtle.pw(arg0);
      break;
    case 'PC':  // Pen Colour
      Turtle.pc(arg0);
      break;
    case 'HT':  // Hide Turtle
      Turtle.ht();
      break;
    case 'ST':  // Show Turtle
      Turtle.st();
      break;
  }
};

/**
 * Save an image of the SVG canvas.
 */
Turtle.createImageLink = function() {
  var imgLink = document.getElementById('downloadImageLink');
  imgLink.setAttribute('href',
      document.getElementById('display').toDataURL('image/png'));
  var temp = window.onbeforeunload;
  window.onbeforeunload = null;
  imgLink.click();
  window.onbeforeunload = temp;
};

// Turtle API.

Turtle.moveForward = function(distance, id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['FD', distance, id]);
  }
  else {
    Turtle.fd(distance);
    Turtle.modDisplay();
  }
};

Turtle.moveBackward = function(distance, id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['FD', -distance, id]);
  }
  else {
    Turtle.fd(-distance)
    Turtle.modDisplay();
  }
};

Turtle.turnRight = function(angle, id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['RT', angle, id]);
  }
  else {
    Turtle.rt(angle)
    Turtle.modDisplay();
  }
};

Turtle.turnLeft = function(angle, id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['RT', -angle, id]);
  }
  else {
    Turtle.rt(-angle)
    Turtle.modDisplay();
  }
};

Turtle.penUp = function(id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['PU', id]);
  }
  else {
    Turtle.pu();
    Turtle.modDisplay();
  }
};

Turtle.penDown = function(id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['PD', id]);
  }
  else {
    Turtle.pd();
    Turtle.modDisplay();
  }
};

Turtle.penWidth = function(width, id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['PW', Math.max(width, 0), id]);
  }
  else {
    Turtle.pw(width);
    Turtle.modDisplay();
  }
};

Turtle.penColour = function(colour, id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['PC', colour, id]);
  }
  else {
    Turtle.pc(colour);
    Turtle.modDisplay();
  }
};

Turtle.hideTurtle = function(id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['HT', id]);
  }
  else {
    Turtle.hideTurtle();
    Turtle.modDisplay();
  }

};

Turtle.showTurtle = function(id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['ST', id]);
  }
  else {
    Turtle.showTurtle();
    Turtle.modDisplay();
  }

};

Turtle.drawPrint = function(text, id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['DP', text, id]);
  }
  else {
    Turtle.drawPrint(text);
    Turtle.modDisplay();
  }

};

Turtle.drawFont = function(font, size, style, id) {
  if (Turtle.blockMode) {
    BlocklyApps.log.push(['DF', font, size, style, id]);
  }
  else {
    Turtle.df(font, size, style);
    Turtle.modDisplay();
  }

};