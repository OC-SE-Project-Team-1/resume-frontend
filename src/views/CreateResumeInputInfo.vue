<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
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
import PreviewTemplate1 from "../components/PreviewTemplate1.vue";
import PreviewTemplate2 from "../components/PreviewTemplate2.vue";
import PreviewTemplate3 from "../components/PreviewTemplate3.vue";
import PreviewTemplate4 from "../components/PreviewTemplate4.vue";
import Snackbar from "../components/Snackbar.vue";
import DeleteDialog from "../components/DeleteDialog.vue";
import NewLink from "../components/NewLink.vue";
import NewGoal from "../components/NewGoal.vue";
import NewEducation from "../components/NewEducation.vue";
import NewExperience from "../components/NewExperience.vue";

const account = ref();
const title = ref("");
//Snackbar to display errors
const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text) {
    snackbarValue.value = true;
    snackbarColor.value = color;
    snackbarText.value = text;
}
const isNewLinkVisible = ref(false);
const isNewEduVisible = ref(false);
const tabs = ref();
const tab = ref("1");

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
let goalChatHistory = [];

const educationInfo = ref();
const selectedEducation = ref(null);
const schoolName = ref("");
const schoolCity = ref("");
const schoolState = ref("");
const degree = ref("");
const schoolStart = ref("");
const schoolEnd = ref("");
const schoolGrad = ref(null);
const degreeTitle = ref("");
const degreeType = ref("");

const experiences = ref();
const selectedWorkExperience = ref(null);
const selectedLeadershipExperience = ref(null);
const selectedActivitiesExperience = ref(null);
const selectedVolunteerExperience = ref(null);
const selectedHonorExperience = ref(null);
const selectedAwardExperience = ref(null);
const selectedProjectExperience = ref(null);
const isCurrent = ref(false);

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

const isAttending = ref(false);

const templateSelected = ref();
const selectedResumeTemplate = ref(0);

const isSelectTemplate = ref(true);
const isPreviewResume = ref(false);

const isRequestingAiAssist = ref(false);

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

const displayLinks = computed(() => {
    var linkArr = [];
    if (selectedLinks.value !== null) {
        for (let [key, value] of Object.entries(links.value)) {
            for (let [key2, value2] of Object.entries(selectedLinks.value)) {
                if (value.id == value2) {
                    linkArr.push(value);
                }
            }
        }
    }
    return (
        linkArr
    )
})

const displayGoal = computed(() => {
    var goalArr = [];
    if (selectedGoals.value !== null) {
        for (let [key, value] of Object.entries(goals.value)) {
            for (let [key2, value2] of Object.entries(selectedGoals.value)) {
                if (value.id == value2) {
                    goalArr.push(value.description);
                    break;
                }
            }
        }
    }
    return (
        goalArr.join("")
    )
})

const displayEducation = computed(() => {
    var eduArr = [];
    if (selectedEducation.value !== null) {
        for (let [key, value] of Object.entries(educationInfo.value)) {
            for (let [key2, value2] of Object.entries(selectedEducation.value)) {
                if (value.id == value2) {
                    eduArr.push(value);
                }
            }
        }
    }
    return (
        eduArr
    )
})
const displayExperience = computed(() => {
    var expArr = [];
    if (experiences.value !== null) {
        if (selectedWorkExperience.value !== null) {
            for (let [key, value] of Object.entries(experiences.value)) {
                for (let [key2, value2] of Object.entries(selectedWorkExperience.value)) {
                    if (value.id == value2) {
                        expArr.push(value);
                    }
                }
            }
        }
        if (selectedLeadershipExperience.value !== null) {
            for (let [key, value] of Object.entries(experiences.value)) {
                for (let [key2, value2] of Object.entries(selectedLeadershipExperience.value)) {
                    if (value.id == value2) {
                        expArr.push(value);
                    }
                }
            }
        }
        if (selectedActivitiesExperience.value !== null) {
            for (let [key, value] of Object.entries(experiences.value)) {
                for (let [key2, value2] of Object.entries(selectedActivitiesExperience.value)) {
                    if (value.id == value2) {
                        expArr.push(value);
                    }
                }
            }
        }
        if (selectedVolunteerExperience.value !== null) {
            for (let [key, value] of Object.entries(experiences.value)) {
                for (let [key2, value2] of Object.entries(selectedVolunteerExperience.value)) {
                    if (value.id == value2) {
                        expArr.push(value);
                    }
                }
            }
        }
        if (selectedHonorExperience.value !== null) {
            for (let [key, value] of Object.entries(experiences.value)) {
                for (let [key2, value2] of Object.entries(selectedHonorExperience.value)) {
                    if (value.id == value2) {
                        expArr.push(value);
                    }
                }
            }
        }
        if (selectedAwardExperience.value !== null) {
            for (let [key, value] of Object.entries(experiences.value)) {
                for (let [key2, value2] of Object.entries(selectedAwardExperience.value)) {
                    if (value.id == value2) {
                        expArr.push(value);
                    }
                }
            }
        }
        if (selectedProjectExperience.value !== null) {
            for (let [key, value] of Object.entries(experiences.value)) {
                for (let [key2, value2] of Object.entries(selectedProjectExperience.value)) {
                    if (value.id == value2) {
                        expArr.push(value);
                    }
                }
            }
        }
    }
    return (
        expArr
    )

})

