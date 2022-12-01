const express = require("express");
const {
  isLoggedin,
  isAnon,
  isOwner,
  isCommentOwner,
} = require("../middlewares/auth.middleware.js");
const router = express.Router();
const Post = require("../models/Post.models");
const Comment = require("../models/Comment.model");
const User = require("../models/User.models")



router.get("/users", (req,res,next) => {
User.find()
.then((foundUsers) => {
res.render("./admin-views/users.hbs", {foundUsers})
}) 
.catch(err => console.log(err))
})


router.post("/:id/make-admin",  (req,res,next) => {
User.findByIdAndUpdate({_id: req.params.id}, {
isAdmin: true
}, {new: true})
.then((updated) => {
    console.log("This is updated", updated)
    res.redirect("/admin/users")
}).catch((err) => console.log(err))

})


router.post("/:id/remove-admin", (req, res, next) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      isAdmin: false,
    },
    { new: true }
  )
  
    .then((updated) => {
      console.log("This is updated", updated);
          res.redirect("/admin/users");
    })
    .catch((err) => console.log(err));
});


module.exports = router;
