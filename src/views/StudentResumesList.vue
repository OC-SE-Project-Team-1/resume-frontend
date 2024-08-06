<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ResumeServices from "../services/ResumeServices";
import Snackbar from "../components/Snackbar.vue";

const router = useRouter();
const account = ref(null);
const titles = ref(null);
const selectedUser = ref(null);
const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text){
  snackbarValue.value = true;
  snackbarColor.value = color;
  snackbarText.value = text;
}

const name = ref("");

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  selectedUser.value = JSON.parse(localStorage.getItem("selectedUser"));
  name.value = selectedUser.value.firstName + " " + selectedUser.value.lastName + " " + "Resumes";
  await getResumes();
});

//Grab all Resumes
async function getResumes() {
  await ResumeServices.getResumesForUser(selectedUser.value.id)
    .then((response) => {
      titles.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

//Navigate to Different Pages
function navigateToView(itemId) {
  window.localStorage.setItem("resumeId", JSON.stringify(itemId));
  router.push({ name: "csresumeview" });
}

function navigateBack() {
  let previousPage = localStorage.getItem("previousPage");
  if (previousPage === "admin") {
    router.push({ name: previousPage })
  } else {
    router.push({ name: "cslibrary" });
  }
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-card-title class="text-center headline mb-2">{{ name }}</v-card-title>
      <v-col class="text-right">
              <v-btn color="secondary" @click="navigateBack()"> Back </v-btn>
      </v-col>
      <v-table fixed-header>
        <thead>
          <tr>
            <th class="text-left">
              Resumes
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in titles" :key="item.id" >
            <td v-if="item.editing" class="text-left">{{ item.title }}</td>
            <td v-if="item.editing" class="text-right">
              <v-btn v-if="item.editing" rounded variant="text" @click="navigateToView(item.id)"> View </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
      @update:show="value => snackbarValue = value"></Snackbar>

    </div>
  </v-container>
</template>
