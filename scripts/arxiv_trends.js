// Given items, display items in popup.html.
function renderArxiv(keyword, items) {
    var links = "<center><h3 id='arxiv_header'>arXiv - " + keyword +  
        "</h3></center>";
    links += "<ul>"
    jQuery.each(items, function(i, item) {
        url = item["url"];
        title = item["title"];
        links += "<li><a href=" + url + ">" + 
                 title + "</a> </li>";
    });
    links += "</ul>"

    document.getElementById("arxiv_trends").innerHTML += links;
}

// generateItems generates url, title pair for each paper from html data.
function generateItems(data) {
	var html = $.parseHTML(data); 
    var entries = $(html).find('entry');
    var items = [];
    for (i = 0; i < entries.length; i++) {
    	var el = document.createElement('html');
    	el.innerHTML = $(entries[i]).html();
    	items[items.length] = {
    		"url": el.getElementsByTagName('id')[0].innerHTML,
    		"title": el.getElementsByTagName('title')[0].innerHTML
    	}
    }
    return items;
}

function getArxivComponentByKeyword(keyword, numEntries) {
    // Most recent numEntries papers.
    $.ajax({
        url: "http://export.arxiv.org/api/query?search_query=cat:" + keyword + 
            "&sortBy=lastUpdatedDate&sortOrder=descending&start=0&max_results="+ 
            numEntries,
        type: "GET",
        dataType: "html",
            success: function(data) {
            // Generate items for easy rendering.
            items = generateItems(data);

            renderArxiv(keyword, items);
        }
    });
}


// Get list of arxiv componenets to load from storage.
function loadArxivOptions(numEntries) {
  // Use default value subreddits: "".
  chrome.storage.sync.get({
    arxiv: "",
    }, function(items) {
        var arxivComponents = items.arxiv.split(",");
        for (i = 0; i < arxivComponents.length; i++) {
            getArxivComponentByKeyword(arxivComponents[i], numEntries);
        }
  });
}

loadArxivOptions(10);