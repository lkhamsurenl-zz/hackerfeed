var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
	// if the request succeed, display the top 10 request in the console.
	// TODO(lkhamsurenl): Change console to a HTML.
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var descriptions = parseDescriptions(JSON.parse(xmlhttp.responseText));
    }
};
// TODO(lkhamsurenl): Fix hard coded start date.
// Start date is a week earlier than today.
var start_date = new Date();
start_date.setDate(start_date.getDate() - 7);
day = start_date.getDate();
month = start_date.getMonth() + 1; // Month is 0 based.
year = start_date.getFullYear();
var short_date = year + "-" + month + "-" + day;

xmlhttp.open("GET", "https://api.github.com/search/repositories?q=created:>" + 
	short_date + 
	"&sort=stars&order=desc");
xmlhttp.send();

// Given a Json Object with top trends, parse and render in popup.html page.
function parseDescriptions(jsonObj) {
	// Get description and html_url for each entry.
	// TODO(lkhamsurenl): Figure out a way to only add English repositories.
	var links = "";
    jQuery.each(jsonObj.items, function(i, item) {
    	links += i + ". "
    	links += "<a href=" + item["html_url"] + ">" + item["description"] + "</a> <br />";
    });
	// Display in the trends paragraph in popup.html page.
	document.getElementById("trends").innerHTML = links;
}

