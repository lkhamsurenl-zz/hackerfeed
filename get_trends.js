// Format given date to YYYY-MM-DD.
function shortFormatDate(date) {
	day = date.getDate();
	month = date.getMonth() + 1; // Month is 0 based.
	year = date.getFullYear();

	return year + "-" + month + "-" + day;
}

function subtractedDaysFromCurrent(num_days) {
	var start_date = new Date();
	start_date.setDate(start_date.getDate() - num_days);
	return start_date;
}

// Given a Json Object with top trends, parse and render in popup.html page.
function parseDescriptions(jsonObj) {
	// Get description and html_url for each entry.
	// TODO(lkhamsurenl): Show only English repositories.
	var links = "";
    jQuery.each(jsonObj.items, function(i, item) {
    	url = item["html_url"];
    	description = item["description"];
    	// If no description is given, show the name.
    	if (description == "") {
    		description = item["name"];
    	}
    	links += i + ". ";
    	links += "<a href=" + url + ">" + description + "</a> <br />";
    });
	// Display in the trends paragraph in popup.html page.
	document.getElementById("trends").innerHTML = links;
}

// TODO(lkhamsurenl): Cache results for one day, load when it's too old.
var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
	// if the request succeed, display the top requests.
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        parseDescriptions(JSON.parse(xmlhttp.responseText));
    }
};

// Get a date in short_format 7 days from current date.
var short_date = shortFormatDate(subtractedDaysFromCurrent(7));

// Make API call to get the top repositories created since short_date.
xmlhttp.open("GET", "https://api.github.com/search/repositories?q=created:>" + 
	short_date + 
	"&sort=stars&order=desc");
xmlhttp.send();
