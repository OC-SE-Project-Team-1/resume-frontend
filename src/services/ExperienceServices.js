import apiClient from "./services";

export default {
    getExperiences() {
        return apiClient.get("experience");
    },
    getExperiences(id) {
        return apiClient.get("experience/" + id);
    },
    getExperiencesForUser(userID) {
        return apiClient.get("/experience/user/" + userID);
    },
    addExperience(title, description, startDate, endDate, userID, 
        experienceTypeID, city, state, organization, chatHistory) {
        return apiClient.post("/experience/", {
            "title": String(title),
            "description": String(description),
            "startDate": String(startDate),
            "endDate": endDate,
            "userId": userID,
            "experienceTypeId" : experienceTypeID,
            "city": city,
            "state": state,
            "organization": organization,
            "chatHistory": chatHistory, //Will be updated when AI goes online
        })
    },
    updateExperience() {

    },
    deleteExperience(experienceID, accountID) {
        return apiClient.delete("experience/" + experienceID, {
            data: {"userId": parseInt(accountID)}
        })
    },

    experienceAiAssist(experience, chatHistory){

        return apiClient.post("experience/assist", {
            "title" : "",
            "chatHistory": chatHistory,
            "experience" : String(experience), 
          
      });
    }
}