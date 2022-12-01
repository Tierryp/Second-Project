const { model } = require("mongoose");

const Schema = require("mongoose").Schema

const userSchema = new Schema ({
username: String,
password: String,
description: String,
isAdmin: {type: Boolean, default: false},
isOwner: {type: Boolean, default: false},
profilePic: {type: String, default: "/images/smile2.png"}
})


const User = model("User", userSchema)

module.exports = User



