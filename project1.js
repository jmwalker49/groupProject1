/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase

// 2. Create button for adding new date and location

// 3. Create a way to retrieve dates and locatons from database

// 4. Send dates and locations to API's.

// 4. Create a way to make sure dates entered is in the future.
//    
// 5. Display to html

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAzpaNFcg3eaXljRwlEsCD98PrOlPYNaD4",
    authDomain: "nahir-1stproject.firebaseapp.com",
    databaseURL: "https://nahir-1stproject.firebaseio.com",
    storageBucket: "nahir-1stproject.appspot.com",
    messagingSenderId: "959112391565"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding dates and location
$("#submitBtn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input           
  var queryDate = moment($("#date-input").val().trim(), "DD/MM/YY").format("X");// this(.format("X")) puts it in format of ms since midnight jan1 1970
                                          //the ', "DD/MM/YY" ' is saying it is in this format currently  
  var location = $("#location-input").val().trim();

  // Creates local "temporary" object for holding employee data
  var newSearch = {
    location: location,
    date: queryDate
  };

  // Uploads employee data to the database
  database.ref("/travel").push(newSearch); //nh:  this is new (.push) instead of database.ref().set({..creates children

  // Logs everything to console
  console.log(newSearch.name);
  console.log(newSearch.date);//sent to database as ms since midnight Jan 1 1970 ('X')format

// use modal to inform that query is being made

  // Clears all of the text-boxes
  $("#date-input").val("");
  $("#location-input").val("");

  // Prevents moving to new page
  return false;
});

// 3. Create Firebase event for adding dates and locations
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var lcation = childSnapshot.val().location;
  var date = childSnapshot.val().date;
  var empStart = childSnapshot.val().start;//still in ms format (1358053200)
  var empRate = childSnapshot.val().rate;

  // Employee Info
  console.log("CURRENT TIME: " + moment().format("hh:mm:ss"));
  console.log(empName);//roger
  console.log(empRole);//hopper
  console.log(empStart+", typeof empStart: "+typeof empStart);//1358053200 (format = "X"), typeof = string
  console.log("empRate: " +empRate +", empRate type: " + typeof empRate);//3, typeof=string
  
  // Prettify the employee start
  var empStartPretty = moment.unix(empStart).format("MM/DD/YY");
  console.log(moment.unix(empStart));//nh: seems like unix puts it in a moment object: o {_isAMomentObject: true, _i: 1358053200000, _isUTC: false, _pf: Object, _locale: A…}

  // Calculate the months worked using hardcore math
  // To calculate the months worked
  var empMonths = moment().diff(moment.unix(empStart), "months"); //nh: using .diff you tell it what format u want by ..., "format") as opposed .format("format")
  // var empMonths = moment().diff(moment(empStartPretty), "months"); //nh: this works but gives deprecation warning.
  console.log("# of empMonths: "+ empMonths+", type of empMonths: "+typeof empMonths);//typeof empMonths=number

  // Calculate the total billed rate
  var empBilled = empMonths * empRate;
  console.log(empBilled);//typeof = number

  // Add each train's data into the table
  $("#employee-table > tbody").append("<tr><td>" + empName + "</td><td>" + empRole + "</td><td>" +
  empStartPretty + "</td><td>" + empMonths + "</td><td>" + empRate + "</td><td>" + empBilled + "</td></tr>");
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume Employee start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 months.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case
