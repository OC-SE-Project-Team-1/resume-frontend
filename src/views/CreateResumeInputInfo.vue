<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import LinkServices from "../services/LinkServices.js";
import GoalServices from "../services/GoalServices.js";
import SkillServices from "../services/SkillServices.js";
import EducationServices from "../services/EducationServices.js";
import ExperienceServices from "../services/ExperienceServices.js";
import ResumeServices from "../services/ResumeServices.js";
import template1 from "/Template1.png";
import template2 from "/Template2.png";
import template3 from "/Template3.png";
import template4 from "/Template4.png";

const account = ref();
const title = ref("");
//Snackbar to display errors
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});
const isNewLinkVisible = ref(false);
const isNewEduVisible = ref(false);
const tabs = ref();
const tab = ref("1");
const resumeTemplate = ref();
const dialog = ref(false);
const checkbox1 = ref(false);


const resumeSections = ref(
    {
        0: ["Personal Details",
            "Professional Summary",
            "Education",
            "Experience",
            "Skills"],
        1: ["Personal Details",
            "Professional Summary",
            "Education",
            "Experience"],
        2: ["Personal Details",
            "Professional Summary",
            "Education",
            "Experience",
            "Skills"],
        3: ["Personal Details",
            "Professional Summary",
            "Education",
            "Experience",
            "Skills",
            "Others"]
    }
);

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

const skillTitle = ref("");
const skillDescription = ref("");
const skills = ref();

let skillHistory = [];
const selectedSkills = ref(null);
const isNewSkillVisible = ref(false);

const isMinors = ref(false);
const isCourses = ref(false);

const isAttending = ref(false);

const templateSelected = ref();
const selectedResumeTemplate = ref();

const isSelectTemplate = ref(true);
const isPreviewResume = ref(false);

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
const isGenerated = computed(() => {
    return (
        isPreviewResume.value === true &&
        title.value !== "" 
    )
})

const isPersonalDetails = ref(false);
const isProfSum = ref(false);
const isEducation = ref(false);
const isExperience = ref(false);
const isSkills = ref(false);
const isOthers = ref(false);


onMounted(() => {
    account.value = JSON.parse(localStorage.getItem("account"));
    console.log(account.value);
    localStorage.removeItem("resumeTemplate");
    // resumeSection.value = JSON.parse(localStorage.getItem("resumeSections"));
    //resumeTemplate.value = JSON.parse(localStorage.getItem("resumeTemplate"));
    getPersonalInfo();
    //console.log(resumeTemplate.value);
});

