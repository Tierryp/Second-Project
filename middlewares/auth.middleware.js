const Post = require("../models/Post.models")
const Comment = require("../models/Comment.model")

const isLoggedin = (req, res, next) => {
  // console.log('hi')
  if (!req.session.user) {
    req.app.locals.isLoggedIn = true;
    res.redirect("/");
    return;
  }
  req.app.locals.isLoggedIn = true;
  next();
};


const isAnon = (req, res, next) => {
  // console.log('hi')
  if (req.session.user) {
    req.app.locals.isLoggedIn = true;
    res.redirect("/user/profile");
    return;
  }
  req.app.locals.isLoggedIn = false;
  next();
};

const isPublic = (req, res, next) => {
  if (req.session.user) {
    req.app.locals.isLoggedIn = true;
  } else {
    req.app.locals.isLoggedIn = false;
  }
  next();
};


const isOwner = (req, res, next) => {
  Post.findById(req.params.id)
    .then((foundPost) => {
      console.log("THiS IS THE USER:", req.session.user);
      if (String(foundPost.owner) === String(req.session.user._id) ||  req.session.user.isOwner === true) {
        next();
      } else {
        next()
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


const isCommentOwner = (req, res, next) => {
  Comment.findById(req.params.id)
    .then((foundPost) => {
      console.log("THiS IS THE USER:", req.session.user);
      if (
        String(foundPost.user) === String(req.session.user._id) ||
        req.session.user.isOwner === true
      ) {
        next();
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
    isLoggedin,
    isAnon,
    isPublic, 
    isOwner, 
    isCommentOwner
}