import apiClient from "./services";

export default {
  getSkills() {
    return apiClient.get("skill");
  },
  getSkill(id) {
    return apiClient.get("skill/" + id);
  },
  getSkillsForUser(userID){
    return apiClient.get("skill/user/" + userID);
  },
  addSkill(skill, skillDescription, accountID) {
    return apiClient.post("/skill/", {
      "title": String(skill),
      "description": String(skillDescription),
      "userId": accountID
    });
  },
  updateSkill(skillId, skill, accountID) {
    return apiClient.put("skill/" + skillId, {
      "description": String(skill),
      "userId": accountID
    });
  },
  deleteSkill(skillId, accountID) {
    return apiClient.delete("skill/" + skillId, {
      data: {"userId": parseInt(accountID)}
  });
  },

  skillAiAssist(skill, chatHistory){
    return apiClient.post("skill/assist", {
      data: {
        "chatHistory": chatHistory,
        "description" : skill, 
      }
  });
  }
};