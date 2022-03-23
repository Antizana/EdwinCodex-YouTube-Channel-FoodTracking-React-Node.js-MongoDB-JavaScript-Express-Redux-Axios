const db = require("../models/models_index");
const Foods = db.foods;
const foodData = require("../models/data.js");

// Insert Initial Data into the database.
exports.insertInitialData = (req, res) => {
  Foods.insertMany(foodData)
    .then((data) => {
      res.send({
        message: `${data.length} Food entries were inserted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while inserting all Foods.",
      });
    });
};

// Delete all Foods from the database.
exports.deleteAll = (req, res) => {
  Foods.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Food entries were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Foods.",
      });
    });
};
