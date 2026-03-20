const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const vm = require('vm');
const public_users = express.Router();

// Fetch the booksdb.js file from GitHub (Task requirement: use Axios).
// The fetched file is JS (module.exports = books), so we evaluate it in a sandbox.
const BOOKS_DB_URL =
  'https://raw.githubusercontent.com/JAZ-CO/expressBookReviews/main/final_project/router/booksdb.js';

async function fetchBooksFromRemote() {
  const response = await axios.get(BOOKS_DB_URL);
  const code = response.data;
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(code, sandbox);
  return sandbox.module.exports;
}


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
public_users.get('/', async function (req, res) {
  try {
    const booksFromRemote = await fetchBooksFromRemote();
    return res.status(300).send(JSON.stringify(booksFromRemote, null, 4));
  } catch (error) {
    return res.status(500).send(JSON.stringify({ message: "Error fetching books" }, null, 4));
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const booksFromRemote = await fetchBooksFromRemote();
    const book = booksFromRemote[req.params.isbn] || null;
    if (book) {
      return res.status(300).send(JSON.stringify(book, null, 4));
    }
    return res.status(500).send(JSON.stringify({ message: "ISBN not found" }, null, 4));
  } catch (error) {
    return res.status(500).send(JSON.stringify({ message: "Error fetching book" }, null, 4));
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const booksFromRemote = await fetchBooksFromRemote();
    const author = req.params.author;
    const book =
      Object.values(booksFromRemote).find((b) => b.author === author) || null;

    if (book) {
      return res.status(300).send(JSON.stringify(book, null, 4));
    }
    return res.status(500).send(JSON.stringify({ message: "Author not found" }, null, 4));
  } catch (error) {
    return res.status(500).send(JSON.stringify({ message: "Error fetching book" }, null, 4));
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const booksFromRemote = await fetchBooksFromRemote();
    const title = req.params.title;
    const book = Object.values(booksFromRemote).find((b) => b.title === title) || null;

    if (book) {
      return res.status(300).send(JSON.stringify(book, null, 4));
    }
    return res.status(500).send(JSON.stringify({ message: "Title not found" }, null, 4));
  } catch (error) {
    return res.status(500).send(JSON.stringify({ message: "Error fetching book" }, null, 4));
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const booksFromRemote = await fetchBooksFromRemote();
    const isbn = req.params.isbn;
    const book = booksFromRemote[isbn];

    if (!book) {
      return res.status(500).send(JSON.stringify({ message: "ISBN not found" }, null, 4));
    }

    const review = book.reviews;
    return res.status(300).send(JSON.stringify(review, null, 4));
  } catch (error) {
    return res.status(500).send(JSON.stringify({ message: "Error fetching review" }, null, 4));
  }
});

module.exports.general = public_users;
