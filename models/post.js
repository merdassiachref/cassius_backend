const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  handle:{
    type:String,
    required:true
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  fuel: {
    type: String,
    required: true,
  },
  transmission: {
    type: String,
    required: true,
  },
  pricePerDay: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  adress: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  carPictures: {
    carPicture1: { type: String },
    carPicture2: { type: String },
    carPicture3: { type: String },
    carPicture4: { type: String },
    carPicture5: { type: String },
    carPicture6: { type: String },
    carPicture7: { type: String },
    carPicture8: { type: String },
    carPicture9: { type: String },
    carPicture10: { type: String },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Post = mongoose.model("post", PostSchema);
