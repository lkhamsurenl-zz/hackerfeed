// Given items, display items in popup.html.
function renderArxiv(items) {
    var links = "<center><h3 id='arxiv_header'>arXiv</h3></center>";
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

// Most recent 15 papers.
$.ajax({
    url: "http://export.arxiv.org/api/query?search_query=cat:cs.DS"+
    	"&sortBy=lastUpdatedDate&sortOrder=descending&start=0&max_results=15",
    type: "GET",
    dataType: "html",
    	success: function(data) {
    	// Generate items for easy rendering.
    	items = generateItems(data);

		renderArxiv(items);
    }
});
