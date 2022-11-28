const express = require("express");
const {isLoggedin, isAnon} = require("../middlewares/auth.middleware.js");
const router = express.Router();
const Post = require("../models/Post.models")



router.get("/profile", isLoggedin ,(req, res, next) => {
res.render("profile.hbs", req.session.user)
})

router.post("/logout", isLoggedin, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});


router.get("/create-post", isLoggedin , (req, res, next) => {
res.render("create-post.hbs")
})


router.post("/create-post" , isLoggedin, (req, res, next) => {
Post.create({
title: req.body.title,
description: req.body.description,
imageUrl: req.body.imageUrl,
owner: req.session.user._id,
tag: req.body.tag
})
.then ((createdPost) => {
console.log("CREATED POST:", createdPost)
  res.send(createdPost)
})
.catch((err) => console.log(err))
})


router.get("/subforums", isLoggedin, (req, res, next) => {
Post.find()
.then((postArray) => {
res.render("subforum.hbs", {postArray})
}) .catch(err => console.log(err))
})

router.get("/post/:id", (req,res,next) => {


  
})


module.exports = router