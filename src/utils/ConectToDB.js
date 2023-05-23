/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
const { error } = require("console");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {

  if (mongoose.connections[0].readyState){
    return;
  }

  mongoose
  .connect(process.env.DATABASE_URI)
  .then( (_res) => {

    console.log("Connected to database");

  } )
  .catch( (err) => {
    throw err
  } )

}

module.exports = { connectDB }