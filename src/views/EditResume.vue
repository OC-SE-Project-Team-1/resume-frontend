<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import PreviewTemplate1 from "../components/PreviewTemplate1.vue";
import PreviewTemplate2 from "../components/PreviewTemplate2.vue";
import PreviewTemplate3 from "../components/PreviewTemplate3.vue";
import PreviewTemplate4 from "../components/PreviewTemplate4.vue";
import ResumeServices from "../services/ResumeServices";
import SkillServices from "../services/SkillServices.js";
import ExperienceServices from "../services/ExperienceServices.js";
import Snackbar from "../components/Snackbar.vue";
import LinksEdit from "../components/LinksEdit.vue";
import EducationEdit from "../components/EducationEdit.vue";
import ExperienceEdit from "../components/ExperienceEdit.vue";
import GoalsEdit from "../components/GoalsEdit.vue";
import SkillsEdit from "../components/SkillsEdit.vue";

const router = useRouter();
const title = ref();
const account = ref();
const resumeId = ref(null);
const resumeData = ref(null);
const templateId = ref(0);
const isAttending = ref(false);
const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text) {
  snackbarValue.value = true;
  snackbarColor.value = color;
  snackbarText.value = text;
}

const links = ref([]);
const goal = ref([]);
const education = ref([]);
const experience = ref([]);
const skills = ref([]);
const leadership = ref([]);
const activities = ref([]);
const work = ref([]);
const volunteer = ref([]);
const honors = ref([]);
const awards = ref([]);
const projects = ref([]);
const studyAbroadTitle = computed(() => {
  return editedItem.value.studyAbroad?.title || '';
});
const studyAbroadOrganization = computed(() => {
  return editedItem.value.studyAbroad?.organization || '';
});
const studyAbroadLocation = computed(() => {
  return editedItem.value.studyAbroad?.location || '';
});
const studyAbroadTime = computed(() => {
  return editedItem.value.studyAbroad?.term || '';
});
const studyAbroadYear = computed(() => {
  return editedItem.value.studyAbroad?.year || '';
});

let experienceChatHistory = [];
let skillHistory = [];

