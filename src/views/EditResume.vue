<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import PreviewTemplate1 from "../components/PreviewTemplate1.vue";
import PreviewTemplate2 from "../components/PreviewTemplate2.vue";
import PreviewTemplate3 from "../components/PreviewTemplate3.vue";
import PreviewTemplate4 from "../components/PreviewTemplate4.vue";
import ResumeServices from "../services/ResumeServices";
import LinkServices from "../services/LinkServices.js";
import GoalServices from "../services/GoalServices.js";
import SkillServices from "../services/SkillServices.js";
import EducationServices from "../services/EducationServices.js";
import ExperienceServices from "../services/ExperienceServices.js";
import LinksEdit from "../components/LinksEdit.vue";

const router = useRouter();
const title = ref();
const account = ref();
const resumeId = ref(null);
const resumeData = ref(null);
const templateId = ref(0);
const isAttending = ref(false);
const feedback = ref("");
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

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
const editedStudyAbroadTitle = ref(null);
const editedStudyAbroadOrganization = ref(null);
const editedStudyAbroadLocation = ref(null);
const editedStudyAbroadTime = ref(null);
const editedStudyAbroadYear = ref(null);

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

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  resumeId.value = JSON.parse(localStorage.getItem("resumeId"));
  await getResume();
  await sortData();

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
});

async function getResume() {
  await ResumeServices.getResume(resumeId.value)
    .then((response) => {
      resumeData.value = response.data;
      templateId.value = resumeData.value.template;
      feedback.value = resumeData.value.comments;
      title.value = resumeData.value.title;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function makeSnackbar(value, color, text) {
  snackbar.value.value = value;
  snackbar.value.color = color;
  snackbar.value.text = text;
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

async function updateEditLinks() {
  getResume();
    const index = links.value.findIndex(link => link.id === editedItem.value.id);
    if (index !== -1) {
      links.value[index] = { ...editedItem.value };
    }
    selectedLinks.value = links.value.map(link => link.id);
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

      const index = goal.value.findIndex(goal => goal.id === editedItem.value.id);
      if (index !== -1) {
        goal.value[index] = { ...editedItem.value };
      }
      makeSnackbar(true, "green", "Professional Summary Updated!");
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar(true, "error", error.response.data.message);
    });
  closeEditProfSumDialog();
}


// education dialog stuff
const editEducationDialog = ref(false);

function openEditEducationDialog(item) {
  editedItem.value = { ...item };
  editEducationDialog.value = true;
  isAttending.value = editedItem.value.gradDate !== null;
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
  if (editedItem.value.studyAbroad == null) {
    studyAbroad = {
      "title": editedStudyAbroadTitle.value,
      "organization": editedStudyAbroadOrganization.value,
      "location": editedStudyAbroadLocation.value,
      "term": editedStudyAbroadTime.value,
      "year": editedStudyAbroadYear.value
    }
  }
  else if (editedItem.value.studyAbroad.title !== "" && editedItem.value.studyAbroad.title !== null) {
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
      const index = education.value.findIndex(education => education.id === editedItem.value.id);
      if (index !== -1) {
        education.value[index] = { ...editedItem.value };
      }
      makeSnackbar(true, "green", "Education Updated!");
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar(true, "error", error.response.data.message);
    });
  closeEditEducationDialog();
}

async function toggleIsAttending() {
  isAttending.value = !isAttending.value;
  if (isAttending.value == false) {
    editedItem.value.gradDate = null;
  }
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
  await ExperienceServices.updateExperience(editedItem.value.title, editedItem.value.description, editedItem.value.startDate, editedItem.value.endDate,
    editedItem.value.city, editedItem.value.state, editedItem.value.organization, editedItem.value.chatHistory,
    account.value.id, editedItem.value.id
  )
    .then(() => {


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




      makeSnackbar(true, "green", "Experience Updated!");
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar(true, "error", error.response.data.message);
    });
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
      makeSnackbar(true, "green", "Skill Updated!");
      const index = skills.value.findIndex(skills => skills.id === editedItem.value.id);
      if (index !== -1) {
        skills.value[index] = { ...editedItem.value };
      }

    })
    .catch((error) => {
      console.log(error);
      makeSnackbar(true, "error", error.response.data.message);
    });
  closeEditSkillsDialog();
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
      <LinksEdit :url="editedItem.url" 
      :description="editedItem.type" 
      :linkId="editedItem.id" 
      :editLinksDialog="editLinksDialog"
      @update:editLinksDialog="updateEditLinksDialog" ></LinksEdit>
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
              <v-text-field v-model="editedItem.organization" label="School Name"></v-text-field>
            </v-col>

          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.city" label="City"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="editedItem.state" label="State"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.gpa" label="GPA"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="editedItem.totalGPA" label="Max GPA"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.description" label="Title of Degree"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.startDate" label="Start Date" hint="Ex: Aug 2024"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="editedItem.endDate" v-if="!isAttending" label="End Date"
                hint="Ex: Aug 2024"></v-text-field>
              <v-text-field v-model="editedItem.gradDate" v-if="isAttending" label="Grad Date"
                hint="Ex: Aug 2024"></v-text-field>
              <v-switch v-model="isAttending" label="Still Attending" color="primary"
                @click="toggleIsAttending()"></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.courses" label="Course(s)"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.minor" label="Minor(s)"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.awards" label="Award(s)"></v-text-field>
            </v-col>
          </v-row>
          <div v-if="editedItem.studyAbroad !== null">
            <v-row>
              <v-text-field label="Study Abroad Title" v-model="editedItem.studyAbroad.title"
                hint="Name of Study Abroad Program">
              </v-text-field>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.studyAbroad.organization" label="Study Abroad Organization"
                  hint="Ex) Capital Normal"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.studyAbroad.location" label="Study Abroad Location"
                  hint="Ex) Beijing, China"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.studyAbroad.term" label="Study Abroad Term"
                  hint="Ex) Fall Semester"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.studyAbroad.year" label="Study Abroad Year"
                  hint="Ex) 2018"></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <v-row>
              <v-text-field label="Study Abroad Title" v-model="editedStudyAbroadTitle"
                hint="Name of Study Abroad Program">
              </v-text-field>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedStudyAbroadOrganization" label="Study Abroad Organization"
                  hint="Ex) Capital Normal"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedStudyAbroadLocation" label="Study Abroad Location"
                  hint="Ex) Beijing, China"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedStudyAbroadTime" label="Study Abroad Term"
                  hint="Ex) Fall Semester"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedStudyAbroadYear" label="Study Abroad Year" hint="Ex) 2018"></v-text-field>
              </v-col>
            </v-row>
          </div>

        </v-container>


      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeEditEducationDialog">Cancel</v-btn>
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
              <v-text-field v-model="editedItem.title" label="Position Title"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="editedItem.organization" label="Company Name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.city" label="City"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="editedItem.state" label="State"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.startDate" label="Start Date"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field :disabled="editedItem.current" v-model="editedItem.endDate" label="End Date"></v-text-field>
              <v-switch v-model="editedItem.current" label="Present Job" color="primary"></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-textarea v-model="editedItem.description" label="Work Summary">
            </v-textarea>
          </v-row>
          <v-col>
          </v-col>

        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeEditExperienceDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveEditExperience">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="editSkillsDialog" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Edit Item</span>
      </v-card-title>
      <v-card-text>


        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="editedItem.title" label="Skill"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea v-model="editedItem.description" </v-textarea>
            </v-col>
          </v-row>

        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeEditSkillsDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveEditSkills">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>






</template>
