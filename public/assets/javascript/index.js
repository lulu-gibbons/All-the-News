//run everything after the document has fully loaded
$(document).ready(function() {
  //the div where all the articles will display
  var articleContainer = $(".article-container");
  //when these buttons are clicked, then run the associated functions
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);


  //empty the article-container div everytime function is run
  function initPage() {
    //runs an AJAX get request to the headlines route
    //If the user hasn't saved this article (it's false) then run below function
    $.get("/api/headlines?saved=false").then(function(data) {
      articleContainer.empty();
      //if data exists, then display article
      if (data && data.length) {
        renderArticles(data);
      } else {
        //if data doesn't exist, run below function
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    var articleCards = [];
    //loops through articles and grabs every article and pushes it into the empty array
    for (var i = 0; i < articles.length; i++) {
      //will create a panel for each article pushed into the array
      //runs the createCard function for each article that is returned
      articleCards.push(createCard(articles[i]));
    }
    //then appends each article, one after the other, into the article container
    articleContainer.append(articleCards);
  }

  //creates a card to be displayed to the user so it looks nice
  function createCard(article) {
      // Constructs a jQuery element containing all of the formatted HTML for the article card
      var card = $("<div class='card'>");
      var cardHeader = $("<div class='card-header'>").append(
        $("<h3>").append(
          $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
            .attr("href", article.url)
            .text(article.headline),
          $("<a class='btn btn-success save'>Save Article</a>")
        )
      );

      var cardBody = $("<div class='card-body'>").text(article.summary);

      card.append(cardHeader, cardBody);
      //associates the panel data id with the article id
      //when user chooses to save the article, it knows which article to save based off the id
      card.data("_id", article._id);
      return card;
    }

  //If there are not articles to display, then this function runs
  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }


  //when user clicks the save article button this function runs
  function handleArticleSave() {
    //grabs the panel id and matches it to the associated article id to know which article the user wants to save
    var articleToSave = $(this).parents(".card").data();
    // Remove card from page
    $(this).parents(".card").remove();

    articleToSave.saved = true;
    // Using a put to update an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      //if the article exists then run initPage again - reloads all the articles minus the saved one
      if (data.saved) {
        // Run the initPage function again to reload the entire list of articles
        initPage();
      }
    });
  }

  //if the user chooses to grab the articles again
  function handleArticleScrape() {
    //then run the fetch again and grab the new articles
    $.get("/api/fetch").then(function(data) {
      initPage();
      bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    });
  }

  //clear button function
  function handleArticleClear() {
    $.get("api/clear").then(function() {
      articleContainer.empty();
      initPage();
    });
  }
});
