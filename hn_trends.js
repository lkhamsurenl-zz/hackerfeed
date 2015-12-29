// Compare 2 stories based on the scores.
function compareStories(s1, s2) {
    if (s1["score"] < s2["score"])
        return -1;
    if (s1["score"] > s2["score"])
        return 1;
    return 0;
}

function getStory(id, desc_items) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, add the json value to the desc_items list.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            desc_items.push(JSON.parse(xmlhttp.responseText));
        }
    };
    xmlhttp.open("GET", "https://hacker-news.firebaseio.com/v0/item/" + 
        id + 
        ".json");
    xmlhttp.send();
}

// Get only top limit # of stories from jsonObj.
function limitTopStories(jsonObj, limit) {
    var items = jsonObj.items.slice(0, limit * 2);
    var desc_items = [];
    for (i = 0; i < items.length; i++) {
        getStory(items[i], desc_items);
    }
    desc_items.sort(compareStories);
    return desc_items.slice(0, limit);
}

// Given items, display items in popup.html.
function render(items) {
	var links = "<center><h3>HN</h3></center>";
    jQuery.each(items, function(i, item) {
    	url = item["url"];
    	title = item["title"];
    	links += i + ". ";
    	links += "<a href=" + url + ">" + 
    			 title + "</a> <br />";
    });
	// Display in the trends paragraph in popup.html page.
	document.getElementById("trends").innerHTML += links;
}

// function to make API call to url and display top limit results.
function callAPI(limit) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, display the top requests.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var items = limitTopStories(JSON.parse(xmlhttp.responseText), limit)
            render(items);
        }
    };
    
    xmlhttp.open("GET", "https://hacker-news.firebaseio.com/v0/newstories");
    xmlhttp.send();
}

// Popular repos created within last 7 days.
callAPI(15);
