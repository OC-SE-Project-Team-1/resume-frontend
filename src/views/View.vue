<script setup>
import { onMounted, computed } from "vue";
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
const resumeData = ref(null);
const resumeId = ref(null);
const isExport = ref(false);
const isEdit = ref(false);;
const isFeedback = ref(false);
const feedback = ref("");
const rating = ref("");
const templateId = ref(0);

const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text) {
  snackbarValue.value = true;
  snackbarColor.value = color;
  snackbarText.value = text;
}

const showFeedback = computed(() => {
  if (isFeedback.value) {
    return "Hide Feedback"
  }
  else {
    return "Show Feedback"
  }
});

const anyFeedback = computed(() => {
  if (rating.value !== "") {
    return true
  }
  else if (isEdit.value == false) {
    return false
  }
  else {
    return true
  }
});

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  resumeId.value = JSON.parse(localStorage.getItem("resumeId"));
  await getResume();
});

async function getResume() {
  await ResumeServices.getResume(resumeId.value)
    .then((response) => {
      resumeData.value = response.data;
      isEdit.value = response.data.editing;
      templateId.value = resumeData.value.template;
      feedback.value = resumeData.value.comments;
      rating.value = resumeData.value.rating;
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

//Navigate to Different Pages
function navigateToEdit() {
  router.push({ name: "edit" });
}

function navigateToLibrary() {
  router.push({ name: "library" });
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

function openExport() {
  isExport.value = true;
}

function toggleFeedback() {
  isFeedback.value = !isFeedback.value;
}

function closeExport() {
  isExport.value = false;
}

async function updateEditing() {
  isEdit.value = !isEdit.value
  await ResumeServices.updateResumeEditing(resumeId.value, isEdit.value, account.value.id)
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card flat color="transparent">
        <v-card-actions>
          <v-btn variant="flat" color="secondary" @click="navigateToEdit()">Edit</v-btn>
          <v-btn variant="flat" color="secondary" @click="openExport()">Export</v-btn>
          <v-btn v-show="anyFeedback" variant="flat" color="secondary" @click="toggleFeedback()">
            {{ showFeedback }}</v-btn>
          <v-btn class="ml-auto" variant="flat" color="secondary" @click="navigateToLibrary()"> Back </v-btn>
        </v-card-actions>

        <v-checkbox id="editingCheckBox" v-model="isEdit" :label="'Allow Feedback on this resume'"
          @click="updateEditing()"></v-checkbox>
      </v-card>
      <v-card-title class="text-center headline mb-2">View</v-card-title>

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

      <div v-show="isFeedback">
        <v-row>
          <v-col>
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
          </v-col>

          <v-col>
            <v-card v-show="isEdit || rating !== ''" class="rounded-lg elevation-5 my-8">
              <v-card-title class="text-center headline mb-2">Feedback</v-card-title>
              <v-card-text v-show="isEdit">
                <v-textarea v-model="feedback" label="Career Service Feedback" auto-grow readonly></v-textarea>
              </v-card-text>
              <v-card-text v-show="rating !== ''">
                <v-textarea v-model="rating" label="AI Feedback" auto-grow readonly></v-textarea>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

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
