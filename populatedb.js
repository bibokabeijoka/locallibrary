#! /usr/bin/env node

console.log(
  'This script populates some test users, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.cojoign.mongodb.net/local_library?retryWrites=true&w=majority&appName=Cluster0"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const User = require("./models/user");
const Author = require("./models/author");
const Genre = require("./models/genre");

const genres = [];
const authors = [];
const users = [];

const mongoose = require("mongoose");

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createAuthors();
  await createUsers();
  console.log("Debug: Closing mongoose");
  await mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function authorCreate(index, first_name, family_name, d_birth, d_death) {
  const authordetail = { first_name: first_name, family_name: family_name };
  if (d_birth != false) authordetail.date_of_birth = d_birth;
  if (d_death != false) authordetail.date_of_death = d_death;

  const author = new Author(authordetail);

  await author.save();
  authors[index] = author;
  console.log(`Added author: ${first_name} ${family_name}`);
}

async function userCreate(index, fullname, login, password, email) {
  const userdetail = {
    fullname,
    login,
    password,
    email,
  };

  const user = new User(userdetail);
  await user.save();
  users[index] = user;
  console.log(`Added user: ${login}`);
}


async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "Fantasy"),
    genreCreate(1, "Science Fiction"),
    genreCreate(2, "French Poetry"),
  ]);
}

async function createAuthors() {
  console.log("Adding authors");
  await Promise.all([
    authorCreate(0, "Patrick", "Rothfuss", "1973-06-06", false),
    authorCreate(1, "Ben", "Bova", "1932-11-8", false),
    authorCreate(2, "Isaac", "Asimov", "1920-01-02", "1992-04-06"),
    authorCreate(3, "Bob", "Billings", false, false),
    authorCreate(4, "Jim", "Jones", "1971-12-16", false),
  ]);
}

async function createUsers() {
  console.log("Adding Users");
  await Promise.all([
    userCreate(
      1,
      "Robervaldo da Silva Gomes",
      "Robervaldinho123",
      "Npsh1234",
      "RoberGomes@hotmail.com"
    ),
    userCreate(
      2,
      "Paula Chaves de Souza",
      "Paula_Souza45",
      "Paul@79_",
      "PaulaChavesSouza@yahoo.com"
    ),
    userCreate(
      3,
      "Pafúncio Pereira Neto e Silva",
      "PafuncioNeto",
      "Pafu1234",
      "RoberGomes@hotmail.com"
    ),
  ]);
};