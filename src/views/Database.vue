<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import UserServices from "../services/UserServices.js";
import LinkServices from "../services/LinkServices.js";
import GoalServices from "../services/GoalServices.js";
import SkillServices from "../services/SkillServices.js";
import EducationServices from "../services/EducationServices.js";
import ExperienceServices from "../services/ExperienceServices.js";
import Snackbar from "../components/Snackbar.vue";

const account = ref();
//Snackbar to display errors
const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text){
  snackbarValue.value = true;
  snackbarColor.value = color;
  snackbarText.value = text;
}
const isNewLinkVisible = ref(false);
const isNewEduVisible = ref(false);
const tabs = ref();
const tab = ref("1");
const dialog = ref(false);

const personalInfo = ref();
const firstName = ref();
const lastName = ref();
const address = ref();
const phoneNumber = ref();
const email = ref();
const linkDescription = ref("");
const link = ref("");
const links = ref();
const selectedLinks = ref(null);

const goalTitle = ref("");
const goalDescription = ref("");
const goals = ref();
const selectedGoals = ref(null);
const isNewGoalVisible = ref(false);
const aiGoalExperiences = ref();
const aiGoalAchievements = ref();
const aiGoalTitle = ref();
let goalChatHistory = [];

const educationInfo = ref();
const selectedEducation = ref(null);
const schoolName = ref("");
const schoolCity = ref("");
const schoolState = ref("");
const gpa = ref("");
const maxGpa = ref("");
const degree = ref("");
const schoolStart = ref("");
const schoolEnd = ref("");
const schoolGrad = ref(null);
const degreeTitle = ref("");
const degreeType = ref("");
const minors = ref(null);
const courses = ref(null);
const attending = ref(false);
const awards = ref(null);
const studyAbroadTitle = ref(null);
const studyAbroadOrganization = ref(null);
const studyAbroadLocation = ref(null);
const studyAbroadTime = ref(null);
const studyAbroadYear = ref(null);
const editedStudyAbroadTitle = ref(null);
const editedStudyAbroadOrganization = ref(null);
const editedStudyAbroadLocation = ref(null);
const editedStudyAbroadTime = ref(null);
const editedStudyAbroadYear = ref(null);

const experiences = ref();
const selectedWorkExperience = ref(null);
const selectedLeadershipExperience = ref(null);
const selectedActivitiesExperience = ref(null);
const selectedVolunteerExperience = ref(null);
const selectedHonorExperience = ref(null);
const selectedAwardExperience = ref(null);
const selectedProjectExperience = ref(null);

const isJobExperience = ref(false);
const jobExperienceTitle = ref(null);
const jobCompany = ref(null);
const jobCity = ref(null);
const jobState = ref(null);
const jobStart = ref(null);
const jobEnd = ref(null);
const jobDescription = ref(null);
let experienceChatHistory = [];

const isLeadershipExperience = ref(false);
const isActivitiesExperience = ref(false);
const isVolunteerExperience = ref(false);
const isHonorExperience = ref(false);
const isAwardExperience = ref(false);
const isProjectExperience = ref(false);
const isCurrent = ref(false);

const skillTitle = ref("");
const skillDescription = ref("");
const skills = ref();

let skillHistory = [];
const selectedSkills = ref(null);
const isNewSkillVisible = ref(false);

const isMinors = ref(false);
const isCourses = ref(false);
const isStudyAbroad = ref(false);
const isAwards = ref(false);

const isAttending = ref(false);

let deleteItemId = 0;
const isRequestingAiAssist = ref(false);

//gray out submit button rules
const isLinked = computed(() => {
    return (
        link.value !== "" &&
        linkDescription.value !== ""
    )
});
const isGoals = computed(() => {
    return (
        goalTitle.value !== "" &&
        goalDescription.value !== ""
    )
});
const isSkilled = computed(() => {
    return (
        skillTitle.value !== "" &&
        skillDescription.value !== ""
    )
});
const isEducationFilled = computed(() => {
    var endGrad = isAttending.value ? (schoolGrad.value !== "" && schoolGrad.value !== null) :
        (schoolEnd.value !== "" && schoolEnd.value !== null)
    var isdegree = degreeTitle.value == 'High School Diploma' || (degree.value !== "" && degree.value !== null &&
        degreeTitle.value !== "" && degreeTitle.value !== null &&
        degreeType.value !== "" && degreeType.value !== null)
    return (
        schoolName.value !== "" && schoolName.value !== null &&
        schoolCity.value !== "" && schoolCity.value !== null &&
        schoolState.value !== "" && schoolState.value !== null &&
        schoolStart.value !== "" && schoolStart.value !== null &&
        isdegree && endGrad
    )
})

const isExperienced = computed(() => {
    var isEndDate = isCurrent.value ? true : (jobEnd.value !== "" && jobEnd.value !== null)
    return (
        jobExperienceTitle.value !== "" && jobExperienceTitle.value !== null &&
        jobCompany.value !== "" && jobCompany.value !== null &&
        jobCity.value !== "" && jobCity.value !== null &&
        jobState.value !== "" && jobState.value !== null &&
        jobStart.value !== "" && jobStart.value !== null &&
        jobDescription.value !== "" && jobDescription.value !== null && isEndDate
    )
})

const isOthered = computed(() => {
    return (
        jobExperienceTitle.value !== "" && jobExperienceTitle.value !== null &&
        jobStart.value !== "" && jobStart.value !== null &&
        jobDescription.value !== "" && jobDescription.value !== null
    )
})

onMounted(() => {
    account.value = JSON.parse(localStorage.getItem("account"));
    getPersonalInfo();
});

async function setNewLinkVisible() {
    isNewLinkVisible.value = true;
}

async function closeNewLink() {
    isNewLinkVisible.value = false;
    link.value = "";
    linkDescription.value = "";
}

async function setNewGoalVisible() {
    isNewGoalVisible.value = true;
}
async function closeNewGoal() {
    isNewGoalVisible.value = false;
    goalTitle.value = "";
    goalDescription.value = "";
}

