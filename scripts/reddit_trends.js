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
        score = item["data"]["score"];
        links += "<li><a href=" + url + ">" + 
                 title + "</a> [ " +
                 score + 
                 " ] </li>";
    });
    links += "</ul>"

    document.getElementById("reddit_trends").innerHTML += links;
}

// Return first numEntries items that are above minScore threshold. 
function filterTopItemsReddit(items, numEntries, minScore) {
    var topItems = [];
    for (i = 0; i < items.length; i++) {
        if (items[i]["data"]["score"] >= minScore) {
            topItems[topItems.length] = items[i];
        }
        // Done collecting numEntries number of items.
        if (topItems.length == numEntries) break;
    }
    return topItems;
}

// function to make API call to url and display top numEntries results.
function callAPIReddit(subreddit, numEntries) {
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        // if the request succeed, display the top requests.
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // Filter out items score less than 3.
            topItems = filterTopItemsReddit(
                JSON.parse(xmlhttp.responseText)["data"]["children"], 
                numEntries, 3);
            // Display in the trends paragraph in popup.html page.
            renderReddit(subreddit, topItems);
        }
    };
    
    xmlhttp.open("GET", "http://www.reddit.com/r/" + 
        subreddit + 
        "/top.json?sort=score");
    xmlhttp.send();
}

// Get list of subreddits to load from storage.
function read_options(numEntries) {
  // Use default value subreddits: "".
  chrome.storage.sync.get({
    subreddit: "",
    }, function(items) {
        if (items.subreddit == "") {
            return;
        }
        var subreddits = items.subreddit.split(",");
        for (i = 0; i < subreddits.length; i++) {
            callAPIReddit(subreddits[i], numEntries);
        }
  });
}

read_options(10);
