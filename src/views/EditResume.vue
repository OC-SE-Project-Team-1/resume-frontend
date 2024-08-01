<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CreateStoryServices from "../services/CreateStoryServices";


import PreviewTemplate1 from "../components/PreviewTemplate1.vue";
import PreviewTemplate2 from "../components/PreviewTemplate2.vue";
import PreviewTemplate3 from "../components/PreviewTemplate3.vue";
import PreviewTemplate4 from "../components/PreviewTemplate4.vue";


import template1 from "../components/Template1.vue";
import template2 from "../components/Template2.vue";
import template3 from "../components/Template3.vue";
import template4 from "../components/Template4.vue";
import ResumeServices from "../services/ResumeServices";

const router = useRouter();
const content = ref();
const title = ref();
const storyId = ref();
const account = ref();
const resumeId = ref(null);
const resumeData = ref(null);
const templateId = ref(0);
const isFeedback = ref(false);
const feedback = ref("");
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const prev1 = ref(null);
const prev2 = ref(null);
const prev3 = ref(null);
const prev4 = ref(null);

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



  console.log("This is the resume's info");
  console.log(resumeData.value);
  console.log(templateId.value);

  console.log(links.value);
  console.log(goal.value);
  console.log(experience.value);
  
  console.log(activities.value);

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

function navigateToView() {
  router.push({ name: "view" });
}

//Save Changes And Navigate to View Page
async function saveAndClose() {
  // await CreateStoryServices.updateStory(storyId.value, title.value, content.value, account.value.id)
  //   .then(() => {
  //     snackbar.value.value = true;
  //     snackbar.value.color = "green";
  //     snackbar.value.text = "Story Updated!";
  router.push({ name: "view" });
  // })
  // .catch((error) => {
  //   console.log(error);
  //   snackbar.value.value = true;
  //   snackbar.value.color = "error";
  //   snackbar.value.text = error.response.data.message;
  // });
}
function toggleFeedback() {
  isFeedback.value = !isFeedback.value;
}
function closeSnackBar() {
  snackbar.value.value = false;
}


const isPreviewResume = ref(false);


async function toggleSelectPreview() {
  isSelectTemplate.value = !isSelectTemplate.value;
  isPreviewResume.value = !isPreviewResume.value;

}



const displayLinks = computed(() => {
    var linkArr = [];
    if (selectedLinks.value !== null) {
        for (let [key, value] of Object.entries(links.value)) {
            for (let [key2, value2] of Object.entries(selectedLinks.value)) {
            // console.log("Link Key: " + key + " Value: " + value.id);
            // console.log("Selected Link Key: " + key2 + " Selected Value: " + value2);
            if (value.id == value2) {
                linkArr.push(value);
            }}
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
            console.log("Link Key: " + key + " Value: " + value.id);
            console.log("Selected Link Key: " + key2 + " Selected Value: " + value2);
            if (value.id == value2) {
                goalArr.push(value.description);
                break;
            }}
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
            }}
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
                }}
    }}
    if (selectedLeadershipExperience.value !== null) {
        for (let [key, value] of Object.entries(leadership.value)) {
            for (let [key2, value2] of Object.entries(selectedLeadershipExperience.value)) {
                if (value.id == value2) {
                    expArr.push(value);
                }}
            }}
    if (selectedActivitiesExperience.value !== null) {
        for (let [key, value] of Object.entries(activities.value)) {
            for (let [key2, value2] of Object.entries(selectedActivitiesExperience.value)) {
                if (value.id == value2) {
                    expArr.push(value);
                }}
            }}
    if (selectedVolunteerExperience.value !== null) {
        for (let [key, value] of Object.entries(volunteer.value)) {
            for (let [key2, value2] of Object.entries(selectedVolunteerExperience.value)) {
                if (value.id == value2) {
                    expArr.push(value);
                }}
    }}
    if (selectedHonorExperience.value !== null) {
        for (let [key, value] of Object.entries(honors.value)) {
            for (let [key2, value2] of Object.entries(selectedHonorExperience.value)) {
                if (value.id == value2) {
                    expArr.push(value);
                }}
            }}
    if (selectedAwardExperience.value !== null) {
        for (let [key, value] of Object.entries(awards.value)) {
            for (let [key2, value2] of Object.entries(selectedAwardExperience.value)) {
                if (value.id == value2) {
                    expArr.push(value);
                }}
    }}
    if (selectedProjectExperience.value !== null) {
        for (let [key, value] of Object.entries(projects.value)) {
            for (let [key2, value2] of Object.entries(selectedProjectExperience.value)) {
                if (value.id == value2) {
                    expArr.push(value);
                }}
    }}
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
            // console.log("Link Key: " + key + " Value: " + value.id);
            // console.log("Selected Link Key: " + key2 + " Selected Value: " + value2);
            if (value.id == value2) {
                skillsArr.push(value);
            }}
        }
    }
    return (
        skillsArr
    )
})
</script>

