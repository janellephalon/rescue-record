const { Schema } = require("mongoose");

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const petSchema = new Schema({
  type:
    {
      type: String,
      required: true,
    },
  breed: {
    type: String,
    required: false,
  },
  status: {
    type: String,
  },
  // saved book id from GoogleBooks
  petId: {
    type: String,
    required: true,
  },
  // image: {
  //   type: String,
  // },
  // link: {
  //   type: String,
  // },
  // title: {
  //   type: String,
  //   required: true,
  // },
});

module.exports = petSchema;
