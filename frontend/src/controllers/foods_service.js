import http from "../http_common";

class FoodsDataService {
  // Retrieve all Foods
  getAll() {
    return http.get("/foods");
  }
  // Retrieve a single Food with id
  get(id) {
    return http.get(`/foods/${id}`);
  }
  // Create a new Food
  create(data) {
    return http.post("/foods", data);
  }
  // Retrieve a User's Foods by USER
  findByUser(user) {
    return http.get(`/foods?user=${user}`);
  }
  // Retrieve a User's Foods by DATES
  findByUserDates(user, startDate, endDate) {
    return http.get(
      `/foods/byDates/${user}?startDate=${startDate}&endDate=${endDate}`
    );
  }
  // Retrieve the DATE entries where a user is PASSED THE CALORIES THRESHOLD
  findLimitCalories(user) {
    return http.get(`/foods/totalCalories/${user}`);
  }
  // Retrieve the Total Calories from a User IN A GIVEN DATE
  totalCaloriesPerUserDate(user, date) {
    return http.get(`/foods/totalCaloriesInDate/${user}?date=${date}`);
  }
  // Retrieve the Total Spending from a User IN A GIVEN MONTH
  totalSpendingPerUserInMonth(user, month) {
    return http.get(`/foods/totalSpendingInMonth/${user}?month=${month}`);
  }
}
export default new FoodsDataService();
