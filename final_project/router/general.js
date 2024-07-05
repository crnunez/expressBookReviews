const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Registro de un nuevo usuario
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password }); 
  return res.status(201).json({ message: "User registered successfully" });
});

// Obtener la lista de libros disponibles en la tienda
public_users.get('/', async (req, res) => {
  try {
    const booksList = await axios.get('http://localhost:5000/books');
    res.status(200).json(booksList.data);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Obtener detalles de un libro basado en el ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Obtener detalles de libros basados en el autor
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const result = Object.values(books).filter(book => book.author === author);
  if (result.length > 0) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});

// Obtener todos los libros basados en el título
public_users.get('/title/:title', (req, res) => {
  const title = decodeURIComponent(req.params.title);
  const result = Object.values(books).filter(book => book.title === title);
  if (result.length > 0) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Title not found" });
  }
});

// Obtener la reseña de un libro
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
