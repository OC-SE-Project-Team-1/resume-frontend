<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
// import StoryExport from "../reports/StoryExport";

const router = useRouter();
const account = ref(null);
const content = ref(null);
const title = ref(null);
const selectedUser = ref(null);
const isExport = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const name = ref("");

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  selectedUser.value = JSON.parse(localStorage.getItem("selectedUser"));
  name.value = selectedUser.value.firstName + " " + selectedUser.value.lastName + " " + "Resumes";
});

//Navigate to Different Pages
function navigateToView() {
  router.push({ name: "csresumeview" });
}

function navigateToCSLibrary() {
  router.push({ name: "cslibrary" })
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
      <v-card-title class="text-center headline mb-2">{{ name }}</v-card-title>
      <v-col class="text-right">
              <v-btn color="secondary" @click="navigateToCSLibrary()"> Back </v-btn>
      </v-col>
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
            </td>
          </tr>
          <tr>
            <td class="text-left">Resume2</td>
            <td class="text-right">
              <v-btn rounded variant="text" @click="navigateToView()"> View </v-btn>
              <v-btn rounded variant="text" @click="openExport()"> Export </v-btn>
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
