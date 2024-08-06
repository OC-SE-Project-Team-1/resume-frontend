<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ResumeServices from "../services/ResumeServices";

const router = useRouter();
const isDeleted = ref(false);
const account = ref(null);
const titles = ref();
const resumeId = ref();

const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text){
  snackbarValue.value = true;
  snackbarColor.value = color;
  snackbarText.value = text;
}

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  await getResumes();
});

//Grab all Resumes
async function getResumes() {
  await ResumeServices.getResumesForUser(account.value.id)
    .then((response) => {
      titles.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

//Delete Resume
async function deleteResume() {
  await ResumeServices.deleteResume(resumeId.value, account.value.id)
    .then(() => {
      getResumes();
      localStorage.removeItem("resumeId");
      isDeleted.value = false;
      makeSnackbar("green", "Resume Deleted!")
      router.push({ name: "library" });
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

//Navigate to View Page
function navigateToView(itemId) {
  window.localStorage.setItem("resumeId", JSON.stringify(itemId));
  router.push({ name: "view" });
}

function openDelete(itemId) {
  window.localStorage.setItem("resumeId", JSON.stringify(itemId));
  resumeId.value = JSON.parse(localStorage.getItem("resumeId"));
  isDeleted.value = true;
}
function compareToJobDesc(itemId) {
  window.localStorage.setItem("resumeId", JSON.stringify(itemId));
  resumeId.value = JSON.parse(localStorage.getItem("resumeId"));
  router.push({ name: "jobDescription" });
}

function closeDelete() {
  window.localStorage.removeItem("resumeId");
  isDeleted.value = false;
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in titles" :key="item.id">
            <td class="text-left">{{ item.title }}</td>
            <td class="text-right">
              <v-btn rounded variant="text" @click="navigateToView(item.id)"> View </v-btn>
              <v-btn rounded variant="text" @click="compareToJobDesc(item.id)"> AI Feedback </v-btn>
              <v-btn rounded variant="text" @click="openDelete(item.id)"> Delete </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog persistent v-model="isDeleted" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="text-center headline mb-2">Delete Resume?</v-card-title>
          <v-text align="center">You will be unable to retrieve this resume once deleted!</v-text>

          <v-card-actions>
            <v-btn variant="flat" color="primary" @click="deleteResume()">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeDelete()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
      @update:show="value => snackbarValue = value"></Snackbar>

    </div>
  </v-container>
</template>