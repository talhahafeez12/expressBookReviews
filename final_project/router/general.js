const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "Customer already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register Customer."});
});

axios.get('https://talhahafeez0-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/')
.then(response => {
    console.log(response.data);
}).catch(error => {
    console.log('Error fetching data: ', error);
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

axios.get('https://talhahafeez0-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/1')
.then(response => {
    console.log(response.data);
}).catch(error => {
    console.log('Error fetching data: ', error);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    let isbn = req.params.isbn;
    res.send(books[isbn]);
});

axios.get('https://talhahafeez0-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/Unknown')
.then(response => {
    console.log(response.data);
}).catch(error => {
    console.log('Error fetching data: ', error);
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let isbns = Object.keys(books);
  let author = req.params.author;
  let authors_books = { "booksbyauthor": [] };
  for (let i = 0; i < isbns.length; i++) {
    if (books[parseInt(isbns[i])].author === author) {
        let book_info = JSON.stringify(books[parseInt(isbns[i])]);
        book_info = JSON.parse(book_info);
        book_info["ISBN"] = parseInt(isbns[i]);
        authors_books["booksbyauthor"].push(book_info);
    }
  }
  res.send(authors_books);
});

axios.get('https://talhahafeez0-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/Things Fall Apart')
.then(response => {
    console.log(response.data);
}).catch(error => {
    console.log('Error fetching data: ', error);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let isbns = Object.keys(books);
    let title = req.params.title;
    let titles_books = { "booksbytitle": [] };
    for (let i = 0; i < isbns.length; i++) {
      if (books[parseInt(isbns[i])].title === title) {
          let book_info = JSON.stringify(books[parseInt(isbns[i])]);
          book_info = JSON.parse(book_info);
          book_info["ISBN"] = parseInt(isbns[i]);
          titles_books["booksbytitle"].push(book_info);
      }
    }
    res.send(titles_books);

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  res.send(books[req.params.isbn].reviews);
});



module.exports.general = public_users;
