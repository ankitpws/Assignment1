var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
var companySchema = new Schema({
  companyName: {
    type: String,
    required: [true, "company name not provided "],
  },
  email: {
    type: String,
    unique: [true, "email already exists in database!"],
    lowercase: true,
    trim: true,
    required: [true, "email not provided"],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email!",
    },
  },
  companyCode: {
    type: String,
    unique: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  empAlise: {
    type: String,
  },
});
module.exports = mongoose.model("Company", companySchema);
