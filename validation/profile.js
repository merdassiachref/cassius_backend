const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.adress = !isEmpty(data.adress) ? data.adress : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.countryCode = !isEmpty(data.countryCode) ? data.countryCode : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";

  data.dateOfBirth = !isEmpty(data.dateOfBirth) ? data.dateOfBirth : "";

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle must be between betwenn 2 and 40 charachters";
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }
  if (data.role === "Client") {
    if (Validator.isEmpty(data.dateOfBirth)) {
      errors.dateOfBirth = "Birth date handle is required";
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = "Youtube link is not a Valid URL";
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = "Twitter link is not a Valid URL";
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = "Facebook link is not a Valid URL";
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = "Instagram link is not a Valid URL";
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = "Linkedin link is not a Valid URL";
    }
  }

  if (!Validator.isLength(data.phoneNumber, { min: 8, max: 30 })) {
    errors.phoneNumber = "Phone number must be between 8 and 30 charachters";
  }

  if (!Validator.isLength(data.countryCode, { min: 2, max: 6 })) {
    errors.countryCode =
      "Country code must be min 2 caraters and max 6 caraters";
  }

  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "PhoneNumber field is required";
  }
  if (Validator.isEmpty(data.countryCode)) {
    errors.countryCode = "CountryCode field is required";
  }
  if (Validator.isEmpty(data.adress)) {
    errors.adress = "Adress field is required";
  }
  if (Validator.isEmpty(data.state)) {
    errors.state = "State field is required";
  }
  if (Validator.isEmpty(data.country)) {
    errors.country = "Country field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
