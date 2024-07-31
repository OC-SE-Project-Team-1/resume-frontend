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
    addExperience(title, description, startDate, endDate, isCurrent, userID, 
        experienceTypeID, city, state, organization, chatHistory) {
        return apiClient.post("/experience/", {
            "title": String(title),
            "description": String(description),
            "startDate": String(startDate),
            "endDate": endDate,
            "current": isCurrent,
            "userId": userID,
            "experienceTypeId" : experienceTypeID,
            "city": city,
            "state": state,
            "organization": organization,
            "chatHistory": chatHistory,
        })
    },
    updateExperience(title, description, startDate, endDate, isCurrent,
                city, state, organization, chatHistory, userID, id ) {
            return apiClient.put("/experience/" + id, {
                "title": String(title),
                "description": String(description),
                "startDate": String(startDate),
                "endDate": endDate,
                "current": isCurrent,
                "userId": userID,
                "city": city,
                "state": state,
                "organization": organization,
                "chatHistory": chatHistory,
            })
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