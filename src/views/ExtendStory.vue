<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CreateStoryServices from "../services/CreateStoryServices";

const router = useRouter();
const extendedcontent = ref();
const loading = ref(false);
const content = ref();
const title = ref();
const story = ref();
const storyId = ref();
const account = ref();
const isExtended = ref(false);
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

//Grab Story and Display it
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

function navigateToView() {
  router.push({ name: "view" });
}

//Save Extension and Navigate to View
async function addExtensionAndClose() {
  story.value = content.value + "\n\n" + extendedcontent.value;
  await CreateStoryServices.updateStory(storyId.value, title.value, story.value, account.value.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story Extension Added!";
      router.push({ name: "view" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Generate Extension to Story
async function generate() {
  isExtended.value = false;
  loading.value = true;
  await CreateStoryServices.extendStory(storyId.value)
    .then((response) => {
      loading.value = false;
      isExtended.value = true;
      extendedcontent.value = response.data.extension;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-btn variant="flat" color="secondary" @click="navigateToView()">Cancel</v-btn>
      <v-card-title class="text-center headline mb-2">Extend</v-card-title>
      <v-card class="rounded-lg elevation-5 my-8">
        <v-card-title class="headline mb-2">Original</v-card-title>
        <v-card-title class="headline mb-2">{{ title }}</v-card-title>
        <v-card-text>
          <v-textarea v-model="content" label="Story Content" auto-grow readonly></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="generate()">Extend Story</v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="rounded-lg elevation-5 my-8">
        <v-card-title class="headline mb-2">Extended</v-card-title>

        <v-container v-if="loading">
          <v-skeleton-loader type="card"></v-skeleton-loader>
        </v-container>

        <v-card-text>
          <v-textarea v-show="isExtended" v-model="extendedcontent" label="Story Content" auto-grow></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="isExtended" variant="flat" color="secondary" @click="navigateToView()">Cancel</v-btn>
          <v-btn v-if="isExtended" variant="flat" color="primary" @click="addExtensionAndClose()">Add Extension</v-btn>
        </v-card-actions>
      </v-card>

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
