<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ResumeServices from "../services/ResumeServices";

const router = useRouter();
const account = ref(null);
const titles = ref(null);
const selectedUser = ref(null);
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
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
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

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">{{ name }}
          </v-card-title>
        </v-col>
      </v-row>
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
