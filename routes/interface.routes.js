const express = require("express");
const {
  isLoggedin,
  isAnon,
  isOwner,
  isCommentOwner
} = require("../middlewares/auth.middleware.js");
const router = express.Router();
const Post = require("../models/Post.models")
const Comment = require("../models/Comment.model")


//PROFILE
router.get("/profile", isLoggedin ,(req, res, next) => {
res.render("profile.hbs", req.session.user)
})


//LOGOUT
router.post("/logout", isLoggedin, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

//POSTS
router.get("/create-post", isLoggedin , (req, res, next) => {
res.render("create-post.hbs")
})

// CREATE POST
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
  res.redirect("/user/subforums")
})
.catch((err) => console.log(err))
})
// VIEW SPECIFIC POST
router.get("/post/:id", isOwner, (req, res, next) => {
  Post.findById(req.params.id)
    .populate({
      path: "comment",
      populate: {
        path: "user",
      },
    })
    .populate("owner")
    .then((foundPost) => {
      console.log("THIS IS THE POST I WANT TO VIEW", foundPost);
      const posts = foundPost.toObject()
      posts.comment = posts.comment.map(el => {
return {
  ...el,
  isMyComment: String(el.user._id) === String(req.session.user._id) ||String(el.user) === el.user.isOwner === true,
  button: req.session.user.isOwner || req.session.user.isAdmin 
};
       })  
       console.log("???????", req.session.user);
      res.render("./user-views/post.hbs", {
        foundPost: posts,
        isOwner: req.session.user.isOwner,
        user: req.session.user,
        isMyPost: String(foundPost.owner._id) === String(req.session.user._id),
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
//COMMENT ON POST
router.post("/post/:id/comment", (req, res, next) => {
  Comment.create({
    user: req.session.user._id,
    comment: req.body.comment,
  })
    .then((createdComment) => {
      Post.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { comment: createdComment } },
        { new: true }
      )
        .then((updatePost) => {
          console.log(updatePost);
          res.redirect(`/user/post/${req.params.id}`);
        })
        .catch((err) => {
          console.log(err);
        });

      console.log("Created comment:", createdComment);
    })
    .catch((err) => console.log(err));
});
//DELETE POST
router.post("/post/:id/delete", (req, res, next) => {
  Post.findById(req.params.id)
    .then((foundPost) => {
      foundPost.delete();
      res.redirect("/user/subforums");
    })
    .catch((err) => {
      console.log(err);
    });
});

//EDIT POST 
router.get("/post/:id/edit", isOwner, (req,res,next) => {
  Post.findById(req.params.id)
    .then((foundPost) => {
      console.log("THIS IS THE ROOM I WANT TO EDIT", foundPost);
      res.render("edit-post.hbs", foundPost);
    })
    .catch((err) => {
      console.log(err);
    });
})



router.post("/post/:id/edit",  (req,res,next) => {
Post.findByIdAndUpdate(
  req.params.id,
  {
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    owner: req.session.user._id,
    tag: req.body.tag,
  },
  { new: true }
)
  .then((updatedPost) => {
    console.log("Changed post", updatedPost);
    res.redirect("/user/subforums");
  })
  .catch((err) => {
    console.log(err);
  });

})
// COMMENT DELETE
router.post("/post/:id/delete-comment", isCommentOwner, (req,res,next) => {
Comment.findById(req.params.id)
.then((foundComment) => {
foundComment.delete()
res.redirect(`/user/subforums`)
}).catch ((err) => {
console.log(err)
})




})

//POST INTERFACE END





router.get("/subforums", isLoggedin, (req, res, next) => {
  Post.find()
    .populate("owner")
    .then((postArray) => {
      res.render("subforum.hbs", { postArray });
    })
    .catch((err) => console.log(err));
});





module.exports = router