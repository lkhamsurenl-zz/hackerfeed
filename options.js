function get_values_from_table(table_name) {
  var table = document.getElementById(table_name);
  var values = [];
  // First row of the table is header.
  for (i = 1; i < table.rows.length; i++) {
    value = table.rows[i].cells[0].innerHTML;
    // Add only non empty values.
    if (value != "") {
      values.push(value);
    }
  }
  return values;
}

function get_values_from_tables() {
  subreddits = get_values_from_table("subreddit_table");
  gits = get_values_from_table("git_table");
  return [subreddits, gits];
}

// Update store with subreddit and git values.
function update_options(subs, gits) {
  chrome.storage.sync.set({
    subreddit: subs,
    git: gits,
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
function update_storage_from_tables() {
  // Get all subreddits and set the new value.
  var table_values = get_values_from_tables();
  var subreddits = table_values[0].join();
  var gits = table_values[1].join();
  update_options(subreddits, gits);
}

function add_button_listeners(table_name) {
  var table = document.getElementById(table_name);
  var buttons = document.getElementsByClassName(table_name + "_remove_buttons");
  for (i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function(){
      // Remove row from the table.
      table.deleteRow(this.id);
      update_storage_from_tables();
    });
  }
}

// Populate row with item and removal button.
function populate_row(table_name, row, item, index) {
  // Insert the item in first cell.
  row.insertCell(0).innerHTML = item;
  // Insert removal button on second cell.
  button_class = table_name + "_remove_buttons";
  row.insertCell(1).innerHTML = "<button id='" + index + 
    "'class='" + button_class + "'>X</button>";
}

// Populate the options table with items.
function populate_table(table_name, items) {
  var table = document.getElementById(table_name);
  var table_length = table.rows.length;
  for (i = 0; i < items.length; i++) {
    // Add item only if it's non empty.
    if (items[i] != "") {
      var row = table.insertRow(-1);
      populate_row(table_name, row, items[i], table_length);
      table_length++
    }
  }
  // Add Button Listeners once it's been populated.
  add_button_listeners(table_name);
}

// Saves options to chrome.storage.sync.
// Assume option: git or subreddit.
function save_options(e) {
  option = e.target.optionParam;
  table_name = option + "_table";
  var table = document.getElementById(table_name);
  // Get new value and insert to the table.
  var new_value = document.getElementById(option).value;
  var new_row = table.insertRow(-1);
  populate_row(table_name, new_row, new_value, table.rows.length - 1);
  // Reflect the table change on storage.
  update_storage_from_tables();
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value subreddits: "".
  chrome.storage.sync.get({
    subreddit: "",
    git: "",
  }, function(items) {
    populate_table("subreddit_table", items.subreddit.split(","));
    populate_table("git_table", items.git.split(","));
  });
}

// button listener to add new entry to corresponding table.
function addButtonListener(option) {
  var button_id = "add_" + option;
  var add_button = document.getElementById(button_id);
  add_button.addEventListener('click', save_options, false);
  add_button.optionParam = option;
}

// Restore options when document is loaded.
document.addEventListener('DOMContentLoaded', restore_options);
// Add button listeners for both subreddit and git.
addButtonListener("subreddit");
addButtonListener("git");
