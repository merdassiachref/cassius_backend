const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name:{
    type:String,
    required:true
  },
  avatar: {
    type: String,
  },
  handle: {
    type: String,
    required: true,
    max: 40,
  },
  country: {
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
  countryCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },

  contactInformation: [
    {
      country: {
        type: String,
      },
      adress: {
        type: String,
      },
      state: {
        type: String,
      },
      countryCode: {
        type: String,
      },
      phoneNumber: {
        type: String,
      },
    },
  ],
  role: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
  },
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Profile = mongoose.model("profile", ProfileSchema);
