import apiClient from "./services";

export default {
  getSkills() {
    return apiClient.get("skill");
  },
  getSkill(id) {
    return apiClient.get("skill/" + id);
  },
  getSkillsForUser(userID) {
    return apiClient.get("skill/user/" + userID);
  },
  addSkill(skill, skillDescription, chatHistory, accountID) {
    return apiClient.post("/skill/", {
      "title": String(skill),
      "description": String(skillDescription),
      "chatHistory": chatHistory,
      "userId": accountID
    });
  },
  updateSkill(skillId, title, skill, chatHistory, accountID) {
    return apiClient.put("skill/" + skillId, {
      "title": title,
      "description": String(skill),
      "chatHistory": chatHistory,
      "userId": accountID
    });
  },
  deleteSkill(skillId, accountID) {
    return apiClient.delete("skill/" + skillId, {
      data: { "userId": parseInt(accountID) }
    });
  },
  skillAiAssist(skill, chatHistory) {
    return apiClient.post("skill/assist", {
      "chatHistory": chatHistory,
      "description": String(skill),

    });
  }
};