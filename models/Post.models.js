const { model } = require("mongoose");

const Schema = require("mongoose").Schema;

const postSchema = new Schema({
title: String, 
description: String,
imageUrl: String,
owner: {
type: Schema.Types.ObjectId,
ref: "User",
},
comment:[{type: Schema.Types.ObjectId, ref: "Comment"}],
tag: String
});

const Post = model("Post", postSchema);

module.exports = Post;
