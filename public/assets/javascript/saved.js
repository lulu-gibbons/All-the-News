//run everything after the document has fully loaded
$(document).ready(function() {
  //the div where all the articles will display
  var articleContainer = $(".article-container");
  //buttons for deleting articles and notes, buttons for adding and saving a note
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);
  //after document has loaded, run initPage()
  initPage();

  function initPage() {
    //empty the article-container div everytime function is run
    articleContainer.empty();
    //runs an AJAX get request to the headlines route
    //If the user saves this article (it's true) then run below function
    $.get("/api/headlines?saved=true").then(function(data) {
      //if data exists, then display article
      if (data && data.length) {
        renderArticles(data);
      } else {
        //if data doesn't exist, run below function
        renderEmpty();
      }
    });
  }

  //if their are saved articles....
  function renderArticles(articles) {
    //loops through articles and grabs every article and pushes it into the empty array
    var articlePanels = [];
    //will create a panel for each article pushed into the array
    //runs the createPanel function for each article that is returned
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    //then appends each article, one after the other, into the article container
    articleContainer.append(articlePanels);
  }

  //creates a panel to be displayed to the user so it looks nice
  function createPanel(article) {
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.url + "'>",
        article.headline,
        "</a>",
        "<a class='btn btn-info delete'>", //delete saved article button
        "Delete From Saved",
        "</a>",
        "<a class='btn btn-danger notes'>Article Notes</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    //associates the panel data id with the article id
    //when user chooses to save the article, it knows which article to save based off the id
    panel.data("_id", article._id);
    return panel;
  }

  function renderEmpty() {
    //function alerts user that there are no saved articles and asks if they want to browse articles
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Looks like you don't have any saved articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would you like to browse the available New York Times articles?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    articleContainer.append(emptyAlert);
  }

  //runs from the handleArticleNotes() function
  function renderNotesList(data) {
    //creates an empty array to hold the notes that need to be rendered
    var notesToRender = [];
    var currentNote;
    //if there is not length to the note, it doesn't exist
    if (!data.notes.length) {
      //if a note doesn't exist then it will display....
      currentNote = ["<li class='list-group-item'>", "No notes for this article yet.", "</li>"].join("");
      //and push the current not the user is creating/adding to the notesToRender array
      notesToRender.push(currentNote);
    } else { //if there are existing notes...
      //it will loop through all the notes and append this new note onto the existing notes.
      for (var i = 0; i < data.notes.length; i++) {
        currentNote = $(
          [
            "<li class='list-group-item note'>",
            data.notes[i].noteText,
            "<button class='btn btn-danger note-delete'>x</button>", //adds delete button
            "</li>"
          ].join("")
        );
        //attaches an id to the delete button
        currentNote.children("button").data("_id", data.notes[i]._id);
        //and push the current not the user is creating/adding to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    //appends the notes from the array into a container to display them
    $(".note-container").append(notesToRender);
  }

  //if user clicks on the delete article button...
  function handleArticleDelete() {
    var articleToDelete = $(this).parents(".panel").data();
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      //if the article is deleted successfully, then run initPage() to reload saved articles minus deleted article
      if (data.ok) {
        initPage();
      }
    });
  }

  //displays the notes associated with the article id
  function handleArticleNotes() {
    //creates a variable out of the data associated with article panel we are choosing to grab notes from
    var currentArticle = $(this).parents(".panel").data();
    //grabs the note with that article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      //builds the html that will hold the note
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle._id,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");
      //adds that formatted note to a modal(popup box) that will display the note
      bootbox.dialog({
        message: modalText,
        //the modal will have a close button
        closeButton: true
      });
      //this is the note data that is associated with the article id
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      //displays a button to allow the note to be saved.
      $(".btn.save").data("article", noteData);
      //the function that will actually show the user created note in the modal
      renderNotesList(noteData);
    });
  }

  //function for when user tries to save a note they have made
  function handleNoteSave() {
    var noteData;
    //creates a new variable that is what they typed into the note text area minus white space
    var newNote = $(".bootbox-body textarea").val().trim();
    //if the user actually added a note then associate that note to the article id and post the note (add note to db)
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        //when that is all done, close the modal
        bootbox.hideAll();
      });
    }
  }

  //deletes a note
  function handleNoteDelete() {
    //each note has a delete button that had the id stored in it when created in the renderNotesList() function
    var noteToDelete = $(this).data("_id");
    //using that id, run a delete request to remove this note from the db
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {

      bootbox.hideAll();
    });
  }
});
