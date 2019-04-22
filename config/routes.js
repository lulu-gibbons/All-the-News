//brings in the scrape function
var scrape = require("../scripts/scrape");

var headlinesController = require("../controllers/headlines");
var notesController = require("../controllers/notes");

module.exports = function(router) {
  //renders the home page
  router.get("/", function(req, res) {
    res.render("home");
  });
  //renders the saved page
  router.get("/saved", function(req, res) {
    res.render("saved");
  });
  //runs the fetch function in the headlines.js controller
  router.get("/api/fetch", function(req, res) {
    headlinesController.fetch(function(err, docs) {
      if (!docs || docs.insertedCount === 0) {
        res.json({
          message: "No new articles today. Check back tomorrow!"
        });
      } else {
        res.json({
          message: "Added " + docs.insertedCount + " new articles!"
        });
      }
    });
  });
  //returns all data
  router.get("/api/headlines", function(req, res) {
    var query = {};
    if (req.query.saved){
      query = req.query
    }
    headlinesController.get(req.query, function(data) {
      res.json(data);
    });
  });
  //deletes specific article by id
  router.delete("/api/headlines/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;
   //query is the user's request
    headlinesController.delete(query, function(err, data) {
      res.json(data);
    });
  });
  //updates an article
  router.patch("/api/headlines", function(req, res) {
    headlinesController.update(req.body, function(err, data) {
      res.json(data);
    });
  });
  //grabs all the notes associated with a specific article
  router.get("/api/notes/:headline_id?", function(req, res) {
    var query = {};
    //if what the user's chosen article id exists then set the empty query variable to be that id.
    if(req.params.headline_id){
        query._id = req.params.headline_id;
    }
    //returns data associated with user parameters and returns that data
    notesController.get(query, function(err, data) {
      res.json(data);
    });
  });
  //delete a note based off the note id
  router.delete("/api/notes/:id", function(req, res) {
    var query = {};
    query._id = req.params.id;
    notesController.delete(query, function(err, data) {
      res.json(data);
    });
  });
  //posts a new note to articles
  router.post("/api/notes", function(req, res) {
    notesController.save(req.body, function(data) {
      res.json(data);
    });
  });
};
