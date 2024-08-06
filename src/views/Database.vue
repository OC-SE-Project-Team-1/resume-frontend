<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import UserServices from "../services/UserServices.js";
import LinkServices from "../services/LinkServices.js";
import GoalServices from "../services/GoalServices.js";
import SkillServices from "../services/SkillServices.js";
import EducationServices from "../services/EducationServices.js";
import ExperienceServices from "../services/ExperienceServices.js";
import LinksEdit from "../components/LinksEdit.vue";
import EducationEdit from "../components/EducationEdit.vue";
import ExperienceEdit from "../components/ExperienceEdit.vue";
import GoalsEdit from "../components/GoalsEdit.vue";
import SkillsEdit from "../components/SkillsEdit.vue";
import Snackbar from "../components/Snackbar.vue";
import DeleteDialog from "../components/DeleteDialog.vue";
import { useRouter } from "vue-router";
import NewLink from "../components/NewLink.vue";
import NewGoal from "../components/NewGoal.vue";
import NewEducation from "../components/NewEducation.vue";
import NewExperience from "../components/NewExperience.vue";

const router = useRouter();


const account = ref();
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
const schoolGrad = ref(null);
const attending = ref(false);
const awards = ref(null);
const studyAbroadTitle = ref(null);
const studyAbroadOrganization = ref(null);
const studyAbroadLocation = ref(null);
const studyAbroadTime = ref(null);
const studyAbroadYear = ref(null);
const editstudyAbroadTitle = computed(() => {
  return editedItem.value.studyAbroad?.title || '';
});
const editstudyAbroadOrganization = computed(() => {
  return editedItem.value.studyAbroad?.organization || '';
});
const editstudyAbroadLocation= computed(() => {
  return editedItem.value.studyAbroad?.location || '';
});
const editstudyAbroadTime = computed(() => {
  return editedItem.value.studyAbroad?.term || '';
});
const editstudyAbroadYear= computed(() => {
  return editedItem.value.studyAbroad?.year || '';
});

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

const isAttending = ref(false);

let deleteItemId = 0;
const isRequestingAiAssist = ref(false);

const isSkilled = computed(() => {
    return (
        skillTitle.value !== "" &&
        skillDescription.value !== ""
    )
});


onMounted(() => {
    account.value = JSON.parse(localStorage.getItem("account"));
    getPersonalInfo();
});

