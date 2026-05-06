const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullname: { type: String, required: true, maxLength: 100 },
  login: {type: String, required: true, maxLength: 40},
  password: {type: String, required: true, maxLenght: 8},
  email: {type: String, required: true, maxLenght: 100},
});

// Virtual for author's URL
userSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("user", userSchema);