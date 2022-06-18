const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.fname = !isEmpty(data.fname) ? data.fname : "";
  data.lname = !isEmpty(data.lname) ? data.lname : "";
  data.role = !isEmpty(data.role) ? data.role : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.agree = !isEmpty(data.agree) ? data.agree : "";


  if (Validator.isEmpty(data.role)) {
    errors.role = "Role field is required first";
  }

  if (data.role === "Agency") {
    if (!Validator.isLength(data.name, { min: 5, max: 30 })) {
      errors.name = "Name must be between 5 and 30 charachters";
    }
    if (Validator.isEmpty(data.name)) {
      errors.name = "Name field is required";
    }
  }

  if (data.role === "Client") {
    if (!Validator.isLength(data.fname, { min: 5, max: 30 })) {
      errors.fname = "First name must be between 5 and 30 charachters";
    }
    if (Validator.isEmpty(data.fname)) {
      errors.fname = "First name field is required";
    }
    if (!Validator.isLength(data.lname, { min: 5, max: 30 })) {
      errors.lname = "Last name must be between 5 and 30 charachters";
    }
    if (Validator.isEmpty(data.lname)) {
      errors.lname = "Last name field is required";
    }}

  if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = "Password must be between 6 and 30 charachters";
  }

  if (Validator.isEmpty(data.agree)) {
    errors.agree = "You must agree the terms and conditions";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Invalidate E-mail";
  }

  if (!Validator.equals(data.email, data.confirmEmail)) {
    errors.confirmEmail = "E-mails must match";
  }

  if (!Validator.equals(data.password, data.confirmPassword)) {
    errors.confirmPassword = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
