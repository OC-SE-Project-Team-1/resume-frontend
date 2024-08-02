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
        endDate, gradDate, gpa, organization, city, state, courses, minors, totalGPA, awards, studyAbroad) {
            return apiClient.post("/education/", {
            "title": String(title),
            "description": String(description),
            "userId": accountID,
            "startDate": String(startDate),
            "endDate": String(endDate),
            "gradDate": gradDate,
            "gpa": String(gpa),
            "organization": String(organization),
            "city": String(city),
            "state": String(state),
            "courses": String(courses),
            "minor": String(minors),
            "totalGPA": String(totalGPA),
            "awards": String(awards),
            "studyAbroad": studyAbroad
        });

    },
    updateEducation(title, description, startDate, 
        endDate, gradDate, gpa, organization, city, state, 
        courses, minors, totalGPA, awards, studyAbroad, accountID, id ) {
            return apiClient.put("education/" + id, {
                "title": String(title),
                "description": String(description),
                "userId": accountID,
                "startDate": String(startDate),
                "endDate": String(endDate),
                "gradDate": gradDate,
                "gpa": String(gpa),
                "organization": String(organization),
                "city": String(city),
                "state": String(state),
                "courses": String(courses),
                "minor": String(minors),
                "totalGPA": String(totalGPA),
                "awards": String(awards),
                "studyAbroad": studyAbroad
            })
    },
    deleteEducation(educationID, accountID) {
        return apiClient.delete("education/" + educationID, {
            data: {"userId": parseInt(accountID)}
        })
    }

}