const displaySkills = computed(() => {
    var skillsArr = [];
    if (selectedSkills.value !== null) {
        for (let [key, value] of Object.entries(skills.value)) {
            for (let [key2, value2] of Object.entries(selectedSkills.value)) {
                if (value.id == value2) {
                    skillsArr.push(value);
                }
            }
        }
    }
    return (
        skillsArr
    )
})

onMounted(() => {
    account.value = JSON.parse(localStorage.getItem("account"));
    localStorage.removeItem("resumeTemplate");
    getPersonalInfo();
});

async function setNewLinkVisible() {
    isNewLinkVisible.value = true;
}


async function setNewGoalVisible() {
    isNewGoalVisible.value = true;
}

async function getLinks() {
    await LinkServices.getLinksForUser(account.value.id)
        .then((response) => {
            links.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message)
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
    clearExperienceData();
    closeNewSkill();
}

async function selectedTemplate(value) {
    selectedResumeTemplate.value = parseInt(value);
    window.localStorage.setItem("resumeTemplate", JSON.stringify(value));
    toggleSelectPreview();
}

async function toggleSelectPreview() {
    isSelectTemplate.value = !isSelectTemplate.value;
    isPreviewResume.value = !isPreviewResume.value;
}

async function clearTemplateSelecton() {

    localStorage.removeItem("resumeTemplate");
    toggleSelectPreview();
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
            clearExperienceData();
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
            clearExperienceData();
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
            clearExperienceData();
        }
        if (isProjectExperience.value == true) {
            clearExperienceData();
            isAwardExperience.value = false;
            isHonorExperience.value = false;
        }
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
            makeSnackbar("error", error.response.data.message)
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
            makeSnackbar("error", error.response.data.message)
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
            makeSnackbar("error", error.response.data.message)
        });
}


async function setNewEduVisible() {
    isNewEduVisible.value = true;
}

async function getExperiences() {
    await ExperienceServices.getExperiencesForUser(account.value.id)
        .then((response) => {
            experiences.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message)
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
    isCurrent.value = false;
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
            makeSnackbar("error", error.response.data.message)
        });
}

async function addNewSkill() {
    await SkillServices.addSkill(skillTitle.value, skillDescription.value, skillHistory, parseInt(account.value.id))
        .then(() => {
            makeSnackbar("green", "Skill Added!")
            closeNewSkill();
            getSkills();
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message)
        });
}

function filterPerfectMatch(value, search) {
    return value != null && String(value) === search
}

