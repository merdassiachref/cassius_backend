const express = require("express");
const router = express.Router();
const passport = require("passport");

const Post = require("../models/post");
const Profile = require("../models/profile");

const validatePostInput = require("../validation/post");

// Get posts:public

router.get("/", (req, res) => {
  const { errors } = validatePostInput(req.body);
  errors.noposts = "There is no posts";

  Post.find()
    .sort({ date: -1 })
    .then((posts) => res.json(posts))
    .catch((err) => res.status(404).json(errors.noposts));
});

// Get post:id :public

router.get("/post/:id", (req, res) => {
  const { errors } = validatePostInput(req.body);
  errors.nopost = "Post not found";

  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(404).json(errors.nopost);
      } else {
        res.json(post);
      }
    })
    .catch((err) => res.status(404).json(errors.nopost));
});

//Get an agency posts :public

router.get("/agencies_posts/:handle", (req, res) => {
  const { errors } = validatePostInput(req.body);
  errors.noposts = "There is no posts";
  errors.noprofile = "Profile not found";

  Profile.find({ handle: req.params.handle })
    .then((profile) => {
      if (!profile) {
        res.status(404).json(errors.noprofile);
      } else {
        Post.find({ handle: req.params.handle }).then((post) => {
          if (!post) {
            res.status(404).json(errors.noposts);
          } else {
            res.json(post);
          }
        });
      }
    })
    .catch((err) => res.status(404).json(errors.noprofile));
});

//Get current agency posts :Private

router.get(
  "/my_posts",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.find({ user: req.user.id })
      .then((post) => {
        if (!post) {
          errors.noposts = "There is no post for this user";
          return res.status(404).json(errors.noposts);
        }
        res.json(post);
      })
      .catch((err) => res.status(404).json(err));
  }
);

// create post : private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    const success = {};

    success.post = "Post successfully created";

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (!profile) {
        errors.profile = "No profile found";
        res.status(404).json(errors.profile);
      } else {
        if (req.user.role === "Agency") {
          const newPost = new Post({
            name: req.user.name,
            user: req.user.id,
            brand: req.body.brand,
            model: req.body.model,
            fuel: req.body.fuel,
            transmission: req.body.transmission,
            pricePerDay: req.body.pricePerDay + " dt/day",
            adress: req.body.adress,
            state: req.body.state,
            country: req.body.country,
            countryCode: req.body.countryCode,
            phoneNumber: req.body.phoneNumber,
            email: req.user.email,
            handle: req.user.handle,
          });
          newPost
            .save()
            .then((post) => res.json(success.post))
            .catch((err) => res.status(404).json(err));
        } else {
          errors.post = "Only agencies can post !!!";
          res.json(errors.post);
        }
      }
    });
  }
);

//Edit Post :id /private

router.put(
  "/edit_post/:post_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    const success = {};

    errors.notAuthorize = "User not authorized to edit other post";
    errors.nopost = "Post not found";
    errors.fail = "Update Failed";

    success.editpost = "Post has successfully edited";

    if (!isValid) {
      return res.status(400).json(errors);
    } else {
      Post.findById(req.params.post_id).then((post) => {
        if (!post) {
          res.status(404).json(errors.nopost);
        } else {
          if (post.user == req.user.id) {
            Post.updateOne(
              { _id: req.params.post_id },
              {
                $set: {
                  brand: req.body.brand,
                  model: req.body.model,
                  fuel: req.body.fuel,
                  transmission: req.body.transmission,
                  pricePerDay: req.body.pricePerDay,
                  state: req.body.state,
                  country: req.body.country,
                },
              },
              (err) => {
                if (err) {
                  res.status(401).json(errors.fail);
                } else {
                  res.json(success.editpost);
                }
              }
            );
          } else {
            res.json(errors.notAuthorize);
          }
        }
      });
    }
  }
);

//Delete post : id /private

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors } = validatePostInput(req.body);
    const success = {};

    errors.nopost = "Post not found";
    errors.notAuthorize = "User not authorized";
    errors.postnotfound = "No post found";

    success.deletepost = "Post has successfly deleted";

    Profile.findOne({ user: req.user.id }).then((profile) => {
      Post.findById(req.params.id).then((post) => {
        if (!post) {
          res.status(404).json(errors.nopost);
        } else {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json(errors.notAuthorize);
          } else {
            post
              .remove()
              .then((post) => {
                res.json(success.deletepost);
              })
              .catch((err) => res.status(404).json(errors.postnotfound));
          }
        }
      });
    });
  }
);

module.exports = router;
