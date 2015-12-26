var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
	// if the request succeed, display the top 10 request in the console.
	// TODO(lkhamsurenl): Change console to a HTML.
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var descriptions = parseDescriptions(JSON.parse(xmlhttp.responseText));
    }
};

xmlhttp.open("GET", "https://api.github.com/search/repositories?q=created:>2015-12-20&sort=stars&order=desc");
xmlhttp.send();


function parseDescriptions(myJson) {
	var items = myJson.items;
	// Get description and html_url for each entry.
	// TODO(lkhamsurenl): Figure out a way to only add English repositories.
	var vPool="";
    jQuery.each(myJson.items, function(i, item) {
    	vPool += "<a href=" + item["html_url"] + ">" + item["description"] + "</a> <br />";
    });
	
	document.getElementById("trends").innerHTML = vPool;
}

