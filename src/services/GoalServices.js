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
  addGoal(goal, goalDescription, accountID, history) {
    return apiClient.post("/goal/", {
      "title": String(goal),
      "description": String(goalDescription),
      "chatHistory": history, //Will be updated when AI goes online
      "userId": accountID
    });
  },
  updateGoal(goalId, title, description, accountID) {
    return apiClient.put("goal/" + goalId, {
      "title" : String(title),
      "description": String(description),
      "userId": accountID
    });
  },
  deleteGoal(goalId, accountID) {
    return apiClient.delete("goal/" + goalId, {
      data: {"userId": parseInt(accountID)}
  });
  },

  goalAiAssist(title, experiences, achievements, chatHistory){
    return apiClient.post("goal/assist", {
      "chatHistory": chatHistory,
      "title" : title, 
      "experiences" : experiences, 
      "achievements" : achievements, 
    });
  }
};