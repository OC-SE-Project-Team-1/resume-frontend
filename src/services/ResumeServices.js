import apiClient from "./services";

export default {
  getResumes() {
    return apiClient.get("resumes");
  },
  getResume(id) {
    return apiClient.get("resumes/" + id);
  },
  getResumesForUser(userID) {
    return apiClient.get("resumes/user/" + userID);
  },
  addResume(title, goalArr, exArr, skillArr, eduArr, linkArr, isEdit, template, accountID) {
    return apiClient.post("/resumes/", {
      "title": title,
      "content": "Content",
      "goalId": goalArr,
      "experienceId": exArr,
      "skillId": skillArr,
      "educationId": eduArr,
      "linkId": linkArr,
      "editing": isEdit,
      "template": template,
      "userId": accountID
    });
  },
  updateResume(linkId, link, accountID) {
    return apiClient.put("resumes/" + linkId, {
      "url": String(link),
      "userId": accountID
    });
  },

  updateResumeEditing(resumeId, editing, accountID) {
    return apiClient.put("resumes/" + resumeId, {
      "editing": editing,
      "userId": accountID
    });
  },
  updateResumeFeedback(resumeId, feedback, accountID) {
    return apiClient.put("resumes/" + resumeId, {
      "rating": feedback,
      "userId": accountID
    });
  },
  inputCSFeedback(resumeId, feedback, userID) {
    return apiClient.put("resumes/" + resumeId, {
      "comments": feedback,
      "userId": userID
    });
  },
  deleteResume(resumeId, accountID) {
    return apiClient.delete("resumes/" + resumeId, {
      data: { "userId": parseInt(accountID) }
    });
  },
  getFeedback(resumeId, jobDescriptionId) {
    return apiClient.post("/resumes/jobFeedback", {
      "resumeId": resumeId,
      "jobDescId": jobDescriptionId
    });
  }
};