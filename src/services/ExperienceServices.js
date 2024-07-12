import apiClient from "./services";

export default {
    getExperiences() {
        return apiClient.get("experience");
    },
    getExperiences(id) {
        return apiClient.get("experience/" + id);
    },
    getExperiencesForUser(userID) {
        return apiClient.get("axperience/user/" + userID);
    },
    addExperience(title, description, startDate, endDate, userID, 
        experienceTypeID, city, state, organization) {
        return apiClient.post("/experience/", {
            "title": String(title),
            "description": String(description),
            "startDate": String(startDate),
            "endDate": String(endDate),
            "userId": userID,
            "experienceTypeId" : experienceTypeID,
            "city": String(city),
            "state": String(state),
            "organization": String(organization)
        })
    },
    updateExperience() {

    },
    deleteExperience(experienceID, accountID) {
        return apiClient.delete("experience/" + experienceID, {
            data: {"userId": parseInt(accountID)}
        })
    }
}