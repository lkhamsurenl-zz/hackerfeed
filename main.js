// Load the index.html page upon entering.
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', 
    { "innerBounds": { "width": 400, "height": 300 },
      "id": "index"
    });
  console.log("main")
});