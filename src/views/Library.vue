<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CreateStoryServices from "../services/CreateStoryServices";
import StoryExport from "../reports/StoryExport";

const router = useRouter();
const isExport = ref(false);
const isDeleted = ref(false);
const account = ref(null);
const titles = ref();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  // await getTitles();
});

//Grab all Characacter Names
async function getTitles() {
  await CreateStoryServices.getUserStories(account.value.id)
    .then((response) => {
      titles.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Delete Story
async function deleteStory() {
  await CreateStoryServices.deleteStory(storyId.value, account.value.id)
    .then(() => {
      getTitles();
      localStorage.removeItem("storyId");
      isDeleted.value = false;
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story Deleted!";
      router.push({ name: "library" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Navigate to View Page
function navigateToView(itemId) {
  // window.localStorage.setItem("storyId", JSON.stringify(itemId));
  router.push({ name: "view" });
}

//Open/Close Pop Ups
function openExport(itemId) {
  window.localStorage.setItem("storyId", JSON.stringify(itemId));
  storyId.value = JSON.parse(localStorage.getItem("storyId"));
  isExport.value = true;
}
function openDelete(itemId) {
  window.localStorage.setItem("storyId", JSON.stringify(itemId));
  storyId.value = JSON.parse(localStorage.getItem("storyId"));
  isDeleted.value = true;
}
function closeSnackBar() {
  snackbar.value.value = false;
}
function closeExport() {
  isExport.value = false;
}
function closeDelete() {
  isDeleted.value = false;
}

//Export Story
async function exportStory() {
  await StoryExport.exportStory(storyId.value)
    .then(() => {
      closeExport();
      localStorage.removeItem("storyId");
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story Exported!";
      router.push({ name: "library" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

}
</script>
<script>
export default {
  data() {
    return {
      select: [],
      items: [
      ],
    }
  },
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Library
          </v-card-title>
        </v-col>
      </v-row>
      <v-table fixed-header>
        <thead>
          <tr>
            <th class="text-left">
              Resumes
            </th>
            <!-- <th class="text-right"><v-btn rounded variant="text" :to="{ name: 'createstory' }"> Create Story </v-btn>
            </th> -->
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">Resume1</td>
            <td class="text-right">
              <v-btn rounded variant="text" @click="navigateToView()"> View </v-btn>
              <v-btn rounded variant="text" @click="openExport()"> Export </v-btn>
              <v-btn rounded variant="text" @click="openDelete()"> Delete </v-btn>
            </td>
          </tr>
          <tr>
            <td class="text-left">Resume2</td>
            <td class="text-right">
              <v-btn rounded variant="text" @click="navigateToView()"> View </v-btn>
              <v-btn rounded variant="text" @click="openExport()"> Export </v-btn>
              <v-btn rounded variant="text" @click="openDelete()"> Delete </v-btn>
            </td>
          </tr>
          <!-- <tr v-for="item in titles" :key="item.id">
            <td class="text-left">{{ item.title }}</td>
            <td class="text-right">
              <v-btn rounded variant="text" @click="navigateToView(item.id)"> View </v-btn>
              <v-btn rounded variant="text" @click="openExport(item.id)"> Export </v-btn>
              <v-btn rounded variant="text" @click="openDelete(item.id)"> Delete </v-btn>
            </td>
          </tr> -->
        </tbody>
      </v-table>

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

      <v-dialog persistent v-model="isDeleted" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="text-center headline mb-2">Delete Story?</v-card-title>
          <v-text align="center">You will be unable to retrieve this story once deleted!</v-text>

          <v-card-actions>
            <v-btn variant="flat" color="primary" @click="deleteStory()">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeDelete()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>