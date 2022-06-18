const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateReservationInput(data) {
  let errors = {};
  data.totalDays = !isEmpty(data.totalDays) ? data.totalDays : "";
  data.totalPrice = !isEmpty(data.totalPrice) ? data.totalPrice : "";
  data.startDate = !isEmpty(data.startDate) ? data.startDate : "";
  data.returnDate = !isEmpty(data.returnDate) ? data.returnDate : "";
  data.startTime = !isEmpty(data.startTime) ? data.startTime : "";
  data.returnTime = !isEmpty(data.returnTime) ? data.returnTime : "";



  if (Validator.isEmpty(data.totalDays)) {
    errors.totalDays = "totalDays field is required";
  }

  if (Validator.isEmpty(data.totalPrice)) {
    errors.totalPrice = "total price field is required";
  }

  if (Validator.isEmpty(data.startDate)) {
    errors.startDate = "Start date field is required";
  }

  if (Validator.isEmpty(data.returnDate)) {
    errors.returnDate = "Return date field is required";
  }

  if (Validator.isEmpty(data.startTime)) {
    errors.startTime = "Start time field is required";
  }

  if (Validator.isEmpty(data.returnTime)) {
    errors.returnTime = "Return time field is required";
  }



  return {
    errors,
    isValid: isEmpty(errors),
  };
};
