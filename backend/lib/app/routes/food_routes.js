module.exports = (app) => {
  const foods = require("../controllers/food_crud_controller.js");
  const foodsAdmin = require("../controllers/food_admin_controller.js");
  const foodsUser = require("../controllers/food_user_controller.js");
  const foodsDeveloper = require("../controllers/food_developer_controller.js");
  require("dotenv").config({ path: ".env_admin" });

  var router = require("express").Router();
  // Create a new Food
  router.post("/", foods.create);
  // Retrieve all Foods
  router.get("/", foods.findAll);
  // Retrieve all Foods entries in the last N days
  router.get("/findAllNDays", foodsAdmin.findAllNDays);

  // Retrieve Total calories per user in the last N days
  router.get("/averageCalories", foodsAdmin.totalCaloriesUser);
  // Retrieve Total calories PER USER IN A DATE
  router.get("/totalCaloriesInDate/:user", foodsUser.totalCaloriesPerUserDate);
  // Retrieve Total calories per user per day, greater than the daily THRESHOLD LIMIT of calories
  router.get("/totalCalories/:user", foodsUser.totalCaloriesPerUser);
  // Retrieve all Foods entries PER USERS PER DATES
  router.get("/byDates/:user", foodsUser.findAllByDates);

  // Retrieve Total SPENDING per User PER Month
  router.get("/totalSpending/:user", foodsUser.totalSpendingPerUserPerMonth);
  // Retrieve Total SPENDING per User IN A GIVEN MONTH
  router.get(
    "/totalSpendingInMonth/:user",
    foodsUser.totalSpendingPerUserInMonth
  );

  // Retrieve a single Food with id
  router.get("/:id", foods.findOne);
  // Update a Food with id
  router.put("/:id", foods.update);
  // Delete a Food with id
  router.delete("/:id", foods.delete);
  // Delete all Food entries
  router.delete("/", foodsDeveloper.deleteAll);
  // Initialize the database with test data
  router.post("/initialData", foodsDeveloper.insertInitialData);

  //Api route endpoint
  app.use("/api/v1/foods", router);
};
