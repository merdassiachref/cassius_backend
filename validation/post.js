const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.brand = !isEmpty(data.brand) ? data.brand : "";
  data.model = !isEmpty(data.model) ? data.model : "";
  data.fuel = !isEmpty(data.fuel) ? data.fuel : "";
  data.transmission = !isEmpty(data.transmission) ? data.transmission : "";
  data.pricePerDay = !isEmpty(data.pricePerDay) ? data.pricePerDay : "" ;
  data.country = !isEmpty(data.country) ? data.country : "";
  data.state = !isEmpty(data.state) ? data.state : "";


  if (Validator.isEmpty(data.brand)) {
    errors.brand = "brand field is required";
  }

  if (Validator.isEmpty(data.model)) {
    errors.model = "model field is required";
  }

  if (Validator.isEmpty(data.fuel)) {
    errors.fuel = "fuel field is required";
  }

  if (Validator.isEmpty(data.transmission)) {
    errors.transmission = "transmission field is required";
  }

  if (Validator.isEmpty(data.pricePerDay)) {
    errors.pricePerDay = "Price per day field is required";
  }

  if (Validator.isEmpty(data.country)) {
    errors.country = "Country field is required";
  }
  if (Validator.isEmpty(data.state)) {
    errors.state = "State field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
