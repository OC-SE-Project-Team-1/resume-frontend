import apiClient from "./services";

export default {
  getTimePeriods() {
    return apiClient.get("timePeriod");
  },
  gettimePeriod(id) {
    return apiClient.get("timePeriod/" + id);
  },
  gettimePeriodForUser(userID){
    return apiClient.get("timePeriod/account/" + userID);
  },
  addtimePeriod(timePeriod, accountID) {
    return apiClient.post("timePeriod", {
      "name": String(timePeriod),
      "userId": accountID
    });
  },
  updatetimePeriod(timePeriodId, timePeriod, accountID) {
    return apiClient.put("timePeriod/" + timePeriodId, {
      "name": String(timePeriod),
      "userId": accountID
    });
  },
  deletetimePeriod(timePeriodId, accountID) {
    return apiClient.delete("timePeriod/" + timePeriodId, {
      data: {"userId": parseInt(accountID)}
  });
  },
};