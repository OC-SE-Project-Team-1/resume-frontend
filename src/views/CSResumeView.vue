<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import template1 from "../components/Template1.vue";
import template2 from "../components/Template2.vue";
import template3 from "../components/Template3.vue";
import template4 from "../components/Template4.vue";
import ResumeServices from "../services/ResumeServices";
import ResumeExport from "../reports/ResumeExport";
import Snackbar from "../components/Snackbar.vue";

const router = useRouter();
const account = ref(null);
const resumeId = ref(null);
const isExport = ref(false);
const feedback = ref(null);
const templateId = ref(0);
const resumeData = ref(null);
const selectedUser = ref();

const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text) {
  snackbarValue.value = true;
  snackbarColor.value = color;
  snackbarText.value = text;
}

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  resumeId.value = JSON.parse(localStorage.getItem("resumeId"));
  selectedUser.value = JSON.parse(localStorage.getItem("selectedUser"));
  await getResume();
});

async function getResume() {
  await ResumeServices.getResume(resumeId.value)
    .then((response) => {
      resumeData.value = response.data;
      templateId.value = resumeData.value.template;
      feedback.value = response.data.comments;
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

function navigateToStudentResumes() {
  router.push({ name: "studentresumeslist" });
}

//Export Resume
async function exportResume() {
  const html = document.getElementsByClassName("resume")
  await ResumeExport.exportResume(html[0])
    .then(() => {
      closeExport();
      makeSnackbar("green", "Resume Exported!")
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

//Submit Feedback
async function submitFeedback() {
  await ResumeServices.inputCSFeedback(resumeId.value, feedback.value, selectedUser.value.id)
    .then(() => {
      makeSnackbar("green", "Feedback Submitted!")
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

function openExport() {
  isExport.value = true;
}

function closeExport() {
  isExport.value = false;
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-card-title class="text-center headline mb-2">View</v-card-title>
      <v-card flat color="transparent">
        <v-card-actions>
          <v-btn variant="flat" color="secondary" @click="openExport()">Export</v-btn>
          <v-btn class="ml-auto" variant="flat" color="secondary" @click="navigateToStudentResumes()"> Back </v-btn>
        </v-card-actions>
      </v-card>
      <v-row>
        <v-col>
          <v-card class="rounded-lg elevation-5 my-8">
            <v-card-title class="text-center headline mb-2">Resume</v-card-title>
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
          </v-card>
        </v-col>
        <v-col>
          <v-card class="rounded-lg elevation-5 my-8">
            <v-card-title class="text-center headline mb-2">Feedback</v-card-title>
            <v-card-text>
              <v-textarea v-model="feedback" label="Input Feedback" auto-grow></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="flat" color="primary" @click="submitFeedback()">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-dialog persistent v-model="isExport" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="text-center headline mb-2">Export Resume?</v-card-title>

          <v-card-actions>
            <v-btn variant="flat" color="primary" @click="exportResume()">Export PDF</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeExport()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
        @update:show="value => snackbarValue = value"></Snackbar>

    </div>
  </v-container>
</template>
