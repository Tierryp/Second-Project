const express = require("express")
const app = express()
const mongoose = require("mongoose");
var path = require("path");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/interface.routes.js")
const adminRouter = require("./routes/admin.routes")
require("./config/session.config")(app);
require("dotenv/config");




// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.isLoggedIn = true;
  } else {
    res.locals.isLoggedIn = false;
  }
  next();
});


app.use("/", indexRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/admin", adminRouter)







mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));



  app.listen(process.env.PORT || 4000);
  module.exports = app;


