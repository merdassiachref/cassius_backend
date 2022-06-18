const express = require("express");
const passport = require("passport");

const router = express.Router();

const Post = require("../models/post");
const Profile = require("../models/profile");
const Reservation = require("../models/reservation");
const validateReservationInput = require("../validation/reservations");

// post resevations: private

router.post(
  "/add/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors } = validateReservationInput(req.body);
    const success = {};
    role = req.user.role;

    success.reservation = "Resservation has successfully created";

    {
      if (role === "Client") {
        Profile.findOne({ user: req.user.id }).then((profile) => {
          if (!profile) {
            errors.noprofile = "Profile not found";
            res.status(404).json(errors.noprofile);
          } else {
            clientAdress = profile.adress;
            clientState = profile.state;
            clientCountry = profile.country;
            clientCountryCode = profile.countryCode;
            clientPhoneNumber = profile.phoneNumber;

            Post.findById(req.params.post_id).then((post) => {
              if (!post) {
                errors.nopost = "Post not found";

                res.status(404).json(errors.nopost);
              } else {
                agency = post.user;
                agencyName = post.name;
                agencyAdress = post.adress;
                agencyState = post.state;
                agencyCountry = post.country;
                agencyCountryCode = post.countryCode;
                agencyPhoneNumber = post.phoneNumber;
                agencyEmail = post.email;
                car = post.id;
                brand = post.brand;
                model = post.model;
                fuel = post.fuel;
                transmission = post.transmission;
                pricePerDay = post.pricePerDay;

                const newReservation = new Reservation({
                  startDate: req.body.startDate,
                  returnDate: req.body.returnDate,
                  totalDays: req.body.totalDays,
                  totalPrice: req.body.totalPrice,
                  startTime: req.body.startTime,
                  returnTime: req.body.returnTime,
                  status: "Waiting for confirmation",
                  client: req.user.id,
                  clientEmail: req.user.email,
                  clientName: req.user.name,
                  clientAdress,
                  clientState,
                  clientCountry,
                  clientCountryCode,
                  clientPhoneNumber,
                  agency,
                  agencyName,
                  agencyAdress,
                  agencyState,
                  agencyCountry,
                  agencyCountryCode,
                  agencyPhoneNumber,
                  agencyEmail,
                  car,
                  brand,
                  model,
                  fuel,
                  transmission,
                  pricePerDay,
                });
                newReservation
                  .save()
                  .then((reservation) => res.json(success.reservation))
                  .catch((err) => res.status(404).json(err));
              }
            });
          }
        });
      } else {
        errors.reservation = "Only client can rent a car";
        return res.status(400).json(errors.reservation);
      }
    }
  }
);

//Get reservation by ID : private

router.get(
  "/reservation/:reservation_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    role = req.user.role;

    errors.noreservation = "No reservation found for you!!!";

    errors.notauthrizate =
      "Your not authorizate to acces to this reservation!!!";

    if (role === "Client") {
      Reservation.findById(req.params.reservation_id).then((reservation) => {
        if (!reservation) {
          res.status(400).json(errors.noreservation);
        } else {
          if (reservation.client == req.user.id) {
            res.json(reservation);
          } else {
            res.status(400).json(errors.notauthrizate);
          }
        }
      });
    } else {
      Reservation.findById(req.params.reservation_id).then((reservation) => {
        if (!reservation) {
          res.status(400).json(errors.noreservation);
        } else {
          if (reservation.agency == req.user.id) {
            res.json(reservation);
          } else {
            res.status(400).json(errors.notauthrizate);
          }
        }
      });
    }
  }
);

// Edit reservation:private

router.put(
  "/edit_reservation/:reservation_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateReservationInput(req.body);
    const success = {};

    success.reservationedit = "Reservation has successfuly updated";

    errors.notAuthorize = "User not authorized to acces to others reservation";
    errors.noreservation = "Reservation not found";
    errors.fail = "Update Failed";
    errors.notwaiting = "This reservation is confirmed or canceled";
    errors.wrongRole = "Only Client can edit reservation";

    if (!isValid) {
      return res.status(400).json(errors);
    } else {
      Reservation.findById(req.params.reservation_id)
        .then((reservation) => {
          if (!reservation) {
            res.status(404).json(errors.noreservation);
          } else {
            if (req.user.role === "Client") {
              if (reservation.client == req.user.id) {
                if (
                  reservation.status !== "Canceled" &&
                  reservation.status !== "Confirmed"
                ) {
                  Reservation.update(
                    { _id: req.params.reservation_id },
                    {
                      $set: {
                        status: "Changed and waiting for confirmation",
                        startDate: req.body.startDate,
                        returnDate: req.body.returnDate,
                        totalDays: req.body.totalDays,
                        totalPrice: req.body.totalPrice,
                        startTime: req.body.startTime,
                        returnTime: req.body.returnTime,
                      },
                    },
                    (err) => {
                      if (err) {
                        res.status(401).json(errors.fail);
                      } else {
                        res.json(success.reservationedit);
                      }
                    }
                  );
                } else {
                  res.status(500).json(errors.notwaiting);
                }
              } else {
                res.json(errors.notAuthorize);
              }
            } else {
              res.json(errors.wrongRole);
            }
          }
        })
        .then((reservation) => res.json(reservation))
        .catch((err) => res.json(err));
    }
  }
);

