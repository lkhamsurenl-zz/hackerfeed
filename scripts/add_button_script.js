// Open Options page when user clicks on the add button.
var button = document.getElementById("add_button");
button.addEventListener("click", function(e){
	chrome.runtime.openOptionsPage();
}, false);