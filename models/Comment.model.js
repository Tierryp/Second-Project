const { model, Schema } = require("mongoose");

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, maxlength: 200 },
  button: false
});

const Comment = model("Comment", commentSchema);

module.exports = Comment;
