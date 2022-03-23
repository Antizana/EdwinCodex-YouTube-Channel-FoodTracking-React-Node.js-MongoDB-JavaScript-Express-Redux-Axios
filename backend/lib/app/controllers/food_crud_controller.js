/**
 * @fileoverview Implementation of database CRUD operations.
 */
const db = require("../models/models_index");
const Foods = db.foods;

const options = { createdAt: 0, updatedAt: 0, __v: 0 };

/**
 * Create and Save a new Food
 * @param {Object} req Request object with the foods entry in req.body
 * @param {Object} res Response object with the data inserted
 * @returns void if the product name is not present
 */
exports.create = (req, res) => {
  // Validates request
  if (!req.body.productName) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  // Creates a new Food Document
  const food = new Foods({
    user: req.body.user,
    dateTimeFoodTaken: new Date(req.body.dateTimeFoodTaken),
    productName: req.body.productName,
    calorieValue: req.body.calorieValue,
    price: req.body.price,
  });
  // Saves Food in the database
  food
    .save(food)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Food entry.",
      });
    });
};

/**
 * Retrieve all Foods from the database.
 * @param {Object} req Request object with the user to be
 *   (if any) filtered in req.query.user
 * @param {Object} res Response object with the data retrieved
 */
exports.findAll = (req, res) => {
  const user = req.query.user;

  //Search criteria
  var condition = user
    ? { user: { $regex: new RegExp(user), $options: "i" } }
    : {};

  Foods.find(condition, options)
    .sort({ dateTimeFoodTaken: -1 })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Foods.",
      });
    });
};

/**
 * Find a single Food with an id
 * @param {Object} req Request object with the entry food id
 *   to be founded in (req.query.id)
 * @param {Object} res Response object with the food entry data
 */
exports.findOne = (req, res) => {
  const id = req.params.id;
  Foods.findById(id, options)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Food entry with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Food entry with id=" + id });
    });
};

/**
 * Update a Food by the id in the request
 * @param {Object} req Request object with the entry food id
 *   to be updated in (req.query.id) and the food entry data in (req.body)
 * @param {Object} res Response object with the result message
 * @returns status 400 if the food entry cannot be updated
 */
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }
  const id = req.params.id;
  Foods.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Food entry with id=${id}. Maybe Food was not found!`,
        });
      } else res.send({ message: "Food entry was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Food entry with id=" + id,
      });
    });
};

/**
 * Delete a Food with the specified id in the request
 * @param {Object} req Request object with the entry food id
 *   to be deleted in (req.query.id)
 * @param {Object} res Response object with the result message
 */
exports.delete = (req, res) => {
  const id = req.params.id;
  Foods.findByIdAndRemove(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Food entry with id=${id}. Maybe Food entry was not found!`,
        });
      } else {
        res.send({
          message: "Food entry was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Food entry with id=" + id,
      });
    });
};

/**
 * Find all Foods entries in the previous N days from now
 * @param {Object} req Request object with the N days parameter in (req.query.days)
 * @param {Object} res Response object with the food entries result
 */
exports.findAllNDays = (req, res) => {
  const nDays = parseInt(req.query.days);
  const previousDate = new Date();
  previousDate.setHours(0, 0, 0, 0);
  previousDate.setDate(previousDate.getDate() - nDays + 1);

  //Search criteria
  searchNDays = {
    dateTimeFoodTaken: {
      $gte: previousDate,
    },
  };

  //Search
  Foods.find(searchNDays, options)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Food entries.",
      });
    });
};

/**
 * Find all Foods entries in the previous N days from now
 * @param {Object} req Request object with the N days parameter in (req.query.days)
 * @param {Object} res Response object with the food entries result
 */
exports.findAllNDays = (req, res) => {
  const nDays = parseInt(req.query.days);
  const previousDate = new Date();
  previousDate.setHours(0, 0, 0, 0);
  previousDate.setDate(previousDate.getDate() - nDays + 1);

  //Search criteria
  const searchNDays = {
    dateTimeFoodTaken: {
      $gte: previousDate,
    },
  };

  //Search
  Foods.find(searchNDays, options)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Food entries.",
      });
    });
};

/**
 * Find all Total Calories per User in the previous N days from now
 * @param {Object} req Request object with the N days parameter in (req.query.days)
 * @param {Object} res Response object with the food entries result
 */
exports.totalCaloriesUser = (req, res) => {
  const nDays = parseInt(req.query.days);
  const previousDate = new Date();
  previousDate.setHours(0, 0, 0, 0);
  previousDate.setDate(previousDate.getDate() - nDays + 1);

  //Search criteria
  const searchNDays = {
    dateTimeFoodTaken: {
      $gte: previousDate,
    },
  };

  //Aggregation and search criteria
  const groupCriteria = [
    { $match: { dateTimeFoodTaken: { $gte: previousDate } } },
    { $group: { _id: "$user", totalCalories: { $sum: "$calorieValue" } } },
  ];

  //Search
  Foods.aggregate(groupCriteria)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Food entries.",
      });
    });
};
