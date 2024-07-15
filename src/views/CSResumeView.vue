<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CreateStoryServices from "../services/CreateStoryServices";
import StoryExport from "../reports/StoryExport";

const router = useRouter();
const account = ref(null);
const content = ref(null);
const title = ref(null);
const storyId = ref(null);
const isExport = ref(false);
const feedback = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  storyId.value = JSON.parse(localStorage.getItem("storyId"));
  await getStory();
});

async function getStory() {
  await CreateStoryServices.getOneStory(storyId.value)
    .then((response) => {
      title.value = response.data.title;
      content.value = response.data.story;
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

function navigateToStudentResumes() {
  router.push({ name: "studentresumeslist" });
}

//Export Story
async function exportStory() {
  await StoryExport.exportStory(storyId.value)
    .then(() => {
      closeExport();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story Exported!";
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Submit Feedback
async function submitFeedback() {
  // await StoryExport.exportStory(storyId.value)
  //   .then(() => {
  //     closeExport();
  //     snackbar.value.value = true;
  //     snackbar.value.color = "green";
  //     snackbar.value.text = "Story Exported!";
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     snackbar.value.value = true;
  //     snackbar.value.color = "error";
  //     snackbar.value.text = error.response.data.message;
  //   });
}

function openExport() {
  isExport.value = true;
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
        <v-card-text>
          <v-textarea v-model="content" label="RESUME FILLER FOR NOW" auto-grow readonly></v-textarea>
        </v-card-text>
      </v-card>
    </v-col>
  <v-col>
      <v-card class="rounded-lg elevation-5 my-8">
        <v-card-title class="text-center headline mb-2">Feedback</v-card-title>
        <v-card-text>
          <v-textarea v-model="feedback" label="Input Feedback" auto-grow ></v-textarea>
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
          <v-card-title class="text-center headline mb-2">Export Story?</v-card-title>

          <v-card-actions>
            <v-btn variant="flat" color="primary" @click="exportStory()">Export PDF</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeExport()">Close</v-btn>
          </v-card-actions>
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
