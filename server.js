// import dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const mongoose = require("mongoose");
const config = require("config");
const path = require("path");
const Room = require("./models/Rooms");
const roomGenerator = require("./util/roomIdGenerator.js");
const { DateTime } = require("luxon");

// import handlers
const homeHandler = require("./controllers/home.js");
const roomHandler = require("./controllers/room.js");

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const db = config.get("mongoURI");

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// set up stylesheets route

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint
app.post("/create", function (req, res) {
  const newRoom = new Room({
    name: req.body.roomName,
    roomID: roomGenerator.roomIdGenerator(),
  });
  newRoom
    .save()
    .then(console.log("Room added"))
    .catch((e) => console.log(e));
  res.redirect("/");
});

app.get("/getRoom", function (req, res) {
  Room.find()
    .lean()
    .then((items) => {
      res.json(items);
    });
});

app.get("/", homeHandler.getHome);
app.get("/:roomName", roomHandler.getRoom);

app.post("/newMessage", function (req, res) {
  var messageObj = {
    user: req.body.username,
    timestamp: DateTime.now().toLocaleString(DateTime.DATETIME_MED),
    messageText: req.body.messageText,
  };

  // Help from this: https://stackoverflow.com/a/49913341
  Room.findOneAndUpdate(
    { roomID: req.body.roomID },
    { $push: { messages: messageObj } },
    function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log(success);
      }
    }
  );
  console.log(req.body);
});

app.get("/:roomName/messages", function (req, res) {
  // TODO: FIND BY 'roomID' INSTEAD.
  Room.find({ name: req.params.roomName })
    .lean()
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      // error catching
      console.log(err);
    });
});

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
