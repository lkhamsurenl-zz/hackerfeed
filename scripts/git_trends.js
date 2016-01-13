// Format given date to YYYY-MM-DD.
function shortFormatDate(date) {
    // Put leading 0 if necessary on month and days.
	day = ('0' + date.getDate()).slice(-2);
    // Month is 0 based. Jan - 0, Dec - 11.
	month = ('0' + (date.getMonth() + 1)).slice(-2);
	year = date.getFullYear();

	return year + "-" + month + "-" + day;
}

function subtractedDaysFromCurrent(num_days) {
    // Get current date.
	var start_date = new Date();
    // Subtract num_days from current date.
	start_date.setTime(start_date.getTime() - num_days*24*60*60*1000);

	return start_date;
}

// Given top items with trends, parse and render in popup.html page.
function parseDescriptions(title, items) {
	// Get description and html_url for each entry.
	var links = "<center><h3 id='git_header'>" + 
        "<img src='assets/github.png' height='16' width='16'>" + 
        "&nbsp" + 
        title + 
        "</h3></center>";
    links += "<ul>";
    jQuery.each(items, function(i, item) {
    	url = item["html_url"];
        // Get name if the repo has no description.
    	description = item["description"] != "" ? 
            item["description"] :
            item["name"];
        // Display no language if no language detected for the repo.
    	language = item["language"] ? " [ " + item["language"] + " ] " : "";
        // Construct a link with description.
    	links += "<li><a href=" + url + ">" + 
    			 description + "</a>"  + 
    			 language + "</li>";
    });
    links += "</ul>";
	// Display in the trends paragraph in popup.html page.
	document.getElementById("git_trends").innerHTML += links;
}

// Filter bad items satisfying:
// 1. item has neither description nor name.
// 2. item should contain 70% English characters and numbers (Otherwise
//    non-readable).
function filterItems(items, limit) {
    var topItems = [];
    var english = /[A-Za-z0-9]/g;
    for (i = 0; i < items.length; i++) {
        var description = items[i]["description"] != "" ?
            items[i]["description"] :
            items[i]["name"];
        if (description == null || description == "") continue;
        if (description.replace(english, '').length > 0.3 * description.length)
            continue;

        topItems[topItems.length] = items[i];
        if (topItems.length == limit) break;
    }
    return topItems;
}

// function to make API call to url and display top limit results.
function makeAPIcall(title, url, limit) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        // if the request succeed, display the top requests.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var topItems = filterItems(JSON.parse(xmlhttp.responseText).items,
                limit);
            parseDescriptions(title, topItems);
        }
    };

    
    xmlhttp.open("GET", url);
    xmlhttp.send();
}

// Get Popular repos created within days with keyword, display only top limit
// results.
// "" keyword is a default value.
function getTrendingByKeywords(keyword, days, limit) {
    
    var short_date = shortFormatDate(subtractedDaysFromCurrent(days));

    var url = "https://api.github.com/search/repositories?q=" + 
        keyword +
        " created:>" + 
        short_date + 
        "&sort=stars&order=desc";

    var title = (keyword == "" ? "Recent top repositories" : keyword + " ");
    makeAPIcall(title, url, limit);
}

// Get list of subreddits to load from storage.
function read_options() {
  // Use default value subreddits: "".
  chrome.storage.sync.get({
    git: "",
    }, function(items) {
        var gits = items.git.split(",");
        for (i = 0; i < gits.length; i++) {
            // Popular repos created within last month.
            getTrendingByKeywords(gits[i], 30, 15);
        }
  });
}

// Popular repos created within last 7 days.
getTrendingByKeywords("", 7, 15)
read_options()
