// popup.js is additional js for popup.html to handle behaviors.

// When link is clicked, create new tab but keep the focus on popup.html
window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href, active:false})
  }
});