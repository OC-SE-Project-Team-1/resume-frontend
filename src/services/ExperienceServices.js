import apiClient from "./services";

export default {
    getExperiences() {
        return apiClient.get("experience");
    },
    getExperiences(id, userID) {
        return apiClient.get("experience/" + String(id), {
            "userId": parseInt(userID)
        });
    },
    getExperiencesForUser(userID) {
        return apiClient.get("/experience/user/" + userID);
    },
    addExperience(title, description, startDate, endDate, userID, 
        experienceTypeID, city, state, organization) {
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
            "history": [], //Will be updated when AI goes online
        })
    },
    updateExperience(title, description, startDate, endDate, userID, 
        experienceTypeID, city, state, organization) {
        return apiClient.put("/experience/", {
            "title": String(title),
            "description": String(description),
            "startDate": String(startDate),
            "endDate": endDate,
            "userId": userID,
            "experienceTypeId" : experienceTypeID,
            "city": city,
            "state": state,
            "organization": organization,
            "history": [], //Will be updated when AI goes online
        })

    },
    deleteExperience(experienceID, accountID) {
        return apiClient.delete("experience/" + experienceID, {
            data: {"userId": parseInt(accountID)}
        })
    }
}