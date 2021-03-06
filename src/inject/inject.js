chrome.extension.sendMessage({}, function(response) {

	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
    var pages = {
      "www.goodreads.com":{"title":"h1#bookTitle", "container":"div#imagecol"},
      "www.amazon.com":{"title":"span#productTitle", "container":"div#MediaMatrix"}
    };

    var domain_name = window.location.hostname
    
    if (domain_name == "www.amazon.com"){
      var category = $("select#searchDropdownBox")[0].value;
      if(category != "search-alias=stripbooks"){return false;}
    }

    var page_type = pages[domain_name];

		var book_title = $(page_type.title).text().trim();

    findBookOnBlinkist(book_title).done(function (response) {
      if(response && response.hits && response.hits[0]){
        var link = "https://www.blinkist.com/en/books/"+response.hits[0].slug+".html";
        var button_html = "<a id='blinkist_btn' class='button' href='"+link+"' target='_blank'>Read on Blinkist</a>";
        var page_container = $(page_type.container);
        page_container.append(button_html);
      }
    });


		// ----------------------------------------------------------

	}
	}, 10);

function findBookOnBlinkist(title){
  var ajax_settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://p3sczpah8s-dsn.algolia.net/1/indexes/books-production/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.22.1&x-algolia-application-id=P3SCZPAH8S&x-algolia-api-key=136653a15d7b60068233c26741bfbe5d",
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": "{\"params\":\"query=[[booktitle]]&attributesToRetrieve=%5B%22title%22%2C%22author%22%2C%22slug%22%2C%22bundle%22%2C%22language%22%2C%22aboutTheBook%22%5D&hitsPerPage=5&attributesToHighlight=%5B%22title%22%2C%22author%22%5D&filters=publishedAt%20%3C%201492844758\"}"
    }

    ajax_settings.data = ajax_settings.data.replace("[[booktitle]]",encodeURI(title));

    return $.ajax(ajax_settings);
}

});