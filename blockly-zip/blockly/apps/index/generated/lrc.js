// This file was automatically generated from common.soy.
// Please don't edit this file by hand.

if (typeof apps == 'undefined') { var apps = {}; }


apps.messages = function(opt_data, opt_ignored) {
  return '<div style="display: none"><span id="subtitle">یه راساگه برنامه نیسی قاول دیئن</span><span id="blocklyMessage">قلف بیه</span><span id="codeTooltip">سیل کد جاوا اسکریپت راس بیه بکید.</span><span id="linkTooltip">بخشیانه ذخیره و هوم پیوند بکید.</span><span id="runTooltip">Run the program defined by the blocks in the workspace.</span><span id="runProgram">برنامه نه اجرا بکیت</span><span id="resetProgram">د نو شرو كردن</span><span id="dialogOk">خوئه</span><span id="dialogCancel">رد كردن</span><span id="catLogic">علقمنی</span><span id="catLoops">حلقه یا</span><span id="catMath">حساو کتاو</span><span id="catText">متن</span><span id="catLists">نوم گه یا</span><span id="catColour">رن</span><span id="catVariables">آلشت ونا</span><span id="catProcedures">رویه یا</span><span id="httpRequestError">یه گل مشگل وا درحاست هئ</span><span id="linkAlert">بخشیاتونه وا ای هوم پیوند بهر بکید</span><span id="hashError">Sorry, \'%1\' doesn\'t correspond with any saved program.</span><span id="xmlError">Could not load your saved file.  Perhaps it was created with a different version of Blockly?</span><span id="listVariable">نوم گه</span><span id="textVariable">متن</span></div>';
};


apps.dialog = function(opt_data, opt_ignored) {
  return '<div id="dialogShadow" class="dialogAnimate"></div><div id="dialogBorder"></div><div id="dialog"></div>';
};


apps.codeDialog = function(opt_data, opt_ignored) {
  return '<div id="dialogCode" class="dialogHiddenContent"><pre id="containerCode"></pre>' + apps.ok(null) + '</div>';
};


apps.storageDialog = function(opt_data, opt_ignored) {
  return '<div id="dialogStorage" class="dialogHiddenContent"><div id="containerStorage"></div>' + apps.ok(null) + '</div>';
};


apps.ok = function(opt_data, opt_ignored) {
  return '<div class="farSide" style="padding: 1ex 3ex 0"><button class="secondary" onclick="BlocklyApps.hideDialog(true)">خوئه</button></div>';
};

;
// This file was automatically generated from template.soy.
// Please don't edit this file by hand.

if (typeof appsIndex == 'undefined') { var appsIndex = {}; }


appsIndex.messages = function(opt_data, opt_ignored) {
  return apps.messages(null) + '<div style="display: none"><span id="indexTitle">Blockly Apps</ span><span id="indexFooter">Blockly is free and open source.  To contribute code or translations to Blockly, or to use Blockly in your own app, visit %1.<span></div>';
};


appsIndex.start = function(opt_data, opt_ignored) {
  return appsIndex.messages(null) + '<table><tr><td><h1><span id="title">Blockly Apps</span></h1></td><td class="farSide"><select id="languageMenu"></select></td></tr><tr><td>Blockly is a graphical programming environment.  Below are some sample applications that use Blockly.</td></tr></table><table><tr><td><a href="puzzle/index.html"><img src="index/puzzle.png" height=80 width=100></a></td><td><div><a href="puzzle/index.html">چنه چنه</a></div><div>Learn to use Blockly\'s interface.</div></td></tr><tr><td><a href="maze/index.html"><img src="index/maze.png" height=80 width=100></a></td><td><div><a href="maze/index.html">پلاق بیئن</a></div><div>Use Blockly to solve a maze.</div></td></tr><tr><td><a href="turtle/index.html"><img src="index/turtle.png" height=80 width=100></a></td><td><div><a href="turtle/index.html">Turtle Graphics</a></div><div>Use Blockly to draw.</div></td></tr><tr><td><a href="code/index.html"><img src="index/code.png" height=80 width=100></a></td><td><div><a href="code/index.html">کد</a></div><div>Export a Blockly program into JavaScript, Python or XML.</div></td></tr></table><p><span id="footer_prefix"></span><a href="http://blockly.googlecode.com/">blockly.googlecode.com</a><span id="footer_suffix"></span>';
};
