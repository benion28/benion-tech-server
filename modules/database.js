const express = require("express");
const mongoose = require("mongoose");

module.exports = connectDatabase = () => {
    // Users Database Config
    const database = process.env.MongoURI;
  
    // Connect To Users Database
    mongoose
      .connect(database, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("Benion Tech MongoDB Connected Successfully...".cyan);
      })
      .catch(error => {
        console.log(error);
      });
  };