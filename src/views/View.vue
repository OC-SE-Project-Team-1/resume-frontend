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
import { useTheme } from 'vuetify'

const router = useRouter();
const account = ref(null);
const resumeData = ref(null);
const resumeId = ref(null);
const isExport = ref(false);
const isDownloaded = ref(false);
const isFeedback = ref(false);
const templateId = ref(0);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
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
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
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

    theme.global.name.value = 'LightTheme';
  
    const html = document.getElementsByClassName("resume")
    await ResumeExport.exportResume(html[0])
    .then(() => {
      isDownloaded.value = true;
      closeExport();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Resume Exported!";
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
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

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card flat color="transparent">
        <v-card-actions>
          <v-btn variant="flat" color="secondary" @click="navigateToEdit()">Edit</v-btn>
          <v-btn variant="flat" color="secondary" @click="openExport()">Export</v-btn>
          <v-btn variant="flat" color="secondary" @click="toggleFeedback()">Toggle Feedback</v-btn>
          <v-btn class="ml-auto" variant="flat" color="secondary" @click="navigateToLibrary()"> Back </v-btn>
        </v-card-actions>

        <v-checkbox  id="editingCheckBox" v-model="isEdit" :label="'Allow Feedback on this resume'"
                        @click = "updateEditing()"></v-checkbox>
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
            <v-card class="rounded-lg elevation-5 my-8">
              <v-card-title class="text-center headline mb-2">Feedback</v-card-title>
              <v-card-text>
                <v-textarea v-model="feedback" label="View Feedback" auto-grow readonly></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="primary" @click="submitFeedback()">Submit</v-btn>
              </v-card-actions>
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

      <v-dialog persistent v-model="isDownloaded" width="400">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="text-center headline mb-2">Finish Download?</v-card-title>
          
            <v-btn variant="flat" color="primary" @click="refreshPage()">confirm</v-btn>
          
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