<template>
  <v-row>
    <v-col>
      <v-container>
        <v-card>
          <v-card-title class="text-center headline mb-2">Edit Contents</v-card-title>

          <h3 v-if="links.length !== 0">Links</h3>
          <v-data-table v-model="selectedLinks" v-if="links.length !== 0" :items="links" item-value="id" :headers="[{ title: 'Description', value: 'type' },
          { title: 'URL', value: 'url' }, { title: 'Edit', value: 'edit' }]"  hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <h3 v-if="goal.length !== 0">Goal</h3>
          <v-data-table v-model="selectedGoals" v-if="goal.length !== 0" :items="goal" item-value="id" :headers="[{ title: 'Title', value: 'title' },
          { title: 'Summary', value: 'description' }, { title: 'Edit', value: 'edit' }]" 
            hide-default-footer select-strategy="single">
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>


          <h3 v-if="education.length !== 0">Education</h3>
          <v-data-table v-model="selectedEducation" v-if="education.length !== 0" :items="education" item-value="id"
            :headers="[{ title: 'Organization', value: 'organization' }, { title: 'Degree', value: 'description' },
            { title: 'Start Date', value: 'startDate' }, { title: 'Grad Date', value: 'gradDate' }, { title: 'Edit', value: 'edit' }]"  hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <h3 v-if="work.length !== 0">Work</h3>
          <v-data-table v-model="selectedWorkExperience" v-if="work.length !== 0" :items="work" item-value="id" :search="'1'"
            :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit' }]"
             hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <h3 v-if="leadership.length !== 0">Leadership</h3>
          <v-data-table v-model="selectedLeadershipExperience" v-if="leadership.length !== 0" :items="leadership" item-value="id" :search="'2'"
            :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit' }]"
             hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <h3 v-if="activities.length !== 0">Activities</h3>
          <v-data-table v-model="selectedActivitiesExperience" v-if="activities.length !== 0" :items="activities" item-value="id" :search="'3'"
            :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit' }]"
             hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <h3 v-if="volunteer.length !== 0">Volunteer</h3>
          <v-data-table v-model="selectedVolunteerExperience" v-if="volunteer.length !== 0" :items="volunteer" item-value="id" :search="'4'"
            :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Organization', value: 'organization' }, { title: 'Title', value: 'title' }, { title: 'Edit', value: 'edit' }]"
             hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <h3 v-if="skills.length !== 0">Skills</h3>
          <v-data-table v-model="selectedSkills" v-if="skills.length !== 0" :items="skills" item-value="id"
            :headers="[{ title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit' }]"
             hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <h3 v-if="honors.length !== 0">Honors</h3>
          <v-data-table v-model="selectedHonorExperience" v-if="honors.length !== 0" :items="honors" item-value="id" :search="'5'"
            :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'experienceTypeId', text: 'experienceTypeId', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit' }]"
             hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <h3 v-if="awards.length !== 0">Awards</h3>
          <v-data-table v-model="selectedAwardExperience" v-if="awards.length !== 0" :items="awards" item-value="id" :search="'6'"
            :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit' }]"
            hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <h3 v-if="projects.length !== 0">Projects</h3>
          <v-data-table v-model="selectedProjectExperience" v-if="projects.length !== 0" :items="projects" item-value="id" :search="'7'"
            :custom-filter="filterPerfectMatch"
            :headers="[{ title: 'Experience', value: 'experienceTypeId', align: ' d-none' }, { title: 'Title', value: 'title' }, { title: 'Description', value: 'description' }, { title: 'Edit', value: 'edit' }]"
             hide-default-footer>
            <template v-slot:item.edit="{ item }">
              <v-btn variant="text" @click="" icon>
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
          <v-card-title class="text-center headline mb-2">Preview</v-card-title>

        <div>
          <div v-if="templateId == 1">
            <PreviewTemplate1 :links="displayLinks" :goal="displayGoal" :education="displayEducation" :experience="displayExperience" :skills="displaySkills"></PreviewTemplate1>
          </div>
          <div v-if="templateId == 2">
            <PreviewTemplate2  :links="displayLinks" :goal="displayGoal" :education="displayEducation" :experience="displayExperience" :skills="displaySkills"></PreviewTemplate2>
          </div>
          <div v-if="templateId == 3">
            <PreviewTemplate3  :links="displayLinks" :goal="displayGoal" :education="displayEducation" :experience="displayExperience" :skills="displaySkills"></PreviewTemplate3>
          </div>
          <div v-if="templateId == 4">
            <PreviewTemplate4  :links="displayLinks" :goal="displayGoal" :education="displayEducation" :experience="displayExperience" :skills="displaySkills"></PreviewTemplate4>
          </div>
        </div>

<!--
          <div v-show="!isFeedback">
            <div v-if="templateId == 1">
              <template1></template1>
            </div>
            <div v-if="templateId == 2">
              <template2></template2>
            </div>
            <div v-if="templateId == 3">
              <template3></template3>
            </div>
            <div v-if="templateId == 4">
              <template4></template4>
            </div>
          </div>
          -->
        </v-card>
        


      </v-container>



    </v-col>
  </v-row>







</template>
