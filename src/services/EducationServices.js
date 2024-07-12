import apiClient from "./services";

export default {
    getEducations() {
        return apiClient.get("education")
    },
    getEducation(id) {
        return apiClient.get("education/" + id);
    },
    getEducationsForUser(userID) {
        return apiClient.get("education/user/" + userID);
    },
    addEducation(title, description, accountID, startDate, 
        endDate, gradDate, gpa, organization, city, state) {
        return apiClient.post("/education/", {
            "title": String(title),
            "description": String(description),
            "userId": accountID,
            "startDate": String(startDate),
            "endDate": String(endDate),
            "gradDate": String(gradDate),
            "gpa": String(gpa),
            "organization": String(organization),
            "city": String(city),
            "state": String(state),
            "courses": "N/A",
            "minor": "N/A",
            "totalGPA": "4.00"
        });

    },
    updateEducation() {

    },
    deleteEducation(educationID, accountID) {
        return apiClient.delete("education/" + educationID, {
            data: {"userId": parseInt(accountID)}
        })
    }

}