<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CreateStoryServices from "../services/CreateStoryServices";

const router = useRouter();
const content = ref();
const title = ref();
const storyId = ref();
const account = ref();
const isFeedback = ref(false);
const feedback = ref("");
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  storyId.value = JSON.parse(localStorage.getItem("storyId"));
  // await getStory();
});

async function getResume() {
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
</script>

<template>
  <v-container>
    <div id="body">
      <v-btn variant="flat" color="secondary" @click="navigateToView()">Cancel</v-btn>
      <v-btn variant="flat" color="secondary" @click="toggleFeedback()">Toggle Feedback</v-btn>
      <v-card-title class="text-center headline mb-2">Edit</v-card-title>
      <div v-show="!isFeedback">
      <v-card class="rounded-lg elevation-5 my-8">
        <v-card-text>
          <v-text-field v-model="title" label="Title" required></v-text-field>
          <v-textarea v-model="content" label="Resume Content" auto-grow></v-textarea>
        </v-card-text>
      </v-card>
      </div>

      <div v-show="isFeedback">
      <v-row>
        <v-col>
      <v-card class="rounded-lg elevation-5 my-8">
        <v-card-title class="text-center headline mb-2">Resume</v-card-title>
        <v-card-text>
          <v-text-field v-model="title" label="Title" required></v-text-field>
          <v-textarea v-model="content" label="Resume Content" auto-grow></v-textarea>
        </v-card-text>
      </v-card>
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