async function skillAiAssist() {
    isRequestingAiAssist.value = true;
    await SkillServices.skillAiAssist(skillDescription.value)
        .then((response) => {
            skillDescription.value = response.data.description
            skillHistory.push(response.data.chatHistory[0])
            skillHistory.push(response.data.chatHistory[1])
            isRequestingAiAssist.value = false;
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
            linkArr.push(value);
        }
    }

    if (selectedGoals.value !== null) {
        for (let [key, value] of Object.entries(selectedGoals.value)) {
            goalArr.push(value);
        }
    }

    if (selectedEducation.value !== null) {
        for (let [key, value] of Object.entries(selectedEducation.value)) {
            eduArr.push(value);
        }
    }

    if (selectedWorkExperience.value !== null) {
        for (let [key, value] of Object.entries(selectedWorkExperience.value)) {
            expArr.push(value);
        }
    }
    if (selectedLeadershipExperience.value !== null) {
        for (let [key, value] of Object.entries(selectedLeadershipExperience.value)) {
            expArr.push(value);
        }
    }
    if (selectedActivitiesExperience.value !== null) {
        for (let [key, value] of Object.entries(selectedActivitiesExperience.value)) {
            expArr.push(value);
        }
    }
    if (selectedVolunteerExperience.value !== null) {
        for (let [key, value] of Object.entries(selectedVolunteerExperience.value)) {
            expArr.push(value);
        }
    }
    if (selectedHonorExperience.value !== null) {
        for (let [key, value] of Object.entries(selectedHonorExperience.value)) {
            expArr.push(value);
        }
    }
    if (selectedAwardExperience.value !== null) {
        for (let [key, value] of Object.entries(selectedAwardExperience.value)) {
            expArr.push(value);
        }
    }
    if (selectedProjectExperience.value !== null) {
        for (let [key, value] of Object.entries(selectedProjectExperience.value)) {
            expArr.push(value);
        }
    }

    if (selectedSkills.value !== null) {
        for (let [key, value] of Object.entries(selectedSkills.value)) {
            skillArr.push(value);
        }
    }

    await ResumeServices.addResume(title.value, goalArr, expArr, skillArr,
        eduArr, linkArr, false, selectedResumeTemplate.value,
        parseInt(account.value.id))
        .then(() => {
            makeSnackbar("green", "Resume Created!")
            clearAllSelected();
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message)
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

async function experienceAIAssist() {
    isRequestingAiAssist.value = true;
    await ExperienceServices.experienceAiAssist(jobDescription.value)
        .then((response) => {
            jobDescription.value = response.data.description
            experienceChatHistory.push(response.data.chatHistory[0])
            experienceChatHistory.push(response.data.chatHistory[1])
            isRequestingAiAssist.value = false;
        })
}


const editDialog = ref(false);
const editedItem = ref(null);

function openEditDialog(item) {
    editedItem.value = { ...item };
    editDialog.value = true;
}

function closeEditDialog(item) {
    editDialog.value = false;
}

function saveEdit() {
    closeEditDialog();
}


let deleteItemId = 0;


// delete dialog stuff
const isDeleted = ref(null);

function openDelete(item) {
    deleteItemId = item.id;
    isDeleted.value = true;
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

                            <DeleteDialog v-model="isDeleted" :isDeleted="isDeleted"
                                @update:isDeleted="value => isDeleted = value" :tab="tab" :deleteItemId="deleteItemId"
                                :account="account" :makeSnackbar="makeSnackbar" :getLinks="getLinks"
                                :getGoals="getGoals" :getEducationInfo="getEducationInfo"
                                :getExperiences="getExperiences" :getSkills="getSkills"></DeleteDialog>


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
                                <v-row>
                                    <v-col>
                                        <v-text-field v-model="address" label="Address" readonly></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field v-model="phoneNumber" label="Phone Number"
                                            readonly></v-text-field>
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
                                <v-card-text class="headline mb-2" align="left">Select Link(s): </v-card-text>

                                <v-data-table v-model="selectedLinks" :items="links" item-value="id" :headers="[{ title: 'Description', value: 'type' },
                                { title: 'URL', value: 'url' }, { title: 'Delete', value: 'delete' }]" show-select
                                    hide-default-footer>
                                    <template v-slot:item.delete="{ item }">
                                        <v-btn variant="text" @click="openDelete(item)" icon>
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </template>

                                </v-data-table>


                                <v-dialog v-model="editDialog" persistent>
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
                                            <v-btn color="blue darken-1" text @click="closeEditDialog">Cancel</v-btn>
                                            <v-btn color="blue darken-1" text @click="saveEdit">Save</v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>


                                <v-btn variant="text" @click="setNewLinkVisible()">
                                    + Add New link
                                </v-btn>


                                <NewLink v-if="isNewLinkVisible" :isNewLinkVisible="isNewLinkVisible"
                                    @update:isNewLinkVisible="value => isNewLinkVisible = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getLinks="getLinks"></NewLink>


                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(1)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Professional Summary/Goals -->
                            <v-tabs-window-item value="2" style="padding: 50px">

                                <div align="left">
                                    <v-card-text class="headline mb-2">Select Summary: </v-card-text>
                                    <v-data-table v-model="selectedGoals" :items="goals" item-value="id" :headers="[{ title: 'Title', value: 'title' },
                                    { title: 'Summary', value: 'description' }, { title: 'Delete', value: 'delete' }]"
                                        show-select hide-default-footer select-strategy="single">
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

                                    <NewGoal v-if="isNewGoalVisible" :isNewGoalVisible="isNewGoalVisible"
                                        @update:isNewGoalVisible="value => isNewGoalVisible = value" :account="account"
                                        :makeSnackbar="makeSnackbar" :getGoals="getGoals"></NewGoal>

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
                                    <v-card-text class="headline mb-2">Select Education: </v-card-text>

                                    <v-container>
                                        <v-data-table v-model="selectedEducation" :items="educationInfo" item-value="id"
                                            :headers="[{ title: 'Organization', value: 'organization' }, { title: 'Degree', value: 'description' },
                                            { title: 'Start Date', value: 'startDate' }, { title: 'End Date', value: 'endDate' }, { title: 'Delete', value: 'delete' }]"
                                            show-select hide-default-footer>
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

                                <NewEducation v-if="isNewEduVisible" :isNewEduVisible="isNewEduVisible"
                                        @update:isNewEduVisible="value => isNewEduVisible = value" :account="account"
                                        :makeSnackbar="makeSnackbar" :getEducationInfo="getEducationInfo"
                                ></NewEducation>

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
                                    <v-card-text class="headline mb-2">Select Work Experiences: </v-card-text>
                                    <v-container>
                                        <v-data-table v-model="selectedWorkExperience" :items="experiences"
                                            item-value="id" :search="'1'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Delete', value: 'delete' }]"
                                            show-select hide-default-footer>
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

                                <NewExperience v-if="isJobExperience"  :isJobExperience="isJobExperience"
                                    @update:isJobExperience="value => isJobExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="1" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <div align="left">
                                    <v-card-text class="headline mb-2">Select Leadership Experience: </v-card-text>

                                    <v-container>
                                        <v-data-table v-model="selectedLeadershipExperience" :items="experiences"
                                            item-value="id" :search="'2'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Delete', value: 'delete' }]"
                                            show-select hide-default-footer>
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

                                <NewExperience v-if="isLeadershipExperience"  :isLeadershipExperience="isLeadershipExperience"
                                    @update:isLeadershipExperience="value => isLeadershipExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="2" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <div align="left">
                                    <v-card-text class="headline mb-2">Select Activities: </v-card-text>

                                    <v-container>
                                        <v-data-table v-model="selectedActivitiesExperience" :items="experiences"
                                            item-value="id" :search="'3'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Delete', value: 'delete' }]"
                                            show-select hide-default-footer>
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

                                <NewExperience v-if="isActivitiesExperience"  :isActivitiesExperience="isActivitiesExperience"
                                    @update:isActivitiesExperience="value => isActivitiesExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="3" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>


                                <div align="left">
                                    <v-card-text class="headline mb-2">Select Volunteer Work: </v-card-text>

                                    <v-container>
                                        <v-data-table v-model="selectedVolunteerExperience" :items="experiences"
                                            item-value="id" :search="'4'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Delete', value: 'delete' }]"
                                            show-select hide-default-footer>
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

                                <NewExperience v-if="isVolunteerExperience"  :isVolunteerExperience="isVolunteerExperience"
                                    @update:isVolunteerExperience="value => isVolunteerExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="4" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>




                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(4)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Skills -->
                            <v-tabs-window-item value="5" style="padding: 50px">
                                <div align="left">
                                    <v-card-text class="headline mb-2">Select Skill(s): </v-card-text>
                                    <v-container>
                                        <v-data-table v-model="selectedSkills" :items="skills" item-value="id"
                                            :headers="[{ title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Delete', value: 'delete' }]"
                                            show-select hide-default-footer>
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
                                    <v-skeleton-loader v-if="isRequestingAiAssist" type="paragraph"></v-skeleton-loader>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-if="!isRequestingAiAssist" v-model="skillTitle"
                                                label="Skill"></v-text-field>
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
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isSkilled"
                                        @click="addNewSkill()">
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
                                    <v-card-text class="headline mb-2">Select Honors: </v-card-text>
                                    <v-container>
                                        <v-data-table v-model="selectedHonorExperience" :items="experiences"
                                            item-value="id" :search="'5'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'experienceTypeId', text: 'experienceTypeId', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Delete', value: 'delete' }]"
                                            show-select hide-default-footer>
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

                                <NewExperience v-if="isHonorExperience"  :isHonorExperience="isHonorExperience"
                                    @update:isHonorExperience="value => isHonorExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="5" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>
                                <div align="left">
                                    <v-card-text class="headline mb-2">Select Awards: </v-card-text>
                                    <v-container>
                                        <v-data-table v-model="selectedAwardExperience" :items="experiences"
                                            item-value="id" :search="'6'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Delete', value: 'delete' }]"
                                            show-select hide-default-footer>
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

                                <NewExperience v-if="isAwardExperience"  :isAwardExperience="isAwardExperience"
                                    @update:isAwardExperience="value => isAwardExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="6" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>

                                <v-divider></v-divider>

                                <div class="mb-10">
                                    <v-spacer></v-spacer>
                                </div>
                                <div align="left">
                                    <v-card-text class="headline mb-2">Select Projects: </v-card-text>
                                    <v-container>
                                        <v-data-table v-model="selectedProjectExperience" :items="experiences"
                                            item-value="id" :search="'7'" :custom-filter="filterPerfectMatch"
                                            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Delete', value: 'delete' }]"
                                            show-select hide-default-footer>
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

                                <NewExperience v-if="isProjectExperience"  :isProjectExperience="isProjectExperience"
                                    @update:isProjectExperience="value => isProjectExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="7" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

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

                <v-card v-if="isPreviewResume">

                    <div style="padding: 3%;">
                        <div align="center">
                            <v-btn variant="tonal" @click="clearTemplateSelecton()">
                                Select different template
                            </v-btn>

                            <div class="mb-3">
                                <v-spacer></v-spacer>
                            </div>

                            <v-text> Preview Resume </v-text>
                            <!-- <v-skeleton-loader type="card"></v-skeleton-loader> -->
                        </div>
                        <div v-if="selectedResumeTemplate == 1">
                            <v-container>
                                <PreviewTemplate1 :links="displayLinks" :goal="displayGoal"
                                    :education="displayEducation" :experience="displayExperience"
                                    :skills="displaySkills"></PreviewTemplate1>
                            </v-container>
                        </div>
                        <div v-if="selectedResumeTemplate == 2">
                            <v-container>
                                <PreviewTemplate2 :links="displayLinks" :goal="displayGoal"
                                    :education="displayEducation" :experience="displayExperience"
                                    :skills="displaySkills"></PreviewTemplate2>
                            </v-container>
                        </div>
                        <div v-if="selectedResumeTemplate == 3">
                            <v-container>
                                <PreviewTemplate3 :links="displayLinks" :goal="displayGoal"
                                    :education="displayEducation" :experience="displayExperience"
                                    :skills="displaySkills"></PreviewTemplate3>
                            </v-container>
                        </div>
                        <div v-if="selectedResumeTemplate == 4">
                            <v-container>
                                <PreviewTemplate4 :links="displayLinks" :goal="displayGoal"
                                    :education="displayEducation" :experience="displayExperience"
                                    :skills="displaySkills"></PreviewTemplate4>
                            </v-container>
                        </div>
                    </div>

                </v-card>
                <div class="mb-7">
                    <v-spacer></v-spacer>
                </div>
                <div align="center">
                    <v-btn :disabled="!isGenerated" @click="addResume()">Generate Resume</v-btn>
                </div>
                <div align="center">
                    <v-btn class="mx-2 my-2" :to="{ name: 'library' }">Go To Library</v-btn>
                </div>
            </v-col>

        </v-row>

        <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
            @update:show="value => snackbarValue = value"></Snackbar>

    </v-container>



</template>
