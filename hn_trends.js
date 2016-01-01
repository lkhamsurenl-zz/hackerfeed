// Given items, display items in popup.html.
function render(items) {
    var links = "<center><h3>HN</h3></center>";
    links += "<ul>"
    jQuery.each(items, function(i, item) {
        console.log(item);
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

    document.getElementById("trends").innerHTML += links;
}

// get story for an individual item based on the id, then callback.
function getStory(id, callback) {
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

function topStories(items) {
    var stories = [];
    for (i = 0; i < items.length; i++) {
        getStory(items[i], function(obj){
            // given a obj, it pushes it inot the value before rendering.
            stories.push(obj);
            if (stories.length == items.length) {
                render(stories);
            } 
        });
    }
}

// function to make API call to url and display top limit results.
function callAPI(limit) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, display the top requests.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // Display in the trends paragraph in popup.html page.
            topStories(JSON.parse(xmlhttp.responseText).slice(0, limit));
        }
    };
    
    xmlhttp.open("GET", "https://hacker-news.firebaseio.com/v0/topstories.json");
    xmlhttp.send();
}

// Popular 15 stories.
callAPI(15);
