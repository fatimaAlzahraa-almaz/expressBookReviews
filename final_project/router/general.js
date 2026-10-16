const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(!username || !password){
    return res.status(403).json({message:'username or password are not provided'})
  }
  users.push({
    'username':username,
    'password':password
  });
  return res.status(300).json({message: "You registerd successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=parseInt(req.params.isbn);
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author=req.params.author;
  const keys=Object.keys(books);
  let booksByAuthor=[];
  for(const i of keys){
    
    if(books[i].author===author){
        booksByAuthor.push(books[i]);
    }
    
  }
  if (booksByAuthor.length>0){
  return res.send(JSON.stringify(booksByAuthor));
  }
else{
    res.status(404).json({message:'Book not found for this author'});
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title=req.params.title;
  let keys=Object.keys(books);
  let booksByTitle=[];
  for(const i of keys){
    if(books[i].title===title){
        booksByTitle.push(books[i]);
    }
  }
  if(booksByTitle.length>0){
    res.send(JSON.stringify(booksByTitle));
  } else{
  return res.status(404).json({message: "Book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews));
  
});

module.exports.general = public_users;