// Confirm reservation:private

router.put(
  "/confirm/:reservation_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const success = {};

    success.reservationconfirm = "Reservation confirmed";

    errors.notAuthorize = "User not authorized to acces to others reservation";
    errors.noreservation = "Reservation not found";
    errors.fail = "Update Failed";
    errors.notwaiting = "This reservation is confirmed or canceled";
    errors.wrongRole = "Only Agency can already confirm reservation";

    Reservation.findById(req.params.reservation_id)
      .then((reservation) => {
        if (!reservation) {
          res.status(404).json(errors.noreservation);
        } else {
          if (req.user.role === "Agency") {
            if (reservation.agency == req.user.id) {
              if (
                reservation.status !== "Canceled" &&
                reservation.status !== "Confirmed"
              ) {
                Reservation.updateOne(
                  { _id: req.params.reservation_id },
                  {
                    $set: {
                      status: "Confirmed",
                    },
                  },
                  (err) => {
                    if (err) {
                      res.status(401).json(errors.fail);
                    } else {
                      res.json(success.reservationconfirm);
                    }
                  }
                );
              } else {
                res.status(500).json(errors.notwaiting);
              }
            } else {
              res.json(errors.notAuthorize);
            }
          } else {
            res.json(errors.wrongRole);
          }
        }
      })
      .then((reservation) => res.json(reservation))
      .catch((err) => res.json(err));
  }
);

//Canceled reservation:private

router.put(
  "/cancel/:reservation_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    const success = {};

    success.reservationconfirm = "Reservation confirmed";

    errors.notAuthorize = "User not authorized to acces to others reservation";
    errors.noreservation = "Reservation not found";
    errors.fail = "Update Failed";
    errors.notwaiting = "This reservation is confirmed or canceled";
    errors.wrongRole = "Only Agency can already confirm reservation";

    Reservation.findById(req.params.reservation_id)
      .then((reservation) => {
        if (!reservation) {
          res.status(404).json(errors.noreservation);
        } else {
          if (req.user.role === "Agency") {
            if (reservation.agency == req.user.id) {
              if (
                reservation.status !== "Canceled" &&
                reservation.status !== "Confirmed"
              ) {
                Reservation.updateOne(
                  { _id: req.params.reservation_id },
                  {
                    $set: {
                      status: "Canceled",
                    },
                  },
                  (err) => {
                    if (err) {
                      res.status(401).json(errors.fail);
                    } else {
                      res.json(success.reservationconfirm);
                    }
                  }
                );
              } else {
                res.status(500).json(errors.notwaiting);
              }
            } else {
              res.json(errors.notAuthorize);
            }
          } else {
            res.json(errors.wrongRole);
          }
        }
      })
      .then((reservation) => res.json(reservation))
      .catch((err) => res.json(err));
  }
);

// Get all reservation:public

router.get("/all", (req, res) => {
  Reservation.find()
    .then((reservation) => res.json(reservation))
    .catch((err) => res.json(err));
});

//Get client reservation:private

router.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    role = req.user.role;

    const { errors } = validateReservationInput(req.body);

    errors.noreservation = "You dont have any reservations";

    {
      if (role === "Client") {
        Reservation.find({ client: req.user.id })
          .then((reservation) => {
            if (!reservation) {
              res.status(404).json(errors.noreservation);
            } else {
              res.json(reservation);
            }
          })
          .catch((err) => res.json(err));
      } else {
        Reservation.find({ agency: req.user.id })
          .then((reservation) => {
            if (!reservation) {
              res.status(404).json(errors.noreservation);
            } else {
              res.json(reservation);
            }
          })
          .catch((err) => res.json(err));
      }
    }
  }
);

//Get confirmed reservation: private
router.get(
  "/user/confirmed",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    role = req.user.role;

    {
      if (role === "Client") {
        Reservation.find({
          client: req.user.id,
          status: "Confirmed",
        })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      } else {
        Reservation.find({
          agency: req.user.id,
          status: "Confirmed",
        })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      }
    }
  }
);

// Get conceled reservation: private

router.get(
  "/user/canceled",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    role = req.user.role;

    {
      if (role === "Client") {
        Reservation.find({ client: req.user.id, status: "Canceled" })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      } else {
        Reservation.find({ agency: req.user.id, status: "Canceled" })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      }
    }
  }
);

// Get waitting reservation: private

router.get(
  "/user/waiting",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    role = req.user.role;

    {
      if (role === "Client") {
        Reservation.find({
          client: req.user.id,
          status: "Changed and waiting for confirmation",
          status: "Waiting for confirmation",
        })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      } else {
        Reservation.find({
          agency: req.user.id,
          status: "Changed and waiting for confirmation",
          status: "Waiting for confirmation",
        })
          .then((reservation) => res.json(reservation))
          .catch((err) => res.json(err));
      }
    }
  }
);

module.exports = router;
