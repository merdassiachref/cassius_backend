const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  startTime: {
    type: String,
    required: true,
  },
  returnTime: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  returnDate: {
    type: String,
    required: true,
  },
  totalDays: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: String,
    required: true,
  },
  clientAdress: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientState: {
    type: String,
    required: true,
  },
  clientCountry: {
    type: String,
    required: true,
  },
  clientCountryCode: {
    type: String,
    required: true,
  },
  clientPhoneNumber: {
    type: String,
    required: true,
  },
  clientEmail: {
    type: String,
    required: true,
  },
  agencyAdress: {
    type: String,
    required: true,
  },
  agency: {
    type: String,
    required: true,
  },
  agencyName: {
    type: String,
    required: true,
  },
  agencyState: {
    type: String,
    required: true,
  },
  agencyCountry: {
    type: String,
    required: true,
  },
  agencyCountryCode: {
    type: String,
    required: true,
  },
  agencyPhoneNumber: {
    type: String,
    required: true,
  },
  agencyEmail: {
    type: String,
    required: true,
  },
  car: {
    type: String,
    required: true,
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
  status: {
    type: String,
    required: true,
  },
  response: {
    type: String,
  },
  postDate: {
    type: Date,
  },
  editDate: {
    type: Date,
  },
  confirmDate: {
    type: Date,
  },
  cancelDate: {
    type: Date,
  },
  confirmDate: {
    type: Date,
  },
  cancelPart: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Reservation = mongoose.model("reservation", ReservationSchema);
