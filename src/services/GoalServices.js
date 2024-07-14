import apiClient from "./services";

export default {
  getGoals() {
    return apiClient.get("goal");
  },
  getGoal(id) {
    return apiClient.get("goal/" + id);
  },
  getGoalsForUser(userID){
    return apiClient.get("goal/user/" + userID);
  },
  addGoal(goal, goalDescription, accountID) {
    return apiClient.post("/goal/", {
      "title": String(goal),
      "description": String(goalDescription),
      "history": [], //Will be updated when AI goes online
      "userId": accountID
    });
  },
  updateGoal(goalId, goal, accountID) {
    return apiClient.put("goal/" + goalId, {
      "description": String(goal),
      "userId": accountID
    });
  },
  deleteGoal(goalId, accountID) {
    return apiClient.delete("goal/" + goalId, {
      data: {"userId": parseInt(accountID)}
  });
  },
};