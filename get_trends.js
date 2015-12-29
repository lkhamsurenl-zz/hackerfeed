// Format given date to YYYY-MM-DD.
function shortFormatDate(date) {
	day = ('0' + date.getDate()).slice(-2); // Put leading 0 if necessary.
	month = ('0' + (date.getMonth() + 1)).slice(-2); // Month is 0 based.
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

// Given a Json Object with top limit trends, parse and render in popup.html
// page.
function parseDescriptions(title, jsonObj, limit) {
	// Get description and html_url for each entry.
	// TODO(lkhamsurenl): Show only English repositories.
	var links = "<center><h3>" + title + "</h3></center>";
    jQuery.each(jsonObj.items.slice(0, limit), function(i, item) {
    	url = item["html_url"];
    	description = item["description"];
    	language = item["language"];
    	// If no description is given, show the name.
    	if (description == "") {
    		description = item["name"];
    	}
    	links += i + ". ";
    	links += "<a href=" + url + ">" + 
    			 description + "</a>"  + 
    			 " [" + language + "] <br />";
    });
	// Display in the trends paragraph in popup.html page.
	document.getElementById("trends").innerHTML += links;
}

// function to make API call to url and display top limit results.
function makeAPIcall(title, url, limit) {
    // TODO(lkhamsurenl): Cache results for one day, load when it's too old.
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, display the top requests.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            parseDescriptions(title, JSON.parse(xmlhttp.responseText), limit);
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

// Popular repos created within last 7 days.
getTrendingByKeywords("", 7, 15)

// Popular ML repos created within last month.
getTrendingByKeywords("Machine Learning", 30, 15);
