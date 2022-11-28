const express = require("express")
const router = express.Router()
const {
  isLoggedin,
  isAnon,
  isPublic,
} = require("../middlewares/auth.middleware.js");

router.get("/", isPublic, (req, res, next) => {
res.render("home.hbs")






})


module.exports = router