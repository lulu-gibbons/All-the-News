//Scrapes NYT articles

//axios simplifies http calls
var axios = require("axios");
//var request = require("request");
//allows you to use jQuery syntax while working with the data scraped from the web
var cheerio = require("cheerio");

var scrape = function(cb) {
  //requesting data from the ny times site
  //body will be all the data received
  axios.get("https://www.nytimes.com/").then(function(res) {
    //load body with cheerio & give it the $ var as a selector so it can be used like jQuery
    var $ = cheerio.load(res.data);
    var articles = [];
    $("article").each(function(i, element) {

    //grab the text in the header, summary and the url from each article and assignig to new variables
      var head = $(this).find("h2").text();
      var sum = $(this).children("p").text().trim();
      var url = "https://www.nytimes.com" + $(this).find("a").attr("href");

      //if the scraper was able to grab a summary and headline run a replace regex method
      if (head && sum && url) {
        //removes blank lines from a string
        var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        //allows the ability to assign the above to the attributes in our Headline.js model
        var dataToAdd = {
          headline: headNeat,
          summary: sumNeat,
          url: url
        };
        //pushes the above data to the articles array
        articles.push(dataToAdd);
      }
    });
    //returns articles that were scraped
    cb(articles);
  });
};

module.exports = scrape;