function closeSnackBar() {
    snackbar.value.value = false;
}

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
    clearExperienceData();
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
    if (edit) {
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



async function experienceAIAssist(edit) {
    isRequestingAiAssist.value = true;
    if (edit) {

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

function updateEditLinksDialog(newState) {
  editLinksDialog.value = newState;
  getLinks();
}

// professional summary dialog stuff
const editProfSumDialog = ref(false);

function openEditProfSumDialog(item) {
    editedItem.value = { ...item };
    editProfSumDialog.value = true;
}

function updateEditProfSumDialog(newState) {
    editProfSumDialog.value = newState;
    getGoals();
}

// education dialog stuff
const editEducationDialog = ref(false);

function openEditEducationDialog(item) {
    editedItem.value = { ...item };
    isAttending.value = editedItem.value.gradDate !== null;
    editEducationDialog.value = true;
}

function updateEditEducationDialog(newState) {
  editEducationDialog.value = newState;
  getEducationInfo();
}

function updateIsAttending(newValue) {
  isAttending.value = newValue;
}


// all types of experience dialog stuff
const editExperienceDialog = ref(false);

function openEditExperienceDialog(item) {
    editedItem.value = { ...item };
    editExperienceDialog.value = true;
}

function updateEditExperienceDialog() {
    experienceChatHistory = [];
    editExperienceDialog.value = false;
    getExperiences();
}

// skills dialog stuff
const editSkillsDialog = ref(false);

function openEditSkillsDialog(item) {
    editedItem.value = { ...item };
    editSkillsDialog.value = true;
}

function updateEditSkillsDialog() {
    skillHistory = []
    editSkillsDialog.value = false;
    getSkills();
}

// delete dialog stuff
const isDeleted = ref(null);

function openDelete(item) {
    deleteItemId = item.id
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

                                <NewLink v-if="isNewLinkVisible" :isNewLinkVisible="isNewLinkVisible"
                                    @update:isNewLinkVisible="value => isNewLinkVisible = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getLinks="getLinks"></NewLink>


                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(1)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Professional Summary -->
                            <v-tabs-window-item value="2" style="padding: 50px">

                                <div align="left">
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


                            <!-- Work Experience -->
                            <v-tabs-window-item value="4" style="padding: 50px">
                                <div align="left">
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





                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(4)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Leadership Experience -->
                            <v-tabs-window-item value="5" style="padding: 50px">


                                <div align="left">

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

                                <NewExperience v-if="isLeadershipExperience"  :isLeadershipExperience="isLeadershipExperience"
                                    @update:isLeadershipExperience="value => isLeadershipExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="2" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>


                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(5)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Activities -->
                            <v-tabs-window-item value="6" style="padding: 50px">


                                <div align="left">

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

                                <NewExperience v-if="isActivitiesExperience"  :isActivitiesExperience="isActivitiesExperience"
                                    @update:isActivitiesExperience="value => isActivitiesExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="3" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(6)">
                                        Next
                                    </v-btn>
                                </div>

                            </v-tabs-window-item>

                            <!-- Volunteer Work -->
                            <v-tabs-window-item value="7" style="padding: 50px">


                                <div align="left">

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

                                <NewExperience v-if="isVolunteerExperience"  :isVolunteerExperience="isVolunteerExperience"
                                    @update:isVolunteerExperience="value => isVolunteerExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="4" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(7)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Skills -->
                            <v-tabs-window-item value="8" style="padding: 50px">

                                <div align="left">
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
                                    <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isSkilled"
                                        @click="addNewSkill()">
                                        Submit
                                    </v-btn>
                                </v-container>

                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(8)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Honors -->
                            <v-tabs-window-item value="9" style="padding: 50px">
                                <div align="left">
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

                                <NewExperience v-if="isHonorExperience"  :isHonorExperience="isHonorExperience"
                                    @update:isHonorExperience="value => isHonorExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="5" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(9)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>
                            <!-- Awards -->
                            <v-tabs-window-item value="10" style="padding: 50px">
                                <div align="left">
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

                                <NewExperience v-if="isAwardExperience"  :isAwardExperience="isAwardExperience"
                                    @update:isAwardExperience="value => isAwardExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="6" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                                <div align="right">

                                    <v-btn variant="tonal" @click="navigateNextTab(10)">
                                        Next
                                    </v-btn>
                                </div>
                            </v-tabs-window-item>

                            <!-- Project -->
                            <v-tabs-window-item value="11" style="padding: 50px">
                                <div align="left">
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

                                <NewExperience v-if="isProjectExperience"  :isProjectExperience="isProjectExperience"
                                    @update:isProjectExperience="value => isProjectExperience = value" :account="account"
                                    :makeSnackbar="makeSnackbar" :getExperiences="getExperiences"
                                    :toggleExperience="toggleExperience" :whichExperience="7" :experienceAIAssist="experienceAIAssist"
                                    :isRequestingAiAssist="isRequestingAiAssist" :jobDescription="jobDescription"
                                    @update:jobDescription="value => jobDescription = value"
                                    ></NewExperience>

                            </v-tabs-window-item>

                            <!-- LINKS DIALOG -->
                            <v-dialog v-model="editLinksDialog" persistent>
                                <LinksEdit :makeSnackbar="makeSnackbar" :url="editedItem.url" 
                                :description="editedItem.type" 
                                :linkId="editedItem.id" 
                                :editLinksDialog="editLinksDialog"
                                @update:editLinksDialog="updateEditLinksDialog" ></LinksEdit>
                            </v-dialog>

                            <!-- PROFESSIONAL SUMMARY DIALOG -->
                            <div v-if="editProfSumDialog">
                            <GoalsEdit :makeSnackbar="makeSnackbar" :editingItem="editedItem"
                                       :editProfSumDialog="editProfSumDialog"
                                       @update:editProfSumDialog="updateEditProfSumDialog"
                            ></GoalsEdit>
                            </div>  

                            <!-- EDUCATION DIALOG -->
                            <div v-if="editEducationDialog">
                                <EducationEdit :makeSnackbar="makeSnackbar" :editingItem="editedItem"
                                            :studyAbroadTitle="editstudyAbroadTitle"
                                            :studyAbroadOrganization="editstudyAbroadOrganization"
                                            :studyAbroadLocation="editstudyAbroadLocation"
                                            :studyAbroadTime="editstudyAbroadTime"
                                            :studyAbroadYear="editstudyAbroadYear"
                                            :isAttending="isAttending"
                                            :editEducationDialog="editEducationDialog"
                                            @update:editEducationDialog="updateEditEducationDialog"
                                            @update:isAttending="updateIsAttending"
                                            ></EducationEdit>
                                </div>

                            <!-- EXPERIENCE DIALOG-->
                            <div v-if="editExperienceDialog">
                                <ExperienceEdit :makeSnackbar="makeSnackbar" :editingItem="editedItem"
                                                :editExperienceDialog="editExperienceDialog"
                                                :experienceAIAssist="experienceAIAssist"
                                                :isRequestingAiAssist="isRequestingAiAssist"
                                                @update:editExperienceDialog="updateEditExperienceDialog"
                                ></ExperienceEdit>
                            </div>

                            <!-- SKILLS DIALOG-->
                            <div v-if="editSkillsDialog">
                                <SkillsEdit :makeSnackbar="makeSnackbar" :editingItem="editedItem"
                                            :editSkillsDialog="editSkillsDialog"
                                            :skillAiAssist="skillAiAssist"
                                            :isRequestingAiAssist="isRequestingAiAssist"
                                            @update:editSkillsDialog="updateEditSkillsDialog"
                                ></SkillsEdit>
                            </div>

                            <DeleteDialog v-model="isDeleted" :isDeleted="isDeleted"
                                @update:isDeleted="value => isDeleted = value" :tab="tab" :deleteItemId="deleteItemId"
                                :account="account" :makeSnackbar="makeSnackbar" :getLinks="getLinks"
                                :getGoals="getGoals" :getEducationInfo="getEducationInfo"
                                :getExperiences="getExperiences" :getSkills="getSkills">
                            </DeleteDialog>



                        </v-tabs-window>
                    </v-sheet>
                </v-card>

            </v-col>
        </v-row>

        <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
            @update:show="value => snackbarValue = value"></Snackbar>

    </v-container>


</template>