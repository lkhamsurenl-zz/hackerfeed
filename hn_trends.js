// Given items, display items in popup.html.
function render(item) {
    url = item["url"];
    title = item["title"];
    link = "<a href=" + url + ">" + 
        title + "</a> <br />";
    // Display in the trends paragraph in popup.html page.
    document.getElementById("trends").innerHTML += link;
}

function getStory(id) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, add the json value to the desc_items list.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var obj = JSON.parse(xmlhttp.responseText);
            render(obj);
        }
    };
    xmlhttp.open("GET", "https://hacker-news.firebaseio.com/v0/item/" + 
        id + 
        ".json");
    xmlhttp.send();
}

// Get only top limit # of stories from jsonObj.
function limitTopStories(items, limit) {
    var limited_items = items.slice(0, limit);
    for (i = 0; i < limited_items.length; i++) {
        getStory(items[i]);
    }
}

// function to make API call to url and display top limit results.
function callAPI(limit) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, display the top requests.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // Display in the trends paragraph in popup.html page.
            document.getElementById("trends").innerHTML += "<center><h3>HN</h3></center>";
            limitTopStories(JSON.parse(xmlhttp.responseText), limit)
        }
    };
    
    xmlhttp.open("GET", "https://hacker-news.firebaseio.com/v0/newstories.json");
    xmlhttp.send();
}

// Popular 15 stories.
callAPI(15);
