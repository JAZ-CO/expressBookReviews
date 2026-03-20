const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    if(isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(400).json({message: "User already exists!"});
    }
  }
  return res.status(300).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here'
  axios.get('https://github.com/JAZ-CO/expressBookReviews/blob/main/final_project/router/booksdb.js').then(response => {
    return res.status(300).send(JSON.stringify(response.data,null,4));
  }).catch(error => {
    return res.status(500).send(JSON.stringify({message: "Error fetching books"},null,4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let book = null;
  axios.get('https://github.com/JAZ-CO/expressBookReviews/blob/main/final_project/router/booksdb.js').then(response => {
    book = response.data[req.params.isbn];
    }).catch(error => {
    return res.status(500).send(JSON.stringify({message: "Error fetching book"},null,4));
  });
  if(book){
  return res.status(300).send(JSON.stringify(book,null,4));
  } else {
    return res.status(500).send(JSON.stringify({message: "ISBN not found"},null,4));
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let book = null;
  axios.get('https://github.com/JAZ-CO/expressBookReviews/blob/main/final_project/router/booksdb.js').then(response => {
    books = response.data;
    for(let i = 1; i <= Object.keys(books).length; i++){
      if(books[i].author === req.params.author){
        book = books[i];
        break;
      }
    }
    }).catch(error => {
    return res.status(500).send(JSON.stringify({message: "Error fetching book"},null,4));
  });
  if(book){
  return res.status(300).send(JSON.stringify(book,null,4));
  } else {
    return res.status(500).send(JSON.stringify({message: "Author not found"},null,4));
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let book = null;
  axios.get('https://github.com/JAZ-CO/expressBookReviews/blob/main/final_project/router/booksdb.js').then(response => {
    books = response.data;
    for(let i = 1; i <= Object.keys(books).length; i++){
      if(books[i].title === req.params.title){
        book = books[i];
        break;
      }
    }
    }).catch(error => {
    return res.status(500).send(JSON.stringify({message: "Error fetching book"},null,4));
  });
  if(book){
  return res.status(300).send(JSON.stringify(book,null,4));
  } else {
    return res.status(500).send(JSON.stringify({message: "Title not found"},null,4));
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // check if isbn exists in books
  let review = null;
  axios.get('https://github.com/JAZ-CO/expressBookReviews/blob/main/final_project/router/booksdb.js').then(response => {
    books = response.data;
    review = books[req.params.isbn].reviews;
    }).catch(error => {
    return res.status(500).send(JSON.stringify({message: "Error fetching review"},null,4));
  });
  if(review){
  return res.status(300).send(JSON.stringify(review,null,4));
  } else {
    return res.status(500).send(JSON.stringify({message: "Review not found"},null,4));
  }
});

module.exports.general = public_users;
