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
    case "arxiv_table":
      mapping = {arxiv: values};
      break;
  }
  return mapping;
}

// Update store with table values.
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
  update_options(table_name, table_values.join());
}

/******************************************************************************
                              CHANGE TABLE
******************************************************************************/

// Given a table name, get all the values in the table.
function get_values_from_table(table_name) {
  // values: All the values in table.
  var table, values;
  
  table = document.getElementById(table_name);
  values = [];
  // First row of the table is header, so skip.
  for (i = 1; i < table.rows.length; i++) {
    value = table.rows[i].cells[0].innerHTML;
    // Add only non empty values.
    if (value != "") {
      values[values.length] = value;
    }
  }
  return values;
}

// Populate row with item and removal button.
function populate_row(table_name, row, item, index) {
  // Insert the item in first cell.
  row.insertCell(0).innerHTML = item;
  // Insert removal button on second cell.
  button_id = table_name + "," + index;
  row.insertCell(1).innerHTML = "<button id='" + button_id + "'>X</button>";
  // Add button listener when clicked.
  add_button_listener(button_id);
}

// Populate the options table with items.
function populate_table(table_name, items) {
  var table, table_length;

  table = document.getElementById(table_name);
  table_length = table.rows.length;
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
function save_options(e) {
  // input_field: input field for corresponding table.
  // new_value: new value entered in input_field
  var table, input_field, new_value;

  // Assume option: git or subreddit.
  option = e.target.optionParam;
  table_name = option + "_table";
  table = document.getElementById(table_name);

  input_field = document.getElementById(option);
  new_value = input_field.value;

  // if the value does not already exist, add to the table.
  if (get_values_from_table(table_name).indexOf(new_value) < 0) {
    var new_row = table.insertRow(-1);
    populate_row(table_name, new_row, new_value, table.rows.length - 1);
    // Reflect the table change on storage.
    update_storage_from_table(table_name);
  }

  // Update input_field value to "".
  input_field.value = "";
}

// Restores select box and checkbox state using the preferences stored in
// chrome.storage.
function restore_options() {
  // Use default value subreddits: "".
  chrome.storage.sync.get({
    subreddit: "",
    git: "",
    arxiv: "",
  }, function(items) {
    populate_table("subreddit_table", items.subreddit.split(","));
    populate_table("git_table", items.git.split(","));
    populate_table("arxiv_table", items.arxiv.split(","))
  });
}

/******************************************************************************
                              ADD LISTENERS
******************************************************************************/

// Add listener to a given button, when clicked.
function add_button_listener(button_id) {
  // ids: [table_name, index]
  // table_name: table name, in which button is located.
  // table: corresponding table.
  // index: row's index in table.
  var ids, table_name, table, index, button;

  // button_id has format: "table_name,index"
  ids = button_id.split(",");
  table_name = ids[0];
  index = ids[1];

  // Get table and button.
  table = document.getElementById(table_name);
  button = document.getElementById(button_id);

  button.addEventListener("click", function(){
    // Remove row from the table.
    table.deleteRow(index);
    // Updade storage based on the table.
    update_storage_from_table(table_name);
  });
}

// Button listener to add new entry to corresponding table.
function addButtonListener(option) {
  var button_id, button;

  button_id = "add_" + option;
  // Add event listener for the button.
  button = document.getElementById(button_id);
  button.addEventListener('click', save_options, false);
  button.optionParam = option;
}

// Restore options when document is loaded.
document.addEventListener('DOMContentLoaded', restore_options);
// Add button listeners for both subreddit and git.
addButtonListener("subreddit");
addButtonListener("git");
addButtonListener("arxiv");
