//brings in the script to use -> date script
var makeDate = require("../scripts/date");
//brings in Note model to use
var Note = require("../models/Note");

//a fetch function is not used because note data is user created and not scraped
module.exports = {
  //grabs all the notes that are tied to the healineId
  get: function(data, cb) {
    Note.find({
      _headlineId: data._id
    }, cb);
  },
  save: function(data, cb) {
    //saves the new user note that is associated to the _headlineId
    //gives it a date
    //noteText is just what user puts in
    var newNote = {
      _headlineId: data._id,
      date: makeDate(),
      noteText: data.noteText
    };
    //create a new note from the above function
     Note.create(newNote, function(err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        //if not error, takes the new created note and passes it back to the callback function
        console.log(doc);
        cb(doc);
      }
    });
  },
  //delete a note associated with a specifc article
  delete: function(data, cb) {
    Note.remove({
      _id: data._id
    }, cb);
  }
};
