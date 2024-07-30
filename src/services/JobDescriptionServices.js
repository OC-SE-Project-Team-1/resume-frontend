import apiClient from "./services";

export default {
  getJobDescriptions() {
    return apiClient.get("jobDescription");
  },
  getJobDescription(id) {
    return apiClient.get("jobDescription/" + id);
  },
  getJobDescriptionsForUser(userID){
    return apiClient.get("jobDescription/user/" + userID);
  },
  addJobDescription(jobDescriptionTitle, jobDescription, accountID) {
    return apiClient.post("/jobDescription/", {
      "title": String(jobDescriptionTitle),
      "description": String(jobDescription),
      "userId": accountID
    });
  },
  updateJobDescription(jobDescriptionId, jobDescription, accountID) {
    return apiClient.put("jobDescription/" + jobDescriptionId, {
      "description": String(jobDescription),
      "userId": accountID
    });
  },
  deleteJobDescription(jobDescriptionId, accountID) {
    return apiClient.delete("jobDescription/" + jobDescriptionId, {
      data: {"userId": parseInt(accountID)}
  });
  }
};