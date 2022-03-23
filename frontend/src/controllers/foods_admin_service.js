import http from "../http_common";
class FoodsAdminService {
  // Update a Food with id
  update(id, data) {
    return http.put(`/foods/${id}`, data);
  }
  // Delete a Food with id
  delete(id) {
    return http.delete(`/foods/${id}`);
  }
  // Delete all Food entries
  deleteAll() {
    return http.delete(`/foods`);
  }
  // Retrieve the Average Calories Per User in the last N days
  averageCalories(nDays) {
    return http.get(`/foods/averageCalories?days=${nDays}`);
  }
  // Retrieves the number of food entries the last N days
  lastEntriesComparison(nDays) {
    return http.get(`/foods/findAllNDays?days=${nDays}`);
  }
}
export default new FoodsAdminService();