function closeSnackBar() {
    snackbar.value.value = false;
}

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
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function addNewLink() {
    await LinkServices.addLink(link.value, linkDescription.value, parseInt(account.value.id))
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Link Added!";
            closeNewLink();
            getLinks();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function navigateNextTab(value) {

    resetNewInput();
    //const temp = parseInt(tab.value) + 1;
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

async function selectedTemplate(value) {
    selectedResumeTemplate.value = value;
    window.localStorage.setItem("resumeTemplate", JSON.stringify(value));
    toggleSelectPreview();
    console.log(value);
}

async function toggleSelectPreview() {
    isSelectTemplate.value = !isSelectTemplate.value;
    isPreviewResume.value = !isPreviewResume.value;
}

async function clearTemplateSelecton() {

    localStorage.removeItem("resumeTemplate");
    toggleSelectPreview();
}

function toggleIsAttending() {
    isAttending.value = !isAttending.value;

    if (isAttending.value == false) {
        schoolGrad.value = null;
    }
    // else {
    //     schoolEnd.value = schoolGrad.value;
    // }
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

async function showTab(index) {
    if (index == "Personal Details") {
        isPersonalDetails.value = !isPersonalDetails.value;
        console.log("1");
    }
    else if (index == "Professional Summary") {
        isProfSum.value = !isProfSum.value;
        console.log("2");
    }
    else if (index == "Education") {
        isEducation.value = !isEducation.value;
        console.log("3");
    }
    else if (index == "Experience") {
        isExperience.value = !isExperience.value;
        console.log("4");
    }
    else if (index == "Skills") {
        isSkills.value = !isSkills.value;
        console.log("5");
    }
    else if (index == "Others") {
        isOthers.value = !isOthers.value;
        console.log("6");
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
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
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
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function addNewGoal() {
    console.log(goalTitle.value);
    console.log(goalDescription.value);
    await GoalServices.addGoal(goalTitle.value, goalDescription.value, parseInt(account.value.id), goalChatHistory)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Goal Added!";
            closeNewGoal();
            getGoals();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
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
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function addNewEducation() {
    var tempTitle = schoolState.value + " " + schoolStart.value + " " + gpa.value;
    var tempDegree = degreeTitle.value + " of " + degreeType.value + " in " + degree.value;

    if (degreeTitle.value == "High School Diploma") {
        tempDegree = degreeTitle.value;
    }

    if (schoolGrad.value !== null) {
        schoolEnd.value = schoolGrad.value;
    } 
    // else {
    //     schoolGrad.value = schoolEnd.value;
    // }

    await EducationServices.addEducation(tempTitle, tempDegree, account.value.id,
        schoolStart.value, schoolEnd.value, schoolGrad.value, gpa.value, schoolName.value,
        schoolCity.value, schoolState.value, courses.value, minors.value, maxGpa.value)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Education Added!";
            closeEducation();
            getEducationInfo();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
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
    courses.value = null;
    minors.value = null;
    maxGpa.value = null;
    degree.value = null;
    degreeTitle.value = "";
    degreeType.value = null;
}

async function getExperiences() {
    await ExperienceServices.getExperiencesForUser(account.value.id)
        .then((response) => {
            experiences.value = response.data;
            console.log(experiences.value);
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function addNewExperience(type) {
    await ExperienceServices.addExperience(jobExperienceTitle.value, jobDescription.value, jobStart.value, jobEnd.value,
        account.value.id, type, jobCity.value, jobState.value, jobCompany.value, experienceChatHistory)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Experience Added!";
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
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
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
}

async function getSkills() {
    resetNewInput()
    await SkillServices.getSkillsForUser(parseInt(account.value.id))
        .then((response) => {
            skills.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function addNewSkill() {
    await SkillServices.addSkill(skillTitle.value, skillDescription.value, skillHistory, parseInt(account.value.id))
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Skill Added!";
            closeNewSkill();
            getSkills();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

function filterPerfectMatch(value, search) {
    // console.log("value: " + value + ", search: " + search);
    return value != null && String(value) === search
    }

async function skillAiAssist(){
    await SkillServices.skillAiAssist(skillDescription.value)
        .then((response) => {
        skillDescription.value = response.data.description
        skillHistory.push(response.data.history[0])
        skillHistory.push(response.data.history[1])         
        })
        
}

async function addResume() {
    var linkArr = [];
    var goalArr = [];
    var eduArr = [];
    var expArr = [];
    var skillArr = [];

    if (selectedLinks.value !== null) {
        for (let [key, value] of Object.entries(selectedLinks.value)) {
            // console.log("Link Key: " + key + " Value: " + value);
            linkArr.push(value);
        }
        console.log(linkArr);
    }

    if (selectedGoals.value !== null) {
        for (let [key, value] of Object.entries(selectedGoals.value)) {
            // console.log("Goal Key: " + key + " Value: " + value);
            goalArr.push(value);
        }
        console.log(goalArr);
    }

    if (selectedEducation.value !== null) {
        for (let [key, value] of Object.entries(selectedEducation.value)) {
            // console.log("Education Key: " + key + " Value: " + value);
            eduArr.push(value);
        }
        console.log(eduArr);
    }

    if (selectedWorkExperience.value !== null) {
    for (let [key, value] of Object.entries(selectedWorkExperience.value)) {
        // console.log("Work Exp Key: " + key + " Value: " + value);
        expArr.push(value);
    }}
    if (selectedLeadershipExperience.value !== null) {
    for (let [key, value] of Object.entries(selectedLeadershipExperience.value)) {
        // console.log("Leadership Exp Key: " + key + " Value: " + value);
        expArr.push(value);
    }}
    if (selectedActivitiesExperience.value !== null) {
    for (let [key, value] of Object.entries(selectedActivitiesExperience.value)) {
        // console.log("Activities Exp Key: " + key + " Value: " + value);
        expArr.push(value);
    }}
    if (selectedVolunteerExperience.value !== null) {
    for (let [key, value] of Object.entries(selectedVolunteerExperience.value)) {
        // console.log("Volunteer Exp Key: " + key + " Value: " + value);
        expArr.push(value);
    }}
    if (selectedHonorExperience.value !== null) {
    for (let [key, value] of Object.entries(selectedHonorExperience.value)) {
        // console.log("Honor Exp Key: " + key + " Value: " + value);
        expArr.push(value);
    }}
    if (selectedAwardExperience.value !== null) {
    for (let [key, value] of Object.entries(selectedAwardExperience.value)) {
        // console.log("Award Exp Key: " + key + " Value: " + value);
        expArr.push(value);
    }}
    console.log(expArr);

    if (selectedSkills.value !== null) {
        for (let [key, value] of Object.entries(selectedSkills.value)) {
            // console.log("Skills Key: " + key + " Value: " + value);
            skillArr.push(value);
        }
        console.log(skillArr);
    }
    //TODO: Get isEdit working and Content Working (currently hardcoded)
    await ResumeServices.addResume(title.value, goalArr, expArr, skillArr, 
                eduArr, linkArr, false, selectedResumeTemplate.value, 
                parseInt(account.value.id))
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Resume Created!";
            clearAllSelected();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

function clearAllSelected() {
    selectedLinks.value = null;
    selectedGoals.value = null;
    selectedEducation.value = null;
    selectedWorkExperience.value = null;
    selectedLeadershipExperience.value = null;
    selectedActivitiesExperience.value = null;
    selectedVolunteerExperience.value = null;
    selectedHonorExperience.value = null;
    selectedAwardExperience.value = null;
    selectedSkills.value = null;
    tab.value = "1";
    title.value = "";
    toggleSelectPreview();
}

function clearGoalAiAssist(){
    aiGoalExperiences.value = null;
    aiGoalAchievements.value = null;
    aiGoalTitle.value = null;
}

async function aiGoalAssist(){
    goalDescription.value = "Generating Description, please wait"
    await GoalServices.goalAiAssist(aiGoalTitle.value, aiGoalExperiences.value.split(","), aiGoalAchievements.value.split(",") )
        .then((response) =>{
            goalDescription.value = response.data.description
            goalChatHistory.push(response.data.history[0])
            goalChatHistory.push(response.data.history[1])
        })
        
    }
        
async function experienceAIAssist(){
    await ExperienceServices.experienceAiAssist(jobDescription.value)
        .then((response) => {
        jobDescription.value = response.data.description
        console.log(response.data.history[0])
        experienceChatHistory.push(response.data.history[0])
        experienceChatHistory.push(response.data.history[1])         
    })
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
                            <v-tab value="1" @click="getPersonalInfo()">Personal Details</v-tab>
                            <v-tab value="2" @click="getGoals()">Professional Summary</v-tab>
                            <v-tab value="3" @click="getEducationInfo()">Education</v-tab>
                            <v-tab value="4" @click="getExperiences()">Experience</v-tab>
                            <v-tab value="5" @click="getSkills()">Skills</v-tab>
                            <v-tab value="6" @click="getExperiences()">Others</v-tab>
                        </v-tabs>

        <v-tabs-window v-model="tab">

        <!-- Personal Info -->
        <v-tabs-window-item value="1" style="padding: 50px">
            <v-row>
                <v-col>
                    <v-text-field v-model="firstName" label="First Name" readonly></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field v-model="lastName" label="Last Name" readonly></v-text-field>
                </v-col>
            </v-row>
            <!-- <v-row>
                <v-col>
                    <v-text-field v-model="jobtitle" label="Job Title"></v-text-field>
                </v-col>
            </v-row>  -->
            <v-row>
                <v-col>
                    <v-text-field v-model="address" label="Address" readonly></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field v-model="phoneNumber" label="Phone Number" readonly></v-text-field>
                </v-col>
                <v-col>
                    <v-text-field v-model="email" label="Email Address" readonly></v-text-field>
                </v-col>
            </v-row>

            <div class="mb-10">
                <v-spacer></v-spacer>
            </div>

            <v-divider></v-divider>

            <div class="mb-10">
                <v-spacer></v-spacer>
            </div>

            <v-row>
                <v-col>
                    <v-card-title align="LEFT">Links</v-card-title>
                </v-col>
            </v-row>

            <v-data-table v-model="selectedLinks" :items="links" item-value="id" :headers="[{ title: 'Description', value: 'type' },
            { title: 'URL', value: 'url' }]" show-select hide-default-footer>
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

        <!-- Professional Summary/Goals -->
        <v-tabs-window-item value="2" style="padding: 50px">

            <div align="left">
                <v-text class="headline mb-2">Select Summary: </v-text>
                <v-data-table v-model="selectedGoals" :items="goals" item-value="id" :headers="[{ title: 'Title', value: 'title' },
                { title: 'Summary', value: 'description' }]" show-select hide-default-footer select-strategy="single">
                </v-data-table>

                <div class="mb-10">
                    <v-spacer></v-spacer>
                </div>

                <div align="center" >
                    <v-btn variant="text" @click="setNewGoalVisible()">
                        + Add New Summary
                    </v-btn>
                </div>
                <v-container v-if="isNewGoalVisible">
                <v-row>
                <v-col>
                    <v-text-field v-model="goalTitle" label="Title"></v-text-field>
                </v-col>
            </v-row>
                <v-row>
                    <v-textarea v-model="goalDescription" label="A brief overview of your skills and experiences">
                        <template #append-inner>
                            <div class="text-center pa-4">
                                <v-dialog v-model="dialog" persistent>
                                <template v-slot:activator="{ props: activatorProps }">
                                    <v-btn color="secondary" rounded="xl" value="Ai Assist" v-bind="activatorProps">
                                            AI Assist
                                        </v-btn>
                                </template>

                                <v-card
                                    text="Please list your Experiences and Achievements that you want to include in the summary, separated by commas(,) ."
                                    title="Goal Ai Assist"
                                >
                                    <template v-slot:actions>
                                    <v-spacer></v-spacer>
                                    <v-container>

                                        <v-row>
                                            <v-text-field label="Experiences" v-model="aiGoalExperiences" variant="outlined" style="width: 30%;">
                                            </v-text-field>
                                        </v-row>
                                        <v-row>
                                            <v-text-field label="Achievements" v-model="aiGoalAchievements" variant="outlined" style="width: 30%;">
                                            </v-text-field>
                                        </v-row>
                                        <v-row>
                                            <v-text-field label="Professional title" v-model="aiGoalTitle" variant="outlined" style="width: 30%;">

                                            </v-text-field>
                                        </v-row>
                                        <div align="center">
                                            <v-row style="width:50%">
                                                <v-col>
                                                    <v-btn @click="clearGoalAiAssist(), dialog = false"> Cancel </v-btn>
                                                </v-col>
                                                <v-col >
                                                    <v-btn @click="aiGoalAssist(), clearGoalAiAssist(), dialog = false"> Confirm </v-btn>
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
                <v-btn variant="tonal" @click="closeNewGoal()">
                    Cancel
                </v-btn>
                &nbsp;&nbsp;&nbsp;
                <v-btn variant="tonal" :disabled="!isGoals" @click="addNewGoal()">
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
                        { title: 'Start Date', value: 'startDate' }, { title: 'Grad Date', value: 'gradDate' }]"
                        show-select hide-default-footer>
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

                    </v-container>




                </v-row>

                <v-col>

                </v-col>
                <v-btn variant="tonal" @click="closeEducation()">
                    Cancel
                </v-btn>
                &nbsp;&nbsp;&nbsp;
                <v-btn variant="tonal" @click="addNewEducation()">
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

        <!-- Experience -->
        <v-tabs-window-item value="4" style="padding: 50px">
            <div align="left">
                <v-text class="headline mb-2">Select Work Experiences: </v-text>
                <v-container>
                    <v-data-table v-model="selectedWorkExperience" :items="experiences"
                        item-value="id" :search="'1'"
                        :custom-filter="filterPerfectMatch"
                        :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' },]"
                        show-select hide-default-footer>
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
                        <v-text-field v-model="jobEnd" label="End Date"></v-text-field>
                        <v-switch label="Present Job" color="primary"></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-textarea v-model="jobDescription" label="Work Summary">
                        <template #append-inner>
                            <v-btn color="secondary" rounded="xl" value="Ai Assist" @click="experienceAIAssist()">
                                AI Assist
                            </v-btn>
                        </template>
                    </v-textarea>
                </v-row>

                <v-col>

                </v-col>
                <v-btn variant="tonal" @click="toggleExperience(1)">
                    Cancel
                </v-btn>
                &nbsp;&nbsp;&nbsp;
                <v-btn variant="tonal" @click="addNewExperience(1)">
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


            <div align="left">
                <v-text class="headline mb-2">Select Leadership Experience: </v-text>

                <v-container>
                    <v-data-table v-model="selectedLeadershipExperience" :items="experiences"
                        item-value="id" :search="'2'"
                        :custom-filter="filterPerfectMatch"
                        :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' },]"
                        show-select hide-default-footer>
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
                        <v-text-field v-model="jobEnd" label="End Date"></v-text-field>
                        <v-switch label="Present Role" color="primary"></v-switch>
                    </v-col>
                </v-row>

                <v-row>
                    <v-textarea v-model="jobDescription" label="Role Summary">
                        <template #append-inner>
                            <v-btn color="secondary" rounded="xl" value="Ai Assist"  @click="experienceAIAssist()">
                                AI Assist
                            </v-btn>
                        </template>
                    </v-textarea>
                </v-row>

                <v-col>

                </v-col>
                <v-btn variant="tonal" @click="toggleExperience(2)">
                    Cancel
                </v-btn>
                &nbsp;&nbsp;&nbsp;
                <v-btn variant="tonal" @click="addNewExperience(2)">
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


            <div align="left">
                <v-text class="headline mb-2">Select Activities: </v-text>

                <v-container>
                    <v-data-table v-model="selectedActivitiesExperience" :items="experiences"
                        item-value="id" :search="'3'"
                        :custom-filter="filterPerfectMatch"
                        :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' },]"
                        show-select hide-default-footer>
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
                        <v-text-field v-model="jobEnd" label="End Date"></v-text-field>
                        <v-switch label="Present Role" color="primary"></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-textarea v-model="jobDescription" label="Role Summary">
                        <template #append-inner>
                            <v-btn color="secondary" rounded="xl" value="Ai Assist" @click="experienceAIAssist()">
                                AI Assist
                            </v-btn>
                        </template>
                    </v-textarea>
                </v-row>

                <v-col>

                </v-col>
                <v-btn variant="tonal" @click="toggleExperience(3)">
                    Cancel
                </v-btn>
                &nbsp;&nbsp;&nbsp;
                <v-btn variant="tonal" @click="addNewExperience(3)">
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


            <div align="left">
                <v-text class="headline mb-2">Select Volunteer Work: </v-text>

                <v-container>
                    <v-data-table v-model="selectedVolunteerExperience" :items="experiences"
                        item-value="id" :search="'4'"
                        :custom-filter="filterPerfectMatch"
                        :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' },]"
                        show-select hide-default-footer>
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
                        <v-text-field v-model="jobEnd" label="End Date"></v-text-field>
                        <v-switch label="Present Role" color="primary"></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-textarea v-model="jobDescription" label="Role Summary">
                        <template #append-inner>
                            <v-btn color="secondary" rounded="xl" value="Ai Assist" @click="experienceAIAssist()">
                                AI Assist
                            </v-btn>
                        </template>
                    </v-textarea>
                </v-row>

                <v-col>

                </v-col>
                <v-btn variant="tonal" @click="toggleExperience(4)">
                    Cancel
                </v-btn>
                &nbsp;&nbsp;&nbsp;
                <v-btn variant="tonal" @click="addNewExperience(4)">
                    Submit
                </v-btn>
            </v-container>




            <div align="right">

                <v-btn variant="tonal" @click="navigateNextTab(4)">
                    Next
                </v-btn>
            </div>
        </v-tabs-window-item>

        <!-- Skills -->
        <v-tabs-window-item value="5" style="padding: 50px">
            <div align="left">
                <v-text class="headline mb-2">Select Skill(s): </v-text>
                <v-container>
                    <v-data-table v-model="selectedSkills" :items="skills"
                        item-value="id"
                        :headers="[{ title: 'Title', value: 'title'}, { title: 'Description', value: 'description' },]"
                        show-select hide-default-footer>
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
                <v-row>
                    <v-col>
                        <v-textarea v-model="skillDescription" label="Brief Description/Proficientcy Level, click AI assist button along with your input to help create a better description">
                        <template #append-inner>
                            <v-btn color="secondary" rounded="xl" value="Ai Assist" @click="skillAiAssist()">
                                AI Assist
                            </v-btn>
                        </template>
                    </v-textarea>         
                    </v-col>
                </v-row>
                <v-col>

                </v-col>
                <v-btn variant="tonal" @click="closeNewSkill()">
                    Cancel
                </v-btn>
                &nbsp;&nbsp;&nbsp;
                <v-btn variant="tonal" :disabled="!isSkilled" @click="addNewSkill()">
                    Submit
                </v-btn>
            </v-container>

            <div class="mb-10">
                <v-spacer></v-spacer>
            </div>

            <div align="right">

                <v-btn variant="tonal" @click="navigateNextTab(5)">
                    Next
                </v-btn>
            </div>
        </v-tabs-window-item>

        <!-- Others -->
        <v-tabs-window-item value="6" style="padding: 50px">
            Other Resume Parts

            <div align="left">
                <v-text class="headline mb-2">Select Honors: </v-text>
                <v-container>
                    <v-data-table v-model="selectedHonorExperience" :items="experiences"
                        item-value="id" :search="'5'"
                        :custom-filter="filterPerfectMatch"
                        :headers="[{ title: 'experienceTypeId', text: 'experienceTypeId',  value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' },]"
                        show-select hide-default-footer>
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
                        <v-text-field v-model="jobStart" label="Date Awarded" hint="Aug 2024"></v-text-field>
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
                <v-btn variant="tonal" @click="addNewExperience(5)">
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
            <div align="left">
                <v-text class="headline mb-2">Select Awards: </v-text>
                <v-container>
                    <v-data-table v-model="selectedAwardExperience" :items="experiences"
                        item-value="id" :search="'6'"
                        :custom-filter="filterPerfectMatch"
                        :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' },]"
                        show-select hide-default-footer>
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
                        <v-text-field v-model="jobStart" label="Date Awarded" hint="Aug 2024"></v-text-field>
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
                <v-btn variant="tonal" @click="addNewExperience(6)">
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
            <div align="left">
                <v-text class="headline mb-2">Select Projects: </v-text>
                <v-container>
                    <v-data-table v-model="selectedProjectExperience" :items="experiences"
                        item-value="id" :search="'7'"
                        :custom-filter="filterPerfectMatch"
                        :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' },]"
                        show-select hide-default-footer>
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
                        <v-text-field v-model="jobEnd" label="End Date"></v-text-field>
                        <v-switch label="Present Role" color="primary"></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-textarea label="Project Summary" v-model="jobDescription">
                        <template #append-inner>
                            <v-btn color="secondary" rounded="xl" value="Ai Assist">
                                AI Assist
                            </v-btn>
                        </template>
                    </v-textarea>
                </v-row>

                <v-col>

                </v-col>
                <v-btn variant="tonal" @click="toggleExperience(7)">
                    Cancel
                </v-btn>
                &nbsp;&nbsp;&nbsp;
                <v-btn variant="tonal" @click="addNewExperience(7)">
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

            </div>

        </v-tabs-window-item>

        </v-tabs-window>
        </v-sheet>
        </v-card>

            </v-col>

            <v-col>
                <v-text-field v-model="title" label="Title"></v-text-field>
                <v-card align="center" v-if="isSelectTemplate">
                    <div style="padding: 3%;">

                        <v-text> Select Template</v-text>
                        <div class="mb-3">
                            <v-spacer></v-spacer>
                        </div>

                        <v-carousel show-arrows="hover" v-model="templateSelected"
                            style="height: max-content; width: 100%;">
                            <v-carousel-item :src="template1" cover :value="1"></v-carousel-item>

                            <v-carousel-item :src="template2" cover :value="2"></v-carousel-item>

                            <v-carousel-item :src="template3" cover :value="3"></v-carousel-item>

                            <v-carousel-item :src="template4" cover :value="4"></v-carousel-item>

                        </v-carousel>
                        <div class="mb-3">
                            <v-spacer></v-spacer>
                        </div>
                        <v-btn variant="tonal" @click="selectedTemplate(templateSelected)">
                            Select
                        </v-btn>

                    </div>
                </v-card>

                <v-card align="center" v-if="isPreviewResume">

                    <div style="padding: 3%;">
                        <v-btn variant="tonal" @click="clearTemplateSelecton()">
                            Select different template
                        </v-btn>

                        <div class="mb-3">
                            <v-spacer></v-spacer>
                        </div>

                        <v-text> Preview Resume </v-text>

                        <v-container>
                            <v-skeleton-loader type="card"></v-skeleton-loader>
                        </v-container>
                    </div>

                </v-card>
                <div class="mb-7">
                    <v-spacer></v-spacer>
                </div>
                <div align="center">
                            <v-checkbox
                                v-model="checkbox1"
                                :label="'Allow Feedback on this resume'"
                            ></v-checkbox>
                    <v-btn :disabled="!isGenerated" @click="addResume()">Generate Resume</v-btn>
                </div>
                <div align="center">
                    <v-btn class="mx-2 my-2" :to="{ name: 'library' }">Go To Library</v-btn>
                </div>
            </v-col>

        </v-row>

        <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>


</template>