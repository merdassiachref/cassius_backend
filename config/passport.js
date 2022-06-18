const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
ExtractJwt = require("passport-jwt").ExtractJwt;
const GooglePlusTokenStrategy = require("passport-google-plus-token");

const User = require("../models/user");

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";

//Local jwt auth strategy

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findById(jwt_payload.id)
      .then((user) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err) => console.log(err));
  })
);

//Google auth strategy

passport.use(
  "googleToken",
  new GooglePlusTokenStrategy(
    {
      clientID:
        "593853670713-gbgutonv3vaqr1f9hm0n8h1vk2qe5qsl.apps.googleusercontent.com",
      clientSecret: "y6U5L1q3RR4xzb9MqMVCZqPz",
      callbackURL: "http://localhost:5000/users/google/callback/",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Check whether this current user exists in our db
      User.findOne({ "google.id": profile.id }).then((user) => {
        if (user) {
          return console.log("User already exist");
        } else {
          // not exist
          const newUser = new User({
            method: "google",
            role: "Client",
            google: {
              id: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
            },
          });
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        }
      });
    }
  )
);
