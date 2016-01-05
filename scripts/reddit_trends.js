// Given items, display items in popup.html.
function renderReddit(subreddit, items) {
    var links = "<center><h3 id='reddit_header'>" +
        "<img src='assets/reddit.png' alt='Reddit' style='width:24px;height:24px;'>" + 
        "&nbsp" + 
        subreddit + 
        "</h3></center>";
    links += "<ul>"
    jQuery.each(items, function(i, item) {
        // Resolve undefined url by displaying the story in ycombinator website.
        url = item["data"]["url"];
        title = item["data"]["title"];
        score = item["data"]["score"]
        links += "<li><a href=" + url + ">" + 
                 title + "</a> [ " +
                 score + 
                 " ] </li>";
    });
    links += "</ul>"

    document.getElementById("reddit_trends").innerHTML += links;
}

// function to make API call to url and display top limit results.
function callAPI(subreddit, limit) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, display the top requests.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // Display in the trends paragraph in popup.html page.
            renderReddit(subreddit, 
                JSON.parse(xmlhttp.responseText)["data"]["children"].slice(0, limit));
        }
    };
    
    xmlhttp.open("GET", "http://www.reddit.com/r/" + 
        subreddit + 
        "/top.json?sort=score");
    xmlhttp.send();
}

// Popular 15 stories.
callAPI("cscareerquestions", 15);
callAPI("machinelearning", 15);
