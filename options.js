/******************************************************************************
                          WRITING TO STORAGE
******************************************************************************/
// Create mapping based on table_name and value.
function map_options(table_name, values) {
  var mapping = {};
  switch (table_name) {
    case "subreddit_table":
      mapping = {subreddit: values};
      break;
    case "git_table":
      mapping = {git: values};
      break;
  }
  return mapping;
}

// Update store with subreddit and git values.
function update_options(table_name, values) {
  var mapping = map_options(table_name, values);
  chrome.storage.sync.set(mapping, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Reflect table change in storage.
function update_storage_from_table(table_name) {
  var table_values = get_values_from_table(table_name);
  update_options(table_name, table_values);
}

/******************************************************************************
                              CHANGE TABLE
******************************************************************************/

// Given a table name, get all the values in the table.
function get_values_from_table(table_name) {
  var table = document.getElementById(table_name);
  var values = [];
  // First row of the table is header, so skip.
  for (i = 1; i < table.rows.length; i++) {
    value = table.rows[i].cells[0].innerHTML;
    // Add only non empty values.
    if (value != "") {
      values.push(value);
    }
  }
  return values.join();
}

// Populate row with item and removal button.
function populate_row(table_name, row, item, index) {
  // Insert the item in first cell.
  row.insertCell(0).innerHTML = item;
  // Insert removal button on second cell.
  button_id = table_name + "," + index;
  row.insertCell(1).innerHTML = "<button id='" + button_id + 
    "'>X</button>";
  // Add button listener when clicked.
  add_button_listener(button_id);
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
}

/******************************************************************************
                      SYNCRONIZE TABLES AND STORAGE
******************************************************************************/

// Saves options to chrome.storage.sync.
// Assume option: git or subreddit.
function save_options(e) {
  option = e.target.optionParam;
  table_name = option + "_table";
  var table = document.getElementById(table_name);
  // Get new value and insert to the table.
  var input_field = document.getElementById(option);
  var new_value = input_field.value;
  var new_row = table.insertRow(-1);
  populate_row(table_name, new_row, new_value, table.rows.length - 1);
  // Reflect the table change on storage.
  update_storage_from_table(table_name);
  // Update input_field value to "".
  input_field.value = "";
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

/******************************************************************************
                              ADD LISTENERS
******************************************************************************/

// Add listener to a given button, when clicked.
function add_button_listener(button_id) {
  // button_id has format: "table_name,index"
  var ids = button_id.split(",");
  var table_name = ids[0];
  var index = ids[1];

  // Get table and button.
  var table = document.getElementById(table_name);
  var button = document.getElementById(button_id);

  button.addEventListener("click", function(){
    // Remove row from the table.
    table.deleteRow(index);
    // Updade storage based on the table.
    update_storage_from_table(table_name);
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
