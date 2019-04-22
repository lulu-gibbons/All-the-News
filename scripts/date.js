//a variable that will give us a date to use
var makeDate = function() {
  var d = new Date();
  //will hold the date after we've set it up in the correct format
  var formattedDate = "";
  //gets the month, day & year
  formattedDate += (d.getMonth() + 1) + "_"; //+ 1 so month increments from 1
  formattedDate += d.getDate() + "_";
  formattedDate += d.getFullYear();

  return formattedDate;
};

module.exports = makeDate;
