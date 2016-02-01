// Given items, display items in popup.html.
function renderHN(items) {
    var links = "<center><h3 id='hn_header'>Hacker News</h3></center>";
    links += "<ul>"
    jQuery.each(items, function(i, item) {
        // Resolve undefined url by displaying the story in ycombinator website.
        url = item["url"] == "" || typeof item["url"] === "undefined" ? 
            ("https://news.ycombinator.com/item?id=" + item["id"]) :
            item["url"];
        title = item["title"];
        score = item["score"]
        links += "<li><a href=" + url + ">" + 
                 title + "</a> [ " +
                 score + 
                 " ] </li>";
    });
    links += "</ul>"

    document.getElementById("hn_trends").innerHTML += links;
}

// get story for an individual item based on the id, then callback.
function getStoryHN(id, callback) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, add the json value to the desc_items list.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var obj = JSON.parse(xmlhttp.responseText);
            callback(obj);
        }
    };
    xmlhttp.open("GET", "https://hacker-news.firebaseio.com/v0/item/" + 
        id + 
        ".json");
    xmlhttp.send();
}

function topStoriesHN(items) {
    var stories = [];
    for (i = 0; i < items.length; i++) {
        getStoryHN(items[i], function(obj){
            // given a obj, it pushes it into the value before rendering.
            stories[stories.length] = obj;
            if (stories.length == items.length) {
                renderHN(stories);
            } 
        });
    }
}

// function to make API call to url and display top numEntries results.
function callApiHN(numEntries) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, display the top requests.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // Display in the trends paragraph in popup.html page.

            topStoriesHN(JSON.parse(xmlhttp.responseText).slice(0, numEntries));
        }
    };
    
    xmlhttp.open("GET", "https://hacker-news.firebaseio.com/v0/topstories.json");
    xmlhttp.send();
}

console.log("HN ");
// Popular numEntries stories.
callApiHN(10);
