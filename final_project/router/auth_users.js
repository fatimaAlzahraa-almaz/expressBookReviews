const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user=users.find((el)=>el.username===username);
return user!==undefined && user.password===password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(!authenticatedUser(username,password)){
    return res.status(403).json({message:'Invalid login check username and password'});
  }
  let accessToken=jwt.sign(
   { data:password},'access',{expiresIn:60*60});
   req.session.authorization={
    accessToken,username
   };
  return res.status(203).json({message: "user successfully loggedin"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  
  const isbn=req.params.isbn;
  const review=req.query.review;
  const username=req.session.username;
  if(isValid(username)){
  books[isbn].reviews[username]=review;
  return res.status(300).json({message: "reviewd successfully"});
  }
  else{
    res.status(403).json({message:'user not found'})
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const username=req.session.username;
  if(isValid(username)){
   delete  books[isbn].reviews[username];
  return res.status(300).json({message: "deleted succeefully"});
  }
  else{
    res.status(403).json({message:'user not found'})
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
