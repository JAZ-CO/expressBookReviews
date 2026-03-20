const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  for(let i = 0; i < users.length; i++){
    if(users[i].username === username){
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  for(let i = 0; i < users.length; i++){
    if(users[i].username === username && users[i].password === password){
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(400).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password,
            username: username
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  // You have to give a review as a request query & it must get posted with the username (stored in the session) posted. If the same user posts a different review on the same ISBN, it should modify the existing review. If another user logs in and posts a review on the same ISBN, it will get added as a different review under the same ISBN.
  // check if username is present in session
  if (!req.session.authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const username = req.session.authorization.username;
  if(!books[req.params.isbn]){
    return res.status(500).send(JSON.stringify({message: "ISBN not found"},null,4));
  }
  let newReview = req.query.review;
  if(newReview){
    books[req.params.isbn].reviews[req.session.authorization.username] = newReview;
    return res.status(200).send(JSON.stringify({message: "Review added/updated successfully by: " + username},null,4));
  }
});

 regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users.
  if (!req.session.authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const username = req.session.authorization.username;
  if(!books[req.params.isbn]){
    return res.status(500).send(JSON.stringify({message: "ISBN not found"},null,4));
  }
  
  // Check if the user has a review for this ISBN
  if(books[req.params.isbn].reviews[username]){
    delete books[req.params.isbn].reviews[username];
    return res.status(200).send(JSON.stringify({message: "Review deleted successfully by: " + username},null,4));
  } else {
    return res.status(404).send(JSON.stringify({message: "Review not found for user: " + username},null,4));
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
