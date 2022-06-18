const express = require("express");
const gravatar = require("gravatar");
const router = express.Router();
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

// Load Input Validator
const validatorRegisterInput = require("../validation/Register");
const validatorLoginInput = require("../validation/Login");

const User = require("../models/user");

const keys = require("../config/default");

router.get("/test", (req, res) => res.json({ msg: "user  works" }));

//SingUp : public access

router.post("/register/local", (req, res) => {
  const { errors, isValid } = validatorRegisterInput(req.body);
  const success = {};
  success.localuser = "You have successfuly regiter, now try to login";

  //Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email.toLowerCase() })
    .then((user) => {
      if (user) {
        errors.email = "Email already exist...";
        return res.status(404).json(errors);
      } else {
        const role = req.body.role;
        if (role === "Agency") {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            role,
            password: req.body.password,
          });
          bycrypt.genSalt(10, (err, salt) => {
            bycrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => res.json(success))
                .catch((err) => console.log(err));
            });
          });
        } else if (role === "Client") {
          const newUser = new User({
            name:
              req.body.lname.toUpperCase() +
              " " +
              req.body.fname.charAt(0).toUpperCase() +
              req.body.fname.slice(1).toLowerCase(),
            email: req.body.email.toLowerCase(),
            role,
            password: req.body.password,
          });
          bycrypt.genSalt(10, (err, salt) => {
            bycrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => res.json(success.localuser))
                .catch((err) => console.log(err));
            });
          });
        } else {
          errors.role =
            "Wrong role, you nedd to choose between 'Agency' or 'Client'";
          res.status(400).json(errors);
        }
      }
    })
    .catch((err) => console.log(err));
});

//SingIn : returning Token : public access

router.post("/login/local", (req, res) => {
  const { errors, isValid } = validatorLoginInput(req.body);

  //Check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  //find User by email

  User.findOne({ email }).then((user) => {
    // check user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //check password

    bycrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //user matched

        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

        //sign Token

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              succes: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        errors.password = "password incorect";
        return res.status(400).json(errors);
      }
    });
  });
});

///return current user :private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
