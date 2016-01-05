function populateTable(items) {
  var table = document.getElementById('subreddit_table');
  for (i = 0; i < items.length; i++) {
    var row = table.insertRow(i);
    var cell1 = row.insertCell(0).innerHTML = items[i];
    row.insertCell(1).innerHTML = "Insert Button here!"
  }
}


// Saves options to chrome.storage.sync.
function save_options() {
  
  var new_val = document.getElementById('subreddit').value;
  var table = document.getElementById('subreddit_table');
  var new_row = table.insertRow(-1);
  var cell1 = new_row.insertCell(0);
  cell1.innerHTML = new_val;
  var cell2 = new_row.insertCell(1);
  // cell2 value should be a button to remove the value
  cell2.innerHTML = "empty for now";
  // Get all subreddits and set the new value
  var subreddits;
  chrome.storage.sync.get({
    subredditList: [],
  }, function(items) {
    var new_list = items.subredditList == "" ? new_val : 
      items.subredditList + "," + new_val;
    console.log("new list: " + new_list);
    chrome.storage.sync.set({
        subredditList: new_list,
      }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
      });

  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    subredditList: "",
  }, function(items) {
    console.log("loading: " + items.subredditList);
    populateTable(items.subredditList.split(","));
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("add_subreddit").addEventListener('click',
    save_options);