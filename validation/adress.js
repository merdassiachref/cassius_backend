const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateAdressInput(data) {
  let errors = {};

  data.adress = !isEmpty(data.adress) ? data.adress : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.countryCode = !isEmpty(data.countryCode) ? data.countryCode : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";

  if (!Validator.isLength(data.phoneNumber, { min: 8, max: 30 })) {
    errors.phoneNumber = "Phone number must be between 8 and 30 charachters";
  }

  if (!Validator.isLength(data.countryCode, { min: 0, max: 6 })) {
    errors.countryCode = "Password must be max 6 numbers";
  }

  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "phoneNumber field is required";
  }
  if (Validator.isEmpty(data.countryCode)) {
    errors.countryCode = "countryCode field is required";
  }
  if (Validator.isEmpty(data.adress)) {
    errors.adress = "adress field is required";
  }
  if (Validator.isEmpty(data.state)) {
    errors.state = "state field is required";
  }
  if (Validator.isEmpty(data.country)) {
    errors.country = "country field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
