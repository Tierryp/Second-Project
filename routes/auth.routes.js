const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { isLoggedin, isAnon, isPublic } = require("../middlewares/auth.middleware.js");
const User = require("../models/User.models");

// SIGNUP
router.get("/signup", isAnon, (req, res, next) => {
  res.render("signup.hbs");
});

router.post("/signup", isAnon, (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("signup.hbs", {
      errorMessage: "Please input a username or password!",
    });
    return;
  }
  User.findOne({ username: req.body.username }).then((foundUser) => {
    if (foundUser) {
      res.render("signup.hbs", {
        errorMessage: "This user already exists.",
      })
      return;
    }

    const myHashedPassword = bcryptjs.hashSync(req.body.password);
    return User.create({
      username: req.body.username,
      password: myHashedPassword,
      profilePic: req.body.profilePic
    })
      .then((createdUser) => {
        console.log("New user created!", createdUser);
        res.redirect("/auth/login");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });
});

//LOG IN

router.get("/login", isAnon ,(req, res, next) => {
  res.render("login.hbs");
});

router.post("/login", (req, res, next) => {

const {username, password} = req.body
 
if (!username || !password) {
   res.render("login.hbs", {
errorMessage: "Input a username or password!"  
}) 
return;

}
User.findOne ({username})
.then((foundUser) => {
if (!foundUser){
res.render("login.hbs", {errorMessage: "User does not exist. Please make an account."})
return
}
const isValidPassword = bcryptjs.compareSync(
    password,foundUser.password
    )

if(!isValidPassword){
res.render("login.hbs", {
    errorMessage: "Wrong password!"
})
return
}
req.session.user = foundUser
res.redirect("/user/profile")

})

.catch((err) => {
console.log(err)
res.send(err)


})


});

//LOG IN END

module.exports = router;
