function get_values_from_table() {
  var table = document.getElementById('subreddit_table');
  var values = [];
  for (i = 1; i < table.rows.length; i++) {
    values[i] = table.rows[i].cells[0].innerHTML;
  }
  return values;
}

// Update store with subredditList: value
function update_options(value) {
  chrome.storage.sync.set({
    subredditList: value,
    }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Reflect table change in storage.
function table_change() {
  // Get all subreddits and set the new value.
  var subreddits = get_values_from_table();
  update_options(subreddits.join());
}

function add_button_listeners() {
  var table = document.getElementById('subreddit_table');
  var buttons = document.getElementsByClassName("remove_buttons");
  for (i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(){
      // Remove row from the table.
      table.deleteRow(this.id);
      table_change();
    });
  }
}

// Populate row with item and removal button.
function populate_row(row, item) {
  // Insert the item in first cell.
  row.insertCell(0).innerHTML = item;
  // Insert removal button on second cell.
  row.insertCell(1).innerHTML = "<button id='" + i + 
    "'class='remove_buttons'>X</button>";
}

// Populate the options table with items.
function populate_table(items) {
  var table = document.getElementById('subreddit_table');
  for (i = 0; i < items.length; i++) {
    var row = table.insertRow(-1);
    populate_row(row, items[i]);
  }
  // Add Button Listeners once it's been populated.
  add_button_listeners();
}

// Saves options to chrome.storage.sync.
function save_options() {
  var table = document.getElementById('subreddit_table');
  // Get new value and insert to the table.
  var new_val = document.getElementById('subreddit').value;
  var new_row = table.insertRow(-1);
  populate_row(new_row, new_val);
  table_change()
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    subredditList: "",
  }, function(items) {
    populate_table(items.subredditList.split(","));
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById("add_subreddit").addEventListener('click',
    save_options);
