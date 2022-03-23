const db = require("../models/models_index");
require("dotenv").config({ path: "../../../.env_admin" });
const { isValidDate } = require("../utils/utils");

const Foods = db.foods;
const CALORIES_LIMIT = parseInt(process.env.CALORIES_THRESHOLD) || 2100;
const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const COST_LIMIT = parseInt(process.env.COST_THRESHOLD) || 1000;
const options = { createdAt: 0, updatedAt: 0, __v: 0 };

// Find the Total Calories and Average Calories for all Foods entries per Day
exports.totalCaloriesPerUser = (req, res) => {
  const userParam = req.params.user;

  const groupCriteria = [
    {
      $project: {
        date: {
          $dateTrunc: {
            date: "$dateTimeFoodTaken",
            unit: "day",
            timezone: currentTimeZone,
          },
        },
        user: 1,
        calorieValue: 1,
      },
    },
    { $match: { user: userParam } },
    {
      $group: {
        _id: "$date",
        totalCalories: { $sum: "$calorieValue" },
      },
    },
    { $match: { totalCalories: { $gt: CALORIES_LIMIT } } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalCalories: 1,
      },
    },
    { $sort: { date: -1 } },
  ];

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

// Find the Total Calories and Average Calories for all Foods entries per A GIVEN DAY
exports.totalCaloriesPerUserDate = (req, res) => {
  const userParam = req.params.user;
  const dateQuery = new Date(req.query.date);
  const groupCriteria = [
    {
      $project: {
        date: {
          $dateTrunc: {
            date: "$dateTimeFoodTaken",
            unit: "day",
            timezone: currentTimeZone,
          },
        },
        user: 1,
        calorieValue: 1,
      },
    },
    {
      $match: { $and: [{ user: userParam }, { date: dateQuery }] },
    },
    {
      $group: {
        _id: "$date",
        totalCalories: { $sum: "$calorieValue" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalCalories: 1,
      },
    },
  ];

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

// Find the Total Spending for all Foods entries per Month
exports.totalSpendingPerUserPerMonth = (req, res) => {
  const userParam = req.params.user;

  const groupCriteria = [
    {
      $project: {
        date: {
          $dateTrunc: {
            date: "$dateTimeFoodTaken",
            unit: "month",
            timezone: currentTimeZone,
          },
        },
        user: 1,
        price: 1,
      },
    },
    { $match: { user: userParam } },
    {
      $group: {
        _id: "$date",
        totalSpending: { $sum: "$price" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalSpending: 1,
      },
    },
    { $match: { totalSpending: { $gt: COST_LIMIT } } },
    { $sort: { date: -1 } },
  ];

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

// Find the Total Spending for all Foods entries PER USER IN A GIVEN MONTH
exports.totalSpendingPerUserInMonth = (req, res) => {
  const userParam = req.params.user;
  const dateQuery = new Date(req.query.month);

  const groupCriteria = [
    {
      $project: {
        date: {
          $dateTrunc: {
            date: "$dateTimeFoodTaken",
            unit: "month",
            timezone: currentTimeZone,
          },
        },
        user: 1,
        price: 1,
      },
    },
    { $match: { $and: [{ user: userParam }, { date: dateQuery }] } },
    {
      $group: {
        _id: "$date",
        totalSpending: { $sum: "$price" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalSpending: 1,
      },
    },
  ];

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
 *  Retrieves all Foods from the database in a RANGE OF DATES.
 *   for a given user and a given range of dates. If the user
 *   is not provided the result will return all users.
 *   If the startDate is not provided the result will return
 *   the entries from the beginning. And if the endDate is
 *   not provided, the result will return the entries until
 *   now.
 * @params req.params.user User to be filtered
 * @query req.query.startDate Start Date to be filtered
 * @query req.query.endDate End Date to be filtered
 */
exports.findAllByDates = (req, res) => {
  const userParam = req.params.user;
  const startDate = isValidDate(new Date(req.query.startDate))
    ? new Date(req.query.startDate)
    : new Date(1900, 0, 1);
  const endDate = isValidDate(new Date(req.query.endDate))
    ? new Date(req.query.endDate)
    : new Date();

  // Constructs the condition for the given criteria
  var condition = {
    $and: [
      { user: userParam },
      { dateTimeFoodTaken: { $gte: startDate } },
      { dateTimeFoodTaken: { $lte: endDate } },
    ],
  };

  // Retrieves the data
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
