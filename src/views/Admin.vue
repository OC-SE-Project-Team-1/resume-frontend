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
const isUserUpdate = ref(false);
const userRole = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  await getUsers();
});

async function getUsers() {
  // await CreateStoryServices.getOneStory(storyId.value)
  //   .then((response) => {
  //     title.value = response.data.title;
  //     content.value = response.data.story;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     snackbar.value.value = true;
  //     snackbar.value.color = "error";
  //     snackbar.value.text = error.response.data.message;
  //   });
}

//Navigate to Different Pages
function navigateToView() {
  router.push({ name: "studentresumeslist" });
}

//Delete Story
async function changeUserRole() {
  // await CreateStoryServices.deleteStory(storyId.value, account.value.id)
  //   .then(() => {
  //     getTitles();
  //     localStorage.removeItem("storyId");
  //     isDeleted.value = false;
  //     snackbar.value.value = true;
  //     snackbar.value.color = "green";
  //     snackbar.value.text = "Story Deleted!";
  //     router.push({ name: "library" });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     snackbar.value.value = true;
  //     snackbar.value.color = "error";
  //     snackbar.value.text = error.response.data.message;
  //   });
  isUserUpdate.value = false;
}

function openUserUpdate() {
  isUserUpdate.value = true;
}

function closeUserUpdate() {
  isUserUpdate.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card-title class="text-center headline mb-2">Student Name Resumes</v-card-title>

      <v-table fixed-header>
        <thead>
          <tr>
            <th class="text-left">
              First Name
            </th>
            <th class="text-left">
              Last Name
            </th>
            <th class="text-left">
              email
            </th>
            <th class="text-left">
              Role
            </th>
            <th class="text-right"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">First</td>
            <td class="text-left">Last</td>
            <td class="text-left">email</td>
            <td class="text-left">Student</td>
            <td class="text-right">
              <v-btn rounded variant="text" @click="openUserUpdate()"> Change Role </v-btn>
              <v-btn rounded variant="text" @click="navigateToView()"> View Resumes </v-btn>
            </td>
          </tr>
          <tr>
            <td class="text-left">First</td>
            <td class="text-left">Last</td>
            <td class="text-left">email</td>
            <td class="text-left">Career Service</td>
            <td class="text-right">
              <v-btn rounded variant="text" @click="openUserUpdate()"> Change Role </v-btn>
              <v-btn rounded variant="text" @click="navigateToView()"> View Resumes </v-btn>
            </td>
          </tr>

          <!-- <tr v-for="item in titles" :key="item.id">
            <td class="text-left">{{ item.title }}</td>
            <td class="text-right">
              <v-btn rounded variant="text" @click="navigateToView(item.id)"> View </v-btn>
              <v-btn rounded variant="text" @click="openUserUpdate(item.id)"> Export </v-btn>
              <v-btn rounded variant="text" @click="openDelete(item.id)"> Delete </v-btn>
            </td>
          </tr> -->
        </tbody>
      </v-table>

      <v-dialog persistent v-model="isUserUpdate" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="text-center headline mb-2">Change User Role?</v-card-title>
          <div class="d-flex align-center flex-column pa-6">
          <v-btn-toggle v-model="userRole" variant="outlined" divided>
            <v-btn>Student</v-btn>
            <v-btn>Career Services</v-btn>
            <v-btn>Admin</v-btn>
          </v-btn-toggle>
        </div>
          <v-card-actions>
            <v-btn variant="flat" color="primary" @click="changeUserRole()">Confirm</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeUserUpdate()">Close</v-btn>
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
