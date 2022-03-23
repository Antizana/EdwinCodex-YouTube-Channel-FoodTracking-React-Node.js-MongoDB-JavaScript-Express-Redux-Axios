/**
 * @fileoverview Implementation of admin role searches.
 */
const db = require("../models/models_index");
const Foods = db.foods;

const hideFields = { createdAt: 0, updatedAt: 0, __v: 0 };

/**
 * Find all Foods entries in the previous N days from now
 * @param {Object} req Request object containing in req.query.days the number
 *   of days to retrieve data
 * @param {Object} res Response object with the data filtered
 */
exports.findAllNDays = (req, res) => {
  const nDays = parseInt(req.query.days);
  const previousDate = new Date();
  previousDate.setHours(0, 0, 0, 0);
  previousDate.setDate(previousDate.getDate() - nDays + 1);
  previousDateTime = new Date(
    new Date().getTime() - nDays * 24 * 60 * 60 * 1000
  );

  //Aggregation and search criteria
  const groupCriteria = [
    { $match: { dateTimeFoodTaken: { $gte: previousDate } } },
    { $group: { _id: null, totalEntries: { $sum: 1 } } },
    {
      $project: {
        _id: 0,
        totalEntries: 1,
      },
    },
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

/**
 * Returns the average number of calories added per user for the last N days
 * @param {Object} req Request object containing in req.query.days the number
 *   of days to filter the calories data.
 * @param {Object} res Response object with the data filtered
 */
exports.totalCaloriesUser = (req, res) => {
  const nDays = parseInt(req.query.days);
  const previousDate = new Date();
  previousDate.setHours(0, 0, 0, 0);
  previousDate.setDate(previousDate.getDate() - nDays + 1);

  //Aggregation and search criteria
  const groupCriteria = [
    { $match: { dateTimeFoodTaken: { $gte: previousDate } } },
    { $group: { _id: "$user", totalCalories: { $sum: "$calorieValue" } } },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        user: "$_id",
        totalCalories: 1,
        averageCalories: { $divide: ["$totalCalories", nDays] },
      },
    },
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
