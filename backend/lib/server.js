const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Connection settings
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Connect to the database
const db = require("./app/models/models_index");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Root endpoint for Calories Tracking App
app.get("/", (req, res) => {
  res.send(`Root endpoint`);
});

require("./app/routes/food_routes")(app);

app.listen(PORT, HOST, () => {
  console.log(`Listening on port ${PORT}...`);
});