async function getLinks() {
    await LinkServices.getLinksForUser(account.value.id)
        .then((response) => {
            links.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

async function addNewLink() {
    await LinkServices.addLink(link.value, linkDescription.value, parseInt(account.value.id))
        .then(() => {
            makeSnackbar("green", "Link Added!");
            closeNewLink();
            getLinks();
        })
        .catch((error) => {
            makeSnackbar("error", error.response.data.message);
        });
}

async function navigateNextTab(value) {

    resetNewInput();
    const temp = value + 1;

    getGoals();
    getEducationInfo();
    getExperiences();
    getSkills();

    tab.value = temp.toString();
}

async function resetNewInput() {
    closeNewLink();
    closeNewGoal();
    closeEducation();
    clearExperienceData();
    closeNewJobExperience();
    closeNewLeadershipExperience();
    closeNewActivitiesExperience();
    closeNewVolunteerExperience();
    closeNewSkill();
    closeNewHonor();
    closeNewAward();
    closeNewProject();
}

function toggleIsAttending() {
    isAttending.value = !isAttending.value;

    if (isAttending.value == false) {
        schoolGrad.value = null;
    }
}

function toggleExperience(value) {
    if (value == 1) {
        isJobExperience.value = !isJobExperience.value;
        if (isJobExperience.value == false) {
            clearExperienceData();
        }
        if (isJobExperience.value == true) {
            clearExperienceData();
            isLeadershipExperience.value = false;
            isActivitiesExperience.value = false;
            isVolunteerExperience.value = false;
        }
    }
    else if (value == 2) {
        isLeadershipExperience.value = !isLeadershipExperience.value;
        if (isLeadershipExperience.value == false) {
            clearExperienceData();
        }
        if (isLeadershipExperience.value == true) {
            clearExperienceData();
            isJobExperience.value = false;
            isActivitiesExperience.value = false;
            isVolunteerExperience.value = false;
        }
    }
    else if (value == 3) {
        isActivitiesExperience.value = !isActivitiesExperience.value;
        if (isActivitiesExperience.value == false) {
            clearExperienceData();
        }
        if (isActivitiesExperience.value == true) {
            clearExperienceData();
            isJobExperience.value = false;
            isLeadershipExperience.value = false;
            isVolunteerExperience.value = false;
        }
    }
    else if (value == 4) {
        isVolunteerExperience.value = !isVolunteerExperience.value;
        if (isVolunteerExperience.value == false) {
            clearExperienceData();
        }
        if (isVolunteerExperience.value == true) {
            clearExperienceData();
            isJobExperience.value = false;
            isLeadershipExperience.value = false;
            isActivitiesExperience.value = false;
        }
    }
    else if (value == 5) {
        isHonorExperience.value = !isHonorExperience.value;
        if (isHonorExperience.value == false) {
            closeNewHonor();
        }
        if (isHonorExperience.value == true) {
            clearExperienceData();
            isAwardExperience.value = false;
            isProjectExperience.value = false;
        }
    }
    else if (value == 6) {
        isAwardExperience.value = !isAwardExperience.value;
        if (isAwardExperience.value == false) {
            closeNewAward();
        }
        if (isAwardExperience.value == true) {
            clearExperienceData();
            isHonorExperience.value = false;
            isProjectExperience.value = false;
        }
    }
    else if (value == 7) {
        isProjectExperience.value = !isProjectExperience.value;
        if (isProjectExperience.value == false) {
            closeNewProject();
        }
        if (isProjectExperience.value == true) {
            clearExperienceData();
            isAwardExperience.value = false;
            isHonorExperience.value = false;
        }
    }
}


function showMinors() {
    isMinors.value = !isMinors.value;

    if (isMinors.value == false) {
        minors.value = null;
    }
}

function showCourses() {
    isCourses.value = !isCourses.value;

    if (isCourses.value == false) {
        courses.value = null;
    }
}
function showStudyAbroad() {
    isStudyAbroad.value = !isStudyAbroad.value;

    if (isStudyAbroad.value == false) {
        studyAbroadTitle.value = null;
        studyAbroadOrganization.value = null;
        studyAbroadLocation.value = null;
        studyAbroadTime.value = null;
        studyAbroadYear.value = null;
    }
}

function showAwards() {
    isAwards.value = !isAwards.value;

    if (isAwards.value == false) {
        awards.value = null;
    }
}

async function getPersonalInfo() {
    resetNewInput()
    await UserServices.getUser(parseInt(account.value.id))
        .then((response) => {
            personalInfo.value = response.data;
            firstName.value = personalInfo.value.firstName;
            lastName.value = personalInfo.value.lastName;
            address.value = personalInfo.value.address;
            phoneNumber.value = personalInfo.value.phoneNumber;
            email.value = personalInfo.value.email;
            getLinks();
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

async function getGoals() {
    resetNewInput()
    await GoalServices.getGoalsForUser(parseInt(account.value.id))
        .then((response) => {
            goals.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

async function addNewGoal() {
    await GoalServices.addGoal(goalTitle.value, goalDescription.value, parseInt(account.value.id), goalChatHistory)
        .then(() => {
            makeSnackbar("green", "Goal Added!");
            closeNewGoal();
            getGoals();
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

async function getEducationInfo() {
    resetNewInput()
    await EducationServices.getEducationsForUser(parseInt(account.value.id))
        .then((response) => {
            educationInfo.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

async function addNewEducation() {
    var tempTitle = schoolState.value + " " + schoolStart.value + " " + gpa.value;
    var tempDegree = degreeTitle.value + " of " + degreeType.value + " in " + degree.value;
    var studyAbroad = null;
    if (studyAbroadTitle !== null && studyAbroadTitle !== "") {
        studyAbroad = {
            "title": studyAbroadTitle.value,
            "organization": studyAbroadOrganization.value,
            "location": studyAbroadLocation.value,
            "term": studyAbroadTime.value,
            "year": studyAbroadYear.value
        }
    }

    if (degreeTitle.value == "High School Diploma") {
        tempDegree = degreeTitle.value;
    }

    if (schoolGrad.value !== null) {
        schoolEnd.value = schoolGrad.value;
    }

    await EducationServices.addEducation(tempTitle, tempDegree, account.value.id,
        schoolStart.value, schoolEnd.value, schoolGrad.value, gpa.value, schoolName.value,
        schoolCity.value, schoolState.value, courses.value, minors.value, maxGpa.value, awards.value, studyAbroad)
        .then(() => {
            makeSnackbar("green", "Education Added!");
            closeEducation();
            getEducationInfo();
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

async function setNewEduVisible() {
    isNewEduVisible.value = true;
}

async function closeEducation() {
    isNewEduVisible.value = false;
    isCourses.value = false;
    isMinors.value = false;
    schoolStart.value = null;
    schoolEnd.value = null;
    schoolGrad.value = null;
    gpa.value = null;
    schoolName.value = null;
    schoolCity.value = null;
    schoolState.value = null;
    courses.value = null;
    minors.value = null;
    maxGpa.value = null;
    degree.value = null;
    degreeTitle.value = "";
    degreeType.value = null;
    awards.value = null;
    studyAbroadTitle.value = null;
    studyAbroadOrganization.value = null;
    studyAbroadLocation.value = null;
    studyAbroadTime.value = null;
    studyAbroadYear.value = null;
}

async function getExperiences() {
    await ExperienceServices.getExperiencesForUser(account.value.id)
        .then((response) => {
            experiences.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

async function addNewExperience(type) {
    if (isCurrent.value == true) {
        jobEnd.value = null;
    }
    await ExperienceServices.addExperience(jobExperienceTitle.value, jobDescription.value, jobStart.value, jobEnd.value,
        isCurrent.value, account.value.id, type, jobCity.value, jobState.value, jobCompany.value, experienceChatHistory)
        .then(() => {
            makeSnackbar("green", "Experience Added!");
            getExperiences();
            clearExperienceData();
            closeNewJobExperience();
            closeNewLeadershipExperience();
            closeNewActivitiesExperience();
            closeNewVolunteerExperience();
            closeNewHonor();
            closeNewAward();
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

async function clearExperienceData() {
    jobExperienceTitle.value = null;
    jobCompany.value = null;
    jobCity.value = null;
    jobState.value = null;
    jobStart.value = null;
    jobEnd.value = null;
    jobDescription.value = null;
    experienceChatHistory = [];
    isCurrent.value = false;
}

async function closeNewJobExperience() {
    isJobExperience.value = false;
}

async function closeNewLeadershipExperience() {
    isLeadershipExperience.value = false;
}

async function closeNewActivitiesExperience() {
    isActivitiesExperience.value = false;
}

async function closeNewVolunteerExperience() {
    isVolunteerExperience.value = false;
}

async function closeNewHonor() {
    isHonorExperience.value = false;
}

async function closeNewAward() {
    isAwardExperience.value = false;
}

async function closeNewProject() {
    isProjectExperience.value = false;
}

async function setNewskillVisible() {
    isNewSkillVisible.value = true;
}

async function closeNewSkill() {
    isNewSkillVisible.value = false;
    skillTitle.value = "";
    skillDescription.value = "";
    skillHistory = []
}

async function getSkills() {
    resetNewInput()
    await SkillServices.getSkillsForUser(parseInt(account.value.id))
        .then((response) => {
            skills.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

async function addNewSkill() {
    await SkillServices.addSkill(skillTitle.value, skillDescription.value, skillHistory, parseInt(account.value.id))
        .then(() => {
            makeSnackbar("green", "Skill Added!");
            closeNewSkill();
            getSkills();
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
}

function filterPerfectMatch(value, search) {
    return value != null && String(value) === search
}

async function skillAiAssist(edit) {
    isRequestingAiAssist.value = true;
    if (edit){
        await SkillServices.skillAiAssist(editedItem.value.description, editedItem.value.chatHistory)
        .then((response) => {
            editedItem.value.description = response.data.description
            editedItem.value.chatHistory = response.data.chatHistory
            skillHistory = response.data.chatHistory
            isRequestingAiAssist.value = false;
        })
    }
    else {
        await SkillServices.skillAiAssist(skillDescription.value)
        .then((response) => {
            skillDescription.value = response.data.description
            skillHistory.push(response.data.chatHistory[0])
            skillHistory.push(response.data.chatHistory[1])
            isRequestingAiAssist.value = false;
        })
    }
}

function clearGoalAiAssist() {
    aiGoalExperiences.value = null;
    aiGoalAchievements.value = null;
    aiGoalTitle.value = null;
}

async function aiGoalAssist() {
    isRequestingAiAssist.value = true;
    goalDescription.value = "Generating Description, please wait"
    await GoalServices.goalAiAssist(aiGoalTitle.value, aiGoalExperiences.value.split(","), aiGoalAchievements.value.split(","))
        .then((response) => {
            goalDescription.value = response.data.description
            goalChatHistory.push(response.data.chatHistory[0])
            goalChatHistory.push(response.data.chatHistory[1])
            isRequestingAiAssist.value = false;
        })

}

async function experienceAIAssist(edit) {
    isRequestingAiAssist.value = true;    
    if (edit){

        await ExperienceServices.experienceAiAssist(editedItem.value.description, editedItem.value.chatHistory)
        .then((response) => {
                editedItem.value.description = response.data.description
                editedItem.value.chatHistory = response.data.chatHistory
                experienceChatHistory = response.data.chatHistory; 
                isRequestingAiAssist.value = false;
            })
    } else
        await ExperienceServices.experienceAiAssist(jobDescription.value)
            .then((response) => {
                jobDescription.value = response.data.description
                experienceChatHistory.push(response.data.chatHistory[0])
                experienceChatHistory.push(response.data.chatHistory[1])  
                isRequestingAiAssist.value = false;    
        })
}

// links dialog stuff
const editLinksDialog = ref(false);
const editedItem = ref(null);

function openEditLinksDialog(item) {
    editedItem.value = { ...item };
    editLinksDialog.value = true;
}

function closeEditLinksDialog() {
    editLinksDialog.value = false;
}

async function saveEditLinks() {
    await LinkServices.updateLink(editedItem.value.id, editedItem.value.type, editedItem.value.url, account.value.id)
        .then(() => {
            makeSnackbar("green", "Link Updated!");
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
    getLinks();
    closeEditLinksDialog();
}

// professional summary dialog stuff
const editProfSumDialog = ref(false);

function openEditProfSumDialog(item) {
    editedItem.value = { ...item };
    editProfSumDialog.value = true;
}

function closeEditProfSumDialog() {
    editProfSumDialog.value = false;
}

async function saveEditProfSum() {
    console.log(editedItem.value)
    await GoalServices.updateGoal(editedItem.value.id, editedItem.value.title, editedItem.value.description, account.value.id)
        .then(() => {
            makeSnackbar("green", "Professional Summary Updated!");
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
    getGoals();
    closeEditProfSumDialog();
}

// education dialog stuff
const editEducationDialog = ref(false);

function openEditEducationDialog(item) {
    editedItem.value = { ...item };
    editEducationDialog.value = true;
}

function closeEditEducationDialog() {
    editEducationDialog.value = false;
    editedStudyAbroadTitle.value = null;
    editedStudyAbroadOrganization.value = null;
    editedStudyAbroadLocation.value = null;
    editedStudyAbroadTime.value = null;
    editedStudyAbroadYear.value = null;
}

async function saveEditEducation() {
    var studyAbroad = null;
    if (editedItem.value.studyAbroad == null && editedStudyAbroadTitle.value !== "" && editedStudyAbroadTitle.value !== null) {
        studyAbroad = {
            "title": editedStudyAbroadTitle.value,
            "organization": editedStudyAbroadOrganization.value,
            "location": editedStudyAbroadLocation.value,
            "term": editedStudyAbroadTime.value,
            "year": editedStudyAbroadYear.value
        }
    }
    else {
        studyAbroad = {
            "title": editedItem.value.studyAbroad.title,
            "organization": editedItem.value.studyAbroad.organization,
            "location": editedItem.value.studyAbroad.location,
            "term": editedItem.value.studyAbroad.term,
            "year": editedItem.value.studyAbroad.year
        }
    }
    if (editedItem.value.minor == '') {
        editedItem.value.minor = null;
    }
    if (editedItem.value.courses == '') {
        editedItem.value.courses = null;
    }
    if (editedItem.value.awards == '') {
        editedItem.value.awards = null;
    }

    if (editedItem.value.gradDate !== null) {
        editedItem.value.endDate = editedItem.value.gradDate;
    }
    await EducationServices.updateEducation(editedItem.value.title, editedItem.value.description, editedItem.value.startDate, editedItem.value.endDate,
        editedItem.value.gradDate, editedItem.value.gpa, editedItem.value.organization, editedItem.value.city, editedItem.value.state,
        editedItem.value.courses, editedItem.value.minor, editedItem.value.totalGPA, editedItem.value.awards, studyAbroad, account.value.id, editedItem.value.id
    )
        .then(() => {
            makeSnackbar("green", "Education Updated!");
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
    getEducationInfo();
    closeEditEducationDialog();
}

// all types of experience dialog stuff
const editExperienceDialog = ref(false);

function openEditExperienceDialog(item) {
    editedItem.value = { ...item };
    editExperienceDialog.value = true;
}

function closeEditExperienceDialog() {
    experienceChatHistory = [];
    editExperienceDialog.value = false;
}

async function saveEditExperience() {
    if (editedItem.value.current == true) {
        editedItem.value.endDate = null;
    }
    await ExperienceServices.updateExperience(editedItem.value.title, editedItem.value.description, editedItem.value.startDate, editedItem.value.endDate,
        editedItem.value.current, editedItem.value.city, editedItem.value.state, editedItem.value.organization, editedItem.value.chatHistory,
        account.value.id, editedItem.value.id
    )
        .then(() => {
            makeSnackbar("green", "Experience Updated!");
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar(true, "error", error.response.data.message);
        });
    getExperiences();
    closeEditExperienceDialog();
}

// skills dialog stuff
const editSkillsDialog = ref(false);

function openEditSkillsDialog(item) {
    editedItem.value = { ...item };
    editSkillsDialog.value = true;
}

function closeEditSkillsDialog() {
    skillHistory = []
    editSkillsDialog.value = false;
}

async function saveEditSkills() {
    await SkillServices.updateSkill(editedItem.value.id, editedItem.value.title, editedItem.value.description, editedItem.value.chatHistory, account.value.id)
        .then(() => {
            makeSnackbar("green", "Skill Updated!");
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });
    getSkills();
    closeEditSkillsDialog();
}

// delete dialog stuff
const isDeleted = ref(null);

function openDelete(item) {
    deleteItemId = item.id
    isDeleted.value = true;
}

function closeDelete() {
    isDeleted.value = false;
}

async function deleteItem() {
    switch (parseInt(tab.value)) {
        case 1:
            await deleting(LinkServices.deleteLink);
            getLinks();
            break;
        case 2:
            await deleting(GoalServices.deleteGoal);
            getGoals();
            break;
        case 3:
            await deleting(EducationServices.deleteEducation);
            getEducationInfo();
            break;
        case 4: case 5: case 6: case 7: case 9: case 10: case 11:
            await deleting(ExperienceServices.deleteExperience);
            getExperiences();
            break;
        case 8:
            await deleting(SkillServices.deleteSkill);
            getSkills();
            break;
    }

    closeDelete();
}

async function deleting(deleteItem) {
    await deleteItem(deleteItemId, account.value.id)
        .then(() => {
            makeSnackbar("green", "Item Deleted!");
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message);
        });

}

</script>

<script>
export default {
    data: () => ({
    }),
}
</script>

<template>

    <v-container>
        <v-row>
            <v-col style="width: 50%;">

                <v-card>
                    <v-sheet elevation="3" rounded="lg" align="center">
                        <v-tabs v-model="tab" :items="tabs" align-tabs="center" height="60" slider-color="#f78166">
                            <v-tab value="1" @click="getPersonalInfo()">Links</v-tab>
                            <v-tab value="2" @click="getGoals()">Professional Summary</v-tab>
                            <v-tab value="3" @click="getEducationInfo()">Education</v-tab>
                            <v-tab value="4" @click="getExperiences()">Work Experience</v-tab>
                            <v-tab value="5" @click="getExperiences()">Leadership Experience</v-tab>
                            <v-tab value="6" @click="getExperiences()">Activities</v-tab>
                            <v-tab value="7" @click="getExperiences()">Volunteer Work</v-tab>
                            <v-tab value="8" @click="getSkills()">Skills</v-tab>
                            <v-tab value="9" @click="getExperiences()">Honors</v-tab>
                            <v-tab value="10" @click="getExperiences()">Awards</v-tab>
                            <v-tab value="11" @click="getExperiences()">Projects</v-tab>
                        </v-tabs>

                        <v-tabs-window v-model="tab">

                            <!-- Links -->
                            <v-tabs-window-item value="1" style="padding: 50px">

                                <v-data-table v-model="selectedLinks" :items="links" item-value="id"
                                    :headers="[{ title: 'Description', value: 'type' },
                                    { title: 'URL', value: 'url' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]" hide-default-footer>
                                    <template v-slot:item.edit="{ item }">
                                        <v-btn variant="text" @click="openEditLinksDialog(item)" icon>
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </template>
                                    <template v-slot:item.delete="{ item }">
                                        <v-btn variant="text" @click="openDelete(item)" icon>
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-data-table>

                                <v-btn variant="text" @click="setNewLinkVisible()">
                                    + Add New link
                                </v-btn>

                                <v-container v-if="isNewLinkVisible">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="linkDescription" label="Description"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="link" label="Link"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-col>

                                    </v-col>
                                    <v-btn variant="tonal" @click="closeNewLink()">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn variant="tonal" :disabled="!isLinked" @click="addNewLink()">
                                        Submit
                                    </v-btn>
                                </v-container>


                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(1)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Professional Summary -->
                            <v-tabs-window-item value="2" style="padding: 50px">

                                <div align="left">
                                    <v-text class="headline mb-2">Select Summary: </v-text>
                                    <v-data-table v-model="selectedGoals" :items="goals" item-value="id"
                                        :headers="[{ title: 'Title', value: 'title' },
                                        { title: 'Summary', value: 'description' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]" hide-default-footer
                                        select-strategy="single">
                                        <template v-slot:item.edit="{ item }">
                                            <v-btn variant="text" @click="openEditProfSumDialog(item)" icon>
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                        </template>
                                        <template v-slot:item.delete="{ item }">
                                            <v-btn variant="text" @click="openDelete(item)" icon>
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-data-table>

                                    <div class="mb-10">
                                        <v-spacer></v-spacer>
                                    </div>

                                    <div align="center">
                                        <v-btn variant="text" @click="setNewGoalVisible()">
                                            + Add New Summary
                                        </v-btn>
                                    </div>
                                    <v-container v-if="isNewGoalVisible">
                                        <v-row>
                                            <v-skeleton-loader v-if="isRequestingAiAssist" type="paragraph"></v-skeleton-loader>
                                            <v-col>
                                                <v-text-field v-if="!isRequestingAiAssist" v-model="goalTitle" label="Title"></v-text-field>
                                            </v-col>
                                        </v-row>
                                        <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
                                        <v-row>
                                            <v-textarea v-if="!isRequestingAiAssist" v-model="goalDescription"
                                                label="A brief overview of your skills and experiences">
                                                <template #append-inner>
                                                    <div class="text-center pa-4">
                                                        <v-dialog v-model="dialog" persistent>
                                                            <template v-slot:activator="{ props: activatorProps }">
                                                                <v-btn color="secondary" rounded="xl" value="Ai Assist"
                                                                    v-bind="activatorProps">
                                                                    AI Assist
                                                                </v-btn>
                                                            </template>

                                                            <v-card
                                                                text="Please list your Experiences and Achievements that you want to include in the summary, separated by commas(,) ."
                                                                title="Goal Ai Assist">
                                                                <template v-slot:actions>
                                                                    <v-spacer></v-spacer>
                                                                    <v-container>

                                                                        <v-row>
                                                                            <v-text-field label="Experiences"
                                                                                v-model="aiGoalExperiences"
                                                                                variant="outlined" style="width: 30%;">
                                                                            </v-text-field>
                                                                        </v-row>
                                                                        <v-row>
                                                                            <v-text-field label="Achievements"
                                                                                v-model="aiGoalAchievements"
                                                                                variant="outlined" style="width: 30%;">
                                                                            </v-text-field>
                                                                        </v-row>
                                                                        <v-row>
                                                                            <v-text-field label="Professional title"
                                                                                v-model="aiGoalTitle" variant="outlined"
                                                                                style="width: 30%;">

                                                                            </v-text-field>
                                                                        </v-row>
                                                                        <div align="center">
                                                                            <v-row style="width:50%">
                                                                                <v-col>
                                                                                    <v-btn 
                                                                                        @click="clearGoalAiAssist(), dialog = false">
                                                                                        Cancel </v-btn>
                                                                                </v-col>
                                                                                <v-col>
                                                                                    <v-btn 
                                                                                        @click="aiGoalAssist(), clearGoalAiAssist(), dialog = false">
                                                                                        Confirm </v-btn>
                                                                                </v-col>

                                                                            </v-row>
                                                                        </div>

                                                                    </v-container>
                                                                </template>
                                                            </v-card>
                                                        </v-dialog>
                                                    </div>

                                                </template>
                                            </v-textarea>
                                        </v-row>
                                        <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="closeNewGoal()">
                                            Cancel
                                        </v-btn>
                                        &nbsp;&nbsp;&nbsp;
                                        <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isGoals" @click="addNewGoal()">
                                            Submit
                                        </v-btn>
                                    </v-container>

                                    <div align="right">

                                        <v-btn variant="tonal" @click="navigateNextTab(2)">
                                            Next
                                        </v-btn>
                                    </div>
                                </div>

                            </v-tabs-window-item>
                            <!-- Education -->
                            <v-tabs-window-item value="3" style="padding: 50px">

                                <div align="left">
                                    <v-text class="headline mb-2">Select Education: </v-text>

                                    <v-container>
                                        <v-data-table v-model="selectedEducation" :items="educationInfo" item-value="id"
                                            :headers="[{ title: 'Organization', value: 'organization' }, { title: 'Degree', value: 'description' },
                                            { title: 'Start Date', value: 'startDate' }, { title: 'End Date', value: 'endDate' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]"
                                            hide-default-footer>
                                            <template v-slot:item.edit="{ item }">
                                                <v-btn variant="text" @click="openEditEducationDialog(item)" icon>
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:item.delete="{ item }">
                                                <v-btn variant="text" @click="openDelete(item)" icon>
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </v-container>

                                </div>


                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <v-btn variant="tonal" @click="setNewEduVisible">
                                    Add New Education
                                </v-btn>


                                <v-container v-if="isNewEduVisible">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="schoolName" label="School Name"></v-text-field>
                                        </v-col>

                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="schoolCity" label="City"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="schoolState" label="State"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="gpa" label="GPA"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="maxGpa" label="Max GPA"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-1" v-if="degreeTitle != ''">

                                        <v-card-subtitle align="center"
                                            v-if="degreeTitle != 'High School Diploma'">Displayed as: {{ degreeTitle }}
                                            of {{ degreeType }} in {{ degree }}</v-card-subtitle>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-combobox v-model="degreeTitle" label="Title of Degree"
                                                :items="['Bachelor', 'Masters', 'Associates', 'PhD', 'Certificate', 'High School Diploma']"></v-combobox>
                                        </v-col>
                                        <v-col>
                                            <v-combobox v-model="degreeType" label="Degree Type"
                                                :items="['Science', 'Arts', 'Fine Arts', 'Architecture']"
                                                :disabled="degreeTitle == 'High School Diploma'"></v-combobox>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="degree" label="Degree"
                                                :disabled="degreeTitle == 'High School Diploma'"></v-text-field>
                                        </v-col>
                                    </v-row>


                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="schoolStart" label="Start Date"
                                                hint="Ex: Aug 2024"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="schoolEnd" v-if="!isAttending" label="End Date"
                                                hint="Ex: Aug 2024"></v-text-field>
                                            <v-text-field v-model="schoolGrad" v-if="isAttending" label="Grad Date"
                                                hint="Ex: Aug 2024"></v-text-field>
                                            <v-switch v-model="attending" label="Still Attending" color="primary"
                                                @click="toggleIsAttending()"></v-switch>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-container align="center">
                                            <v-btn variant="text" @click="showMinors">
                                                Add Minor
                                            </v-btn>
                                            <div class="mb-6">
                                                <v-spacer></v-spacer>
                                            </div>

                                            <div v-if="isMinors">


                                                <v-text-field label=" Minor(s)" v-model="minors"
                                                    hint="If multiple, format as: Minor #1, Minor #2">

                                                </v-text-field>

                                            </div>

                                            <v-btn variant="text" @click="showCourses">
                                                Add Courses
                                            </v-btn>

                                            <div class="mb-6">
                                                <v-spacer></v-spacer>
                                            </div>
                                            <div v-if="isCourses">


                                                <v-text-field label="Course(s)" v-model="courses"
                                                    hint="If multiple, format as: Course name, Course name">

                                                </v-text-field>

                                            </div>
                                            <v-btn variant="text" @click="showAwards">
                                                Add Awards
                                            </v-btn>

                                            <div class="mb-6">
                                                <v-spacer></v-spacer>
                                            </div>
                                            <div v-if="isAwards">


                                                <v-text-field label="Award(s)" v-model="awards"
                                                    hint="If multiple, format as: Award, Award">

                                                </v-text-field>

                                            </div>

                                            <v-btn variant="text" @click="showStudyAbroad">
                                                Add Study Abroad
                                            </v-btn>

                                            <div class="mb-6">
                                                <v-spacer></v-spacer>
                                            </div>
                                            <div v-if="isStudyAbroad">
                                                <v-row>
                                                    <v-text-field label="Title" v-model="studyAbroadTitle"
                                                        hint="Name of Study Abroad Program">
                                                    </v-text-field>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="studyAbroadOrganization"
                                                            label="Organization"
                                                            hint="Ex) Capital Normal"></v-text-field>
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field v-model="studyAbroadLocation" label="Location"
                                                            hint="Ex) Beijing, China"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="studyAbroadTime" label="Term"
                                                            hint="Ex) Fall Semester"></v-text-field>
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field v-model="studyAbroadYear" label="Year"
                                                            hint="Ex) 2018"></v-text-field>
                                                    </v-col>
                                                </v-row>



                                            </div>

                                        </v-container>




                                    </v-row>

                                    <v-col>

                                    </v-col>
                                    <v-btn variant="tonal" @click="closeEducation()">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn variant="tonal" :disabled="!isEducationFilled" @click="addNewEducation()">
                                        Submit
                                    </v-btn>
                                </v-container>



                                <div align="right">

                                    <div class="mb-10">
                                        <v-spacer></v-spacer>
                                    </div>
                                    <v-btn variant="tonal" @click="navigateNextTab(3)">
                                        Next
                                    </v-btn>
                                </div>


                            </v-tabs-window-item>


                            <!-- Work Experience -->
                            <v-tabs-window-item value="4" style="padding: 50px">
                                <div align="left">
                                    <v-text class="headline mb-2">Select Work Experiences: </v-text>
                                    <v-container>
                                        <v-data-table v-model="selectedWorkExperience" :items="experiences"
                                            item-value="id" :search="'1'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]"
                                            hide-default-footer>
                                            <template v-slot:item.edit="{ item }">
                                                <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:item.delete="{ item }">
                                                <v-btn variant="text" @click="openDelete(item)" icon>
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </v-container>

                                </div>


                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <v-btn variant="tonal" @click="toggleExperience(1)">
                                    Add New Job Experience
                                </v-btn>

                                <v-container v-if="isJobExperience">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobExperienceTitle"
                                                label="Position Title"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobCompany" label="Company Name"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobCity" label="City"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobState" label="State"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobStart" label="Start Date"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field :disabled="isCurrent" v-model="jobEnd"
                                                label="End Date"></v-text-field>
                                            <v-switch v-model="isCurrent" label="Present Job"
                                                color="primary"></v-switch>
                                        </v-col>
                                    </v-row>
                                    <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
                                    <v-row>
                                        <v-textarea v-if="!isRequestingAiAssist" v-model="jobDescription" label="Work Summary">
                                            <template #append-inner>
                                                <v-btn color="secondary" rounded="xl" value="Ai Assist"
                                                    @click="experienceAIAssist()">
                                                    AI Assist
                                                </v-btn>
                                            </template>
                                        </v-textarea>
                                    </v-row>

                                    <v-col>

                                    </v-col>
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="toggleExperience(1)">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isExperienced" @click="addNewExperience(1)">
                                        Submit
                                    </v-btn>
                                </v-container>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>





                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(4)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Leadership Experience -->
                            <v-tabs-window-item value="5" style="padding: 50px">


                                <div align="left">
                                    <v-text class="headline mb-2">Select Leadership Experience: </v-text>

                                    <v-container>
                                        <v-data-table v-model="selectedLeadershipExperience" :items="experiences"
                                            item-value="id" :search="'2'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]"
                                            hide-default-footer>
                                            <template v-slot:item.edit="{ item }">
                                                <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:item.delete="{ item }">
                                                <v-btn variant="text" @click="openDelete(item)" icon>
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </v-container>

                                </div>


                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <v-btn variant="tonal" @click="toggleExperience(2)">
                                    Add New Leadership Experience
                                </v-btn>

                                <v-container v-if="isLeadershipExperience">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobExperienceTitle" label="Position"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobCompany" label="Organization Name"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobCity" label="City"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobState" label="State"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobStart" label="Start Date"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field :disabled="isCurrent" v-model="jobEnd"
                                                label="End Date"></v-text-field>
                                            <v-switch v-model="isCurrent" label="Present Role"
                                                color="primary"></v-switch>
                                        </v-col>
                                    </v-row>
                                    <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
                                    <v-row>
                                        <v-textarea v-if="!isRequestingAiAssist" v-model="jobDescription" label="Role Summary">
                                            <template #append-inner>
                                                <v-btn color="secondary" rounded="xl" value="Ai Assist"
                                                    @click="experienceAIAssist()">
                                                    AI Assist
                                                </v-btn>
                                            </template>
                                        </v-textarea>
                                    </v-row>

                                    <v-col>

                                    </v-col>
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="toggleExperience(2)">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isExperienced" @click="addNewExperience(2)">
                                        Submit
                                    </v-btn>
                                </v-container>



                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(5)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Activities -->
                            <v-tabs-window-item value="6" style="padding: 50px">


                                <div align="left">
                                    <v-text class="headline mb-2">Select Activities: </v-text>

                                    <v-container>
                                        <v-data-table v-model="selectedActivitiesExperience" :items="experiences"
                                            item-value="id" :search="'3'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]"
                                            hide-default-footer>
                                            <template v-slot:item.edit="{ item }">
                                                <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:item.delete="{ item }">
                                                <v-btn variant="text" @click="openDelete(item)" icon>
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </v-container>

                                </div>


                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <v-btn variant="tonal" @click="toggleExperience(3)">
                                    Add New Activities
                                </v-btn>

                                <v-container v-if="isActivitiesExperience">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobExperienceTitle" label="Position"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobCompany" label="Organization Name"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobCity" label="City"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobState" label="State"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobStart" label="Start Date"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field :disabled="isCurrent" v-model="jobEnd"
                                                label="End Date"></v-text-field>
                                            <v-switch v-model="isCurrent" label="Present Role"
                                                color="primary"></v-switch>
                                        </v-col>
                                    </v-row>
                                    <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
                                    <v-row>
                                        <v-textarea v-if="!isRequestingAiAssist" v-model="jobDescription" label="Role Summary">
                                            <template #append-inner>
                                                <v-btn color="secondary" rounded="xl" value="Ai Assist"
                                                    @click="experienceAIAssist()">
                                                    AI Assist
                                                </v-btn>
                                            </template>
                                        </v-textarea>
                                    </v-row>

                                    <v-col>

                                    </v-col>
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="toggleExperience(3)">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isExperienced" @click="addNewExperience(3)">
                                        Submit
                                    </v-btn>
                                </v-container>

                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(6)">
                                        Next
                                    </v-btn>
                                </div>

                            </v-tabs-window-item>

                            <!-- Volunteer Work -->
                            <v-tabs-window-item value="7" style="padding: 50px">


                                <div align="left">
                                    <v-text class="headline mb-2">Select Volunteer Work: </v-text>

                                    <v-container>
                                        <v-data-table v-model="selectedVolunteerExperience" :items="experiences"
                                            item-value="id" :search="'4'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]"
                                            hide-default-footer>
                                            <template v-slot:item.edit="{ item }">
                                                <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:item.delete="{ item }">
                                                <v-btn variant="text" @click="openDelete(item)" icon>
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </v-container>

                                </div>


                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <v-btn variant="tonal" @click="toggleExperience(4)">
                                    Add New Volunteer
                                </v-btn>

                                <v-container v-if="isVolunteerExperience">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobExperienceTitle" label="Position"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobCompany" label="Organization Name"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobCity" label="City"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobState" label="State"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobStart" label="Start Date"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field :disabled="isCurrent" v-model="jobEnd"
                                                label="End Date"></v-text-field>
                                            <v-switch v-model="isCurrent" label="Present Role"
                                                color="primary"></v-switch>
                                        </v-col>
                                    </v-row>
                                    <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
                                    <v-row>
                                        <v-textarea v-if="!isRequestingAiAssist" v-model="jobDescription" label="Role Summary">
                                            <template #append-inner>
                                                <v-btn color="secondary" rounded="xl" value="Ai Assist"
                                                    @click="experienceAIAssist()">
                                                    AI Assist
                                                </v-btn>
                                            </template>
                                        </v-textarea>
                                    </v-row>

                                    <v-col>

                                    </v-col>
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="toggleExperience(4)">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isExperienced" @click="addNewExperience(4)">
                                        Submit
                                    </v-btn>
                                </v-container>


                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(7)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Skills -->
                            <v-tabs-window-item value="8" style="padding: 50px">

                                <div align="left">
                                    <v-text class="headline mb-2">Select Skill(s): </v-text>
                                    <v-container>
                                        <v-data-table v-model="selectedSkills" :items="skills" item-value="id"
                                            :headers="[{ title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]"
                                            hide-default-footer>
                                            <template v-slot:item.edit="{ item }">
                                                <v-btn variant="text" @click="openEditSkillsDialog(item)" icon>
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:item.delete="{ item }">
                                                <v-btn variant="text" @click="openDelete(item)" icon>
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </v-container>
                                </div>


                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <v-btn variant="text" @click="setNewskillVisible()">
                                    + Add New Skill
                                </v-btn>

                                <v-container v-if="isNewSkillVisible">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="skillTitle" label="Skill"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
                                    <v-row>
                                        <v-col>
                                            <v-textarea v-if="!isRequestingAiAssist" v-model="skillDescription"
                                                label="Brief Description/Proficientcy Level, click AI assist button along with your input to help create a better description">
                                                <template #append-inner>
                                                    <v-btn color="secondary" rounded="xl" value="Ai Assist"
                                                        @click="skillAiAssist()">
                                                        AI Assist
                                                    </v-btn>
                                                </template>
                                            </v-textarea>
                                        </v-col>
                                    </v-row>
                                    <v-col>

                                    </v-col>
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="closeNewSkill()">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isSkilled" @click="addNewSkill()">
                                        Submit
                                    </v-btn>
                                </v-container>

                                <v-dialog v-model="editSkillsDialog" persistent>
                                    <v-card>
                                        <v-card-title>
                                            <span class="headline">Edit Item</span>
                                        </v-card-title>
                                        <v-card-text>


                                            <v-container>
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="editedItem.title"
                                                            label="Skill"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
                                                <v-row>
                                                    <v-col>
                                                        <v-textarea v-if="!isRequestingAiAssist" v-model="editedItem.description"
                                                            label="Brief Description/Proficientcy Level, click AI assist button along with your input to help create a better description">
                                                            <template #append-inner>
                                                                <v-btn color="secondary" rounded="xl" value="Ai Assist"
                                                                    @click="skillAiAssist(true)">
                                                                    AI Assist
                                                                </v-btn>
                                                            </template>
                                                        </v-textarea>
                                                    </v-col>
                                                </v-row>

                                            </v-container>
                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn v-if="!isRequestingAiAssist" color="blue darken-1" text
                                                @click="closeEditSkillsDialog">Cancel</v-btn>
                                            <v-btn v-if="!isRequestingAiAssist" color="blue darken-1" text @click="saveEditSkills">Save</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(8)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Honors -->
                            <v-tabs-window-item value="9" style="padding: 50px">
                                <div align="left">
                                    <v-text class="headline mb-2">Select Honors: </v-text>
                                    <v-container>
                                        <v-data-table v-model="selectedHonorExperience" :items="experiences"
                                            item-value="id" :search="'5'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'experienceTypeId', text: 'experienceTypeId', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]"
                                            hide-default-footer>
                                            <template v-slot:item.edit="{ item }">
                                                <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:item.delete="{ item }">
                                                <v-btn variant="text" @click="openDelete(item)" icon>
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>

                                        </v-data-table>
                                    </v-container>

                                </div>


                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <v-btn variant="tonal" @click="toggleExperience(5)">
                                    Add New Honor
                                </v-btn>

                                <v-container v-if="isHonorExperience">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobExperienceTitle"
                                                label="Honor Title"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobStart" label="Date Awarded"
                                                hint="Aug 2024"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-text-field v-model="jobDescription" label="Honor Description"></v-text-field>
                                    </v-row>

                                    <v-col>

                                    </v-col>
                                    <v-btn variant="tonal" @click="toggleExperience(5)">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn variant="tonal" :disabled="!isOthered" @click="addNewExperience(5)">
                                        Submit
                                    </v-btn>

                                </v-container>

                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(9)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>
                            <!-- Awards -->
                            <v-tabs-window-item value="10" style="padding: 50px">
                                <div align="left">
                                    <v-text class="headline mb-2">Select Awards: </v-text>
                                    <v-container>
                                        <v-data-table v-model="selectedAwardExperience" :items="experiences"
                                            item-value="id" :search="'6'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]"
                                            hide-default-footer>
                                            <template v-slot:item.edit="{ item }">
                                                <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:item.delete="{ item }">
                                                <v-btn variant="text" @click="openDelete(item)" icon>
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </v-container>

                                </div>


                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <v-btn variant="tonal" @click="toggleExperience(6)">
                                    Add New Award
                                </v-btn>

                                <v-container v-if="isAwardExperience">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobExperienceTitle"
                                                label="Award Title"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobStart" label="Date Awarded"
                                                hint="Aug 2024"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-text-field v-model="jobDescription" label="Award Description"></v-text-field>
                                    </v-row>

                                    <v-col>

                                    </v-col>
                                    <v-btn variant="tonal" @click="toggleExperience(6)">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn variant="tonal" :disabled="!isOthered" @click="addNewExperience(6)">
                                        Submit
                                    </v-btn>

                                </v-container>


                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(10)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Project -->
                            <v-tabs-window-item value="11" style="padding: 50px">
                                <div align="left">
                                    <v-text class="headline mb-2">Select Projects: </v-text>
                                    <v-container>
                                        <v-data-table v-model="selectedProjectExperience" :items="experiences"
                                            item-value="id" :search="'7'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit' }, { title: 'Delete', value: 'delete' }]"
                                            hide-default-footer>
                                            <template v-slot:item.edit="{ item }">
                                                <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                                                    <v-icon>mdi-pencil</v-icon>
                                                </v-btn>
                                            </template>
                                            <template v-slot:item.delete="{ item }">
                                                <v-btn variant="text" @click="openDelete(item)" icon>
                                                    <v-icon>mdi-delete</v-icon>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </v-container>

                                </div>


                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <v-btn variant="tonal" @click="toggleExperience(7)">
                                    Add New Project
                                </v-btn>

                                <v-container v-if="isProjectExperience">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobExperienceTitle" label="Position"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobCompany" label="Organization Name"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobCity" label="City"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="jobState" label="State"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="jobStart" label="Start Date"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field :disabled="isCurrent" v-model="jobEnd"
                                                label="End Date"></v-text-field>
                                            <v-switch v-model="isCurrent" label="Present Role"
                                                color="primary"></v-switch>
                                        </v-col>
                                    </v-row>
                                    <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
                                    <v-row>
                                        <v-textarea v-if="!isRequestingAiAssist" label="Project Summary" v-model="jobDescription">
                                            <template #append-inner>
                                                <v-btn color="secondary" rounded="xl" value="Ai Assist"
                                                    @click="experienceAIAssist()">
                                                    AI Assist
                                                </v-btn>
                                            </template>
                                        </v-textarea>
                                    </v-row>

                                    <v-col>

                                    </v-col>
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="toggleExperience(7)">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isExperienced" @click="addNewExperience(7)">
                                        Submit
                                    </v-btn>
                                </v-container>

                            </v-tabs-window-item>

                            <!-- LINKS DIALOG -->
                            <v-dialog v-model="editLinksDialog" persistent>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Edit Item</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-text-field v-model="editedItem.type" label="Description"></v-text-field>
                                        <v-text-field v-model="editedItem.url" label="URL"></v-text-field>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeEditLinksDialog">Cancel</v-btn>
                                        <v-btn color="blue darken-1" text @click="saveEditLinks">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <!-- PROFESSIONAL SUMMARY DIALOG -->

                            <v-dialog v-model="editProfSumDialog" persistent>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Edit Item</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                                        <v-textarea v-model="editedItem.description" label="Description"></v-textarea>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="closeEditProfSumDialog">Cancel</v-btn>
                                        <v-btn color="blue darken-1" text @click="saveEditProfSum">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <!-- EDUCATION DIALOG -->
                            <v-dialog v-model="editEducationDialog" persistent>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Edit Item</span>
                                    </v-card-title>
                                    <v-card-text>

                                        <v-container>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.organization"
                                                        label="School Name"></v-text-field>
                                                </v-col>

                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.city" label="City"></v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.state"
                                                        label="State"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.gpa" label="GPA"></v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.totalGPA"
                                                        label="Max GPA"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.description"
                                                        label="Title of Degree"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.startDate" label="Start Date"
                                                        hint="Ex: Aug 2024"></v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.endDate" v-if="!isAttending"
                                                        label="End Date" hint="Ex: Aug 2024"></v-text-field>
                                                    <v-text-field v-model="editedItem.gradDate" v-if="isAttending"
                                                        label="Grad Date" hint="Ex: Aug 2024"></v-text-field>
                                                    <v-switch v-model="attending" label="Still Attending"
                                                        color="primary" @click="toggleIsAttending()"></v-switch>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.courses"
                                                        label="Course(s)"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.minor"
                                                        label="Minor(s)"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.awards"
                                                        label="Award(s)"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <div v-if="editedItem.studyAbroad !== null">
                                                <v-row>
                                                    <v-text-field label="Study Abroad Title"
                                                        v-model="editedItem.studyAbroad.title"
                                                        hint="Name of Study Abroad Program">
                                                    </v-text-field>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="editedItem.studyAbroad.organization"
                                                            label="Study Abroad Organization"
                                                            hint="Ex) Capital Normal"></v-text-field>
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field v-model="editedItem.studyAbroad.location"
                                                            label="Study Abroad Location"
                                                            hint="Ex) Beijing, China"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="editedItem.studyAbroad.term"
                                                            label="Study Abroad Term"
                                                            hint="Ex) Fall Semester"></v-text-field>
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field v-model="editedItem.studyAbroad.year"
                                                            label="Study Abroad Year" hint="Ex) 2018"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </div>
                                            <div v-else>
                                                <v-row>
                                                    <v-text-field label="Study Abroad Title"
                                                        v-model="editedStudyAbroadTitle"
                                                        hint="Name of Study Abroad Program">
                                                    </v-text-field>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="editedStudyAbroadOrganization"
                                                            label="Study Abroad Organization"
                                                            hint="Ex) Capital Normal"></v-text-field>
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field v-model="editedStudyAbroadLocation"
                                                            label="Study Abroad Location"
                                                            hint="Ex) Beijing, China"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="editedStudyAbroadTime"
                                                            label="Study Abroad Term"
                                                            hint="Ex) Fall Semester"></v-text-field>
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field v-model="editedStudyAbroadYear"
                                                            label="Study Abroad Year" hint="Ex) 2018"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                            </div>


                                        </v-container>


                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text
                                            @click="closeEditEducationDialog">Cancel</v-btn>
                                        <v-btn color="blue darken-1" text @click="saveEditEducation">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>

                            <!-- EXPERIENCE DIALOG-->
                            <v-dialog v-model="editExperienceDialog" persistent>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Edit Item</span>
                                    </v-card-title>
                                    <v-card-text>


                                        <v-container>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.title"
                                                        label="Position Title"></v-text-field>
                                                </v-col>
                                                <v-col
                                                    v-if="editedItem.experienceTypeId !== 5 && editedItem.experienceTypeId !== 6">
                                                    <v-text-field v-model="editedItem.organization"
                                                        label="Company Name"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row
                                                v-if="editedItem.experienceTypeId !== 5 && editedItem.experienceTypeId !== 6">
                                                <v-col>
                                                    <v-text-field v-model="editedItem.city" label="City"></v-text-field>
                                                </v-col>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.state"
                                                        label="State"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col>
                                                    <v-text-field v-model="editedItem.startDate"
                                                        label="Start Date"></v-text-field>
                                                </v-col>
                                                <v-col
                                                    v-if="editedItem.experienceTypeId !== 5 && editedItem.experienceTypeId !== 6">
                                                    <v-text-field :disabled="editedItem.current"
                                                        v-model="editedItem.endDate" label="End Date"></v-text-field>
                                                    <v-switch v-model="editedItem.current" label="Present Job"
                                                        color="primary"></v-switch>
                                                </v-col>
                                            </v-row>
                                            <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
                                            <v-row>

                                                <v-textarea v-if="!isRequestingAiAssist" v-model="editedItem.description" label="Summary/Description">

                                                    <template #append-inner>
                                                        <div
                                                            v-if="editedItem.experienceTypeId !== 5 && editedItem.experienceTypeId !== 6">
                                                            <v-btn color="secondary" rounded="xl" value="Ai Assist"
                                                                @click="experienceAIAssist(true)">
                                                                AI Assist
                                                            </v-btn>
                                                        </div>
                                                    </template>
                                                </v-textarea>
                                            </v-row>
                                            <v-col>
                                            </v-col>

                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn v-if="!isRequestingAiAssist" color="blue darken-1" text
                                            @click="closeEditExperienceDialog">Cancel</v-btn>
                                        <v-btn v-if="!isRequestingAiAssist" color="blue darken-1" text @click="saveEditExperience">Save</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>


                            <!-- DELETE DIALOG -->
                            <v-dialog persistent v-model="isDeleted" width="800">
                                <v-card class="rounded-lg elevation-5">
                                    <v-card-title class="text-center headline mb-2">Delete Item?</v-card-title>
                                    <v-text align="center">You will be unable to retrieve this item once
                                        deleted!</v-text>

                                    <v-card-actions>
                                        <v-btn variant="flat" color="primary" @click="deleteItem()">Delete</v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn variant="flat" color="secondary" @click="closeDelete()">Close</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>


                        </v-tabs-window>
                    </v-sheet>
                </v-card>

            </v-col>
        </v-row>

        <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
        @update:show="value => snackbarValue = value"></Snackbar>

    </v-container>


</template>