const selectedLinks = ref(null);
const selectedGoals = ref(null);
const selectedEducation = ref(null);
const selectedWorkExperience = ref(null);
const selectedLeadershipExperience = ref(null);
const selectedActivitiesExperience = ref(null);
const selectedVolunteerExperience = ref(null);
const selectedSkills = ref(null);
const selectedHonorExperience = ref(null);
const selectedAwardExperience = ref(null);
const selectedProjectExperience = ref(null);

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
    for (let [key, value] of Object.entries(goal.value)) {
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
    for (let [key, value] of Object.entries(education.value)) {
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
  if (experience.value !== null) {
    if (selectedWorkExperience.value !== null) {
      for (let [key, value] of Object.entries(work.value)) {
        for (let [key2, value2] of Object.entries(selectedWorkExperience.value)) {
          if (value.id == value2) {
            expArr.push(value);
          }
        }
      }
    }
    if (selectedLeadershipExperience.value !== null) {
      for (let [key, value] of Object.entries(leadership.value)) {
        for (let [key2, value2] of Object.entries(selectedLeadershipExperience.value)) {
          if (value.id == value2) {
            expArr.push(value);
          }
        }
      }
    }
    if (selectedActivitiesExperience.value !== null) {
      for (let [key, value] of Object.entries(activities.value)) {
        for (let [key2, value2] of Object.entries(selectedActivitiesExperience.value)) {
          if (value.id == value2) {
            expArr.push(value);
          }
        }
      }
    }
    if (selectedVolunteerExperience.value !== null) {
      for (let [key, value] of Object.entries(volunteer.value)) {
        for (let [key2, value2] of Object.entries(selectedVolunteerExperience.value)) {
          if (value.id == value2) {
            expArr.push(value);
          }
        }
      }
    }
    if (selectedHonorExperience.value !== null) {
      for (let [key, value] of Object.entries(honors.value)) {
        for (let [key2, value2] of Object.entries(selectedHonorExperience.value)) {
          if (value.id == value2) {
            expArr.push(value);
          }
        }
      }
    }
    if (selectedAwardExperience.value !== null) {
      for (let [key, value] of Object.entries(awards.value)) {
        for (let [key2, value2] of Object.entries(selectedAwardExperience.value)) {
          if (value.id == value2) {
            expArr.push(value);
          }
        }
      }
    }
    if (selectedProjectExperience.value !== null) {
      for (let [key, value] of Object.entries(projects.value)) {
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

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  resumeId.value = JSON.parse(localStorage.getItem("resumeId"));
  await getResume();
  await sortData();
  await mapData();

});

async function getResume() {
  await ResumeServices.getResume(resumeId.value)
    .then((response) => {
      resumeData.value = response.data;
      templateId.value = resumeData.value.template;
      title.value = resumeData.value.title;
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

async function sortData() {
  links.value = resumeData.value.Link;
  goal.value = resumeData.value.Goal;
  education.value = resumeData.value.Education;
  experience.value = resumeData.value.Experience;

  console.log(experience.value);
  for (let [key, value] of Object.entries(experience.value)) {

    if (value.experienceTypeId == 1) {
      work.value.push(value);
    }
    else if (value.experienceTypeId == 2) {
      leadership.value.push(value);
    }
    else if (value.experienceTypeId == 3) {
      activities.value.push(value);
    }
    else if (value.experienceTypeId == 4) {
      volunteer.value.push(value);
    }
    else if (value.experienceTypeId == 5) {
      honors.value.push(value);
    }
    else if (value.experienceTypeId == 6) {
      awards.value.push(value);
    }
    else if (value.experienceTypeId == 7) {
      projects.value.push(value);
    }

  }

  skills.value = resumeData.value.Skill;
}

async function mapData() {
  selectedLinks.value = links.value.map(link => link.id);
  selectedGoals.value = goal.value.map(goal => goal.id);
  selectedEducation.value = education.value.map(education => education.id);
  selectedWorkExperience.value = work.value.map(work => work.id);
  selectedLeadershipExperience.value = leadership.value.map(leadership => leadership.id);
  selectedActivitiesExperience.value = activities.value.map(activities => activities.id);
  selectedVolunteerExperience.value = volunteer.value.map(volunteer => volunteer.id);
  selectedSkills.value = skills.value.map(skills => skills.id);
  selectedHonorExperience.value = honors.value.map(honors => honors.id);
  selectedAwardExperience.value = awards.value.map(awards => awards.id);
  selectedProjectExperience.value = projects.value.map(projects => projects.id);
}

function filterPerfectMatch(value, search) {
  return value != null && String(value) === search
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
  updateEditLinks();
}

function updateUrl(newUrl) {
  editedItem.value.url = newUrl;
}

function updateLinkDescription(newDescription) {
  editedItem.value.type = newDescription;
}

async function updateEditLinks() {
  const index = links.value.findIndex(link => link.id === editedItem.value.id);
  if (index !== -1) {
    links.value[index] = { ...editedItem.value };
  }
  getResume();
}

// professional summary dialog stuff
const editProfSumDialog = ref(false);

function openEditProfSumDialog(item) {
  editedItem.value = { ...item };
  editProfSumDialog.value = true;
}

function updateEditProfSumDialog() {
  editProfSumDialog.value = false;
  updateEditProfSum();
}

async function updateEditProfSum() {
  const index = goal.value.findIndex(goal => goal.id === editedItem.value.id);
  if (index !== -1) {
    goal.value[index] = { ...editedItem.value };
  }
}

// education dialog stuff
const editEducationDialog = ref(false);

function openEditEducationDialog(item) {
  editedItem.value = { ...item };
  editEducationDialog.value = true;
  isAttending.value = editedItem.value.gradDate !== null;
}

function updateEditEducationDialog(newState) {
  editEducationDialog.value = newState;
  updateEditEducation()
}

function updateEditingItem(newValue) {
  editedItem.value = newValue;
}

function updateStudyAbroadTitle(newValue) {
  editedItem.value.studyAbroad.title = newValue;
}

function updateStudyAbroadOrganization(newValue) {
  editedItem.value.studyAbroad.organization = newValue;
}

function updateStudyAbroadLocation(newValue) {
  editedItem.value.studyAbroad.location = newValue;
}

function updateStudyAbroadTime(newValue) {
  editedItem.value.studyAbroad.term = newValue;
}

function updateStudyAbroadYear(newValue) {
  editedItem.value.studyAbroad.year = newValue;
}

function updateIsAttending(newValue) {
  isAttending.value = newValue;
}

async function updateEditEducation() {
  const index = education.value.findIndex(education => education.id === editedItem.value.id);
  if (index !== -1) {
    education.value[index] = { ...editedItem.value };
  }
  getResume();
}

// all types of experience dialog stuff
const editExperienceDialog = ref(false);
const isRequestingAiAssist = ref(false);

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
  }
}

function openEditExperienceDialog(item) {
  editedItem.value = { ...item };
  editExperienceDialog.value = true;
}

function updateEditExperienceDialog() {
  experienceChatHistory = [];
  editExperienceDialog.value = false;
  updateEditExperience();
}

async function updateEditExperience() {
  if (editedItem.value.experienceTypeId == 1) {
    const index = work.value.findIndex(work => work.id === editedItem.value.id);
    if (index !== -1) {
      work.value[index] = { ...editedItem.value };
    }
  }
  else if (editedItem.value.experienceTypeId == 2) {
    const index = leadership.value.findIndex(leadership => leadership.id === editedItem.value.id);
    if (index !== -1) {
      leadership.value[index] = { ...editedItem.value };
    }
  }
  else if (editedItem.value.experienceTypeId == 3) {
    const index = activities.value.findIndex(activities => activities.id === editedItem.value.id);
    if (index !== -1) {
      activities.value[index] = { ...editedItem.value };
    }
  }
  else if (editedItem.value.experienceTypeId == 4) {
    const index = volunteer.value.findIndex(volunteer => volunteer.id === editedItem.value.id);
    if (index !== -1) {
      volunteer.value[index] = { ...editedItem.value };
    }
  }
  else if (editedItem.value.experienceTypeId == 5) {
    const index = honors.value.findIndex(honors => honors.id === editedItem.value.id);
    if (index !== -1) {
      honors.value[index] = { ...editedItem.value };
    }
  }
  else if (editedItem.value.experienceTypeId == 6) {
    const index = awards.value.findIndex(awards => awards.id === editedItem.value.id);
    if (index !== -1) {
      awards.value[index] = { ...editedItem.value };
    }
  }
  else if (editedItem.value.experienceTypeId == 7) {
    const index = projects.value.findIndex(projects => projects.id === editedItem.value.id);
    if (index !== -1) {
      projects.value[index] = { ...editedItem.value };
    }
  }
}

// skills dialog stuff
const editSkillsDialog = ref(false);

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
}

function openEditSkillsDialog(item) {
  editedItem.value = { ...item };
  editSkillsDialog.value = true;
}

function updateEditSkillsDialog() {
  skillHistory = []
  editSkillsDialog.value = false;
  updateEditSkills();
}

async function updateEditSkills() {
  const index = skills.value.findIndex(skills => skills.id === editedItem.value.id);
  if (index !== -1) {
    skills.value[index] = { ...editedItem.value };
  }

}

function navigateToView() {
  router.push({ name: "view" });
}
</script>

<template>
  <div class="mb-10">
    <v-spacer></v-spacer>
  </div>
  <v-card-title class="text-center headline mb-2">Edit Resume</v-card-title>
  <div class="d-flex justify-end" style="padding-right: 5%;">
    <v-btn variant="flat" color="secondary" @click="navigateToView"> Back </v-btn>
  </div>
  <v-row>
    <v-col>
      <v-container>
        <v-card style="padding:5%">
          <v-card-title class="text-center headline mb-2">Edit Contents</v-card-title>

          <!-- LINK -->
          <h3 v-if="links.length !== 0">Links</h3>
          <v-data-table v-model="selectedLinks" v-if="links.length !== 0" :items="links" item-value="id" :headers="[{ title: 'Description', value: 'type' },
          { title: 'URL', value: 'url', align: 'center' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditLinksDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- GOAL -->
          <h3 v-if="goal.length !== 0">Goal</h3>
          <v-data-table v-model="selectedGoals" v-if="goal.length !== 0" :items="goal" item-value="id" :headers="[{ title: 'Title', value: 'title' },
          { title: 'Summary', value: 'description' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer select-strategy="single">
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditProfSumDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- Education -->
          <h3 v-if="education.length !== 0">Education</h3>
          <v-data-table v-model="selectedEducation" v-if="education.length !== 0" :items="education" item-value="id"
            :headers="[{ title: 'Organization', value: 'organization' }, { title: 'Degree', value: 'description' },
            { title: 'Start Date', value: 'startDate' }, { title: 'Grad Date', value: 'gradDate' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditEducationDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- Work -->
          <h3 v-if="work.length !== 0">Work</h3>
          <v-data-table v-model="selectedWorkExperience" v-if="work.length !== 0" :items="work" item-value="id"
            :search="'1'" :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- Leadership -->
          <h3 v-if="leadership.length !== 0">Leadership</h3>
          <v-data-table v-model="selectedLeadershipExperience" v-if="leadership.length !== 0" :items="leadership"
            item-value="id" :search="'2'" :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- Activities -->
          <h3 v-if="activities.length !== 0">Activities</h3>
          <v-data-table v-model="selectedActivitiesExperience" v-if="activities.length !== 0" :items="activities"
            item-value="id" :search="'3'" :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- Volunteer -->
          <h3 v-if="volunteer.length !== 0">Volunteer</h3>
          <v-data-table v-model="selectedVolunteerExperience" v-if="volunteer.length !== 0" :items="volunteer"
            item-value="id" :search="'4'" :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- Skills -->
          <h3 v-if="skills.length !== 0">Skills</h3>
          <v-data-table v-model="selectedSkills" v-if="skills.length !== 0" :items="skills" item-value="id"
            :headers="[{ title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditSkillsDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- Honors -->
          <h3 v-if="honors.length !== 0">Honors</h3>
          <v-data-table v-model="selectedHonorExperience" v-if="honors.length !== 0" :items="honors" item-value="id"
            :search="'5'" :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'experienceTypeId', text: 'experienceTypeId', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- Awards -->
          <h3 v-if="awards.length !== 0">Awards</h3>
          <v-data-table v-model="selectedAwardExperience" v-if="awards.length !== 0" :items="awards" item-value="id"
            :search="'6'" :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <!-- Projects -->
          <h3 v-if="projects.length !== 0">Projects</h3>
          <v-data-table v-model="selectedProjectExperience" v-if="projects.length !== 0" :items="projects"
            item-value="id" :search="'7'" :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit', align: 'end' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="openEditExperienceDialog(item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-col>

    <!-- Preview -->
    <v-col>
      <v-container>
        <v-card>
          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>
          <v-card-title class="text-center headline mb-2">Preview</v-card-title>

          <div>
            <div v-if="templateId == 1">
              <PreviewTemplate1 :links="displayLinks" :goal="displayGoal" :education="displayEducation"
                :experience="displayExperience" :skills="displaySkills"></PreviewTemplate1>
            </div>
            <div v-if="templateId == 2">
              <PreviewTemplate2 :links="displayLinks" :goal="displayGoal" :education="displayEducation"
                :experience="displayExperience" :skills="displaySkills"></PreviewTemplate2>
            </div>
            <div v-if="templateId == 3">
              <PreviewTemplate3 :links="displayLinks" :goal="displayGoal" :education="displayEducation"
                :experience="displayExperience" :skills="displaySkills"></PreviewTemplate3>
            </div>
            <div v-if="templateId == 4">
              <PreviewTemplate4 :links="displayLinks" :goal="displayGoal" :education="displayEducation"
                :experience="displayExperience" :skills="displaySkills"></PreviewTemplate4>
            </div>
          </div>
        </v-card>
      </v-container>
    </v-col>
  </v-row>

  <!-- LINKS DIALOG -->
  <v-dialog v-model="editLinksDialog" persistent>
    <LinksEdit :makeSnackbar="makeSnackbar" :url="editedItem.url" :description="editedItem.type" :linkId="editedItem.id"
      :editLinksDialog="editLinksDialog" @update:url="updateUrl" @update:description="updateLinkDescription"
      @update:editLinksDialog="updateEditLinksDialog"></LinksEdit>
  </v-dialog>

  <!-- PROFESSIONAL SUMMARY DIALOG -->
  <div v-if="editProfSumDialog">
    <GoalsEdit :makeSnackbar="makeSnackbar" :editingItem="editedItem" :editProfSumDialog="editProfSumDialog"
      @update:editProfSumDialog="updateEditProfSumDialog"></GoalsEdit>
  </div>

  <!-- EDUCATION DIALOG -->
  <div v-if="editEducationDialog">
    <EducationEdit :makeSnackbar="makeSnackbar" :editingItem="editedItem" :studyAbroadTitle="studyAbroadTitle"
      :studyAbroadOrganization="studyAbroadOrganization" :studyAbroadLocation="studyAbroadLocation"
      :studyAbroadTime="studyAbroadTime" :studyAbroadYear="studyAbroadYear" :isAttending="isAttending"
      :editEducationDialog="editEducationDialog" @update:editEducationDialog="updateEditEducationDialog"
      @update:editingItem="updateEditingItem" @update:studyAbroadTitle="updateStudyAbroadTitle"
      @update:studyAbroadOrganization="updateStudyAbroadOrganization"
      @update:studyAbroadLocation="updateStudyAbroadLocation" @update:studyAbroadTime="updateStudyAbroadTime"
      @update:studyAbroadYear="updateStudyAbroadYear" @update:isAttending="updateIsAttending"></EducationEdit>
  </div>

  <!-- EXPERIENCE DIALOG-->
  <div v-if="editExperienceDialog">
    <ExperienceEdit :makeSnackbar="makeSnackbar" :editingItem="editedItem" :editExperienceDialog="editExperienceDialog"
      :experienceAIAssist="experienceAIAssist" :isRequestingAiAssist="isRequestingAiAssist"
      @update:editExperienceDialog="updateEditExperienceDialog"></ExperienceEdit>
  </div>

  <!-- SKILLS DIALOG-->
  <div v-if="editSkillsDialog">
    <SkillsEdit :makeSnackbar="makeSnackbar" :editingItem="editedItem" :editSkillsDialog="editSkillsDialog"
      :skillAiAssist="skillAiAssist" :isRequestingAiAssist="isRequestingAiAssist"
      @update:editSkillsDialog="updateEditSkillsDialog"></SkillsEdit>
  </div>

  <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
    @update:show="value => snackbarValue = value"></Snackbar>

</template>
