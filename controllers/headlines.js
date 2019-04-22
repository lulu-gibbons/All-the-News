//brings in the script to use -> date script & scrape script
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");
//brings in Headline model to use
var Headline = require("../models/Headline");

module.exports = {
  //when fetch is run, run the following scrape function
  //scrapes articles and if the headline is unique it will add it to the mongo db collection
  fetch: function(cb) {
    scrape(function(data) {
      var articles = data;
      //loops through the data scraped, gives it a date & defaults to unsaved
      for (var i = 0; i < articles.length; i++) {
        articles[i].date = makeDate();
        articles[i].saved = false;
      }
      //A Mongo function
      //saves the articles into the Headline collection in the mongo db
      Headline.collection.insertMany(articles, { ordered: false }, function(err, docs) {
        //the callback error function allows the error to happen but keeps going through
        //the articles and add them to the mongo db collection until the for loop function is done running
        cb(err, docs); //returns the error to display in the docs
      });
    });
  },
  //remove an article
  delete: function(query, cb) {
    Headline.remove(query, cb);
  },
  //gets all the articles from the Headlines collection
  get: function(query, cb) {
    Headline.find(query)
      //sorts by most recent
      .sort({
        _id: -1
      })
      .exec(function(err, doc) {
        cb(doc);
      });
  },
  update: function(query, cb) {
    Headline.update({_id: query._id}, {
      $set: query
    }, {}, cb);
  }
};
