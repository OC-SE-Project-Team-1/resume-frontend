<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";

const router = useRouter();
const account = ref(null);
const userId = ref();
const isDeleted = ref(false);
const isUserUpdate = ref(false);
const currentRole = ref(null);
const userRole = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const userInfo = ref();
const roles = ref({
  1: "Administrator",
  2: "Career Services",
  3: "Student"
});

onMounted(async () => {
  localStorage.removeItem("selectedUser");
  localStorage.removeItem("previousPage");
  localStorage.removeItem("resumeId");
  account.value = JSON.parse(localStorage.getItem("account"));
  await getUsers();
});

function makeSnackbar(color, text){
    snackbar.value.value = true;
    snackbar.value.color = color;
    snackbar.value.text = text;
}

async function getUsers() {
  await UserServices.getUsers()
    .then((response) => {
      userInfo.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

//Navigate to Different Pages
function navigateToView(itemId) {
  window.localStorage.setItem("selectedUser", JSON.stringify(itemId));
  window.localStorage.setItem("previousPage", "admin");
  router.push({ name: "studentresumeslist" });
}

//Delete Story
async function deleteUser() {
  await UserServices.deleteAccount(userId.value, account.value.id)
  .then(() => {
      getUsers();
      localStorage.removeItem("userId");
      isDeleted.value = false;
      makeSnackbar("green", "User Deleted!")
      router.push({ name: "admin" });
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
  isDeleted.value = false;
}
//Change User Role
async function changeUserRole() {
  await UserServices.updateAccountRole(account.value.id, userId.value, parseInt(userRole.value))
    .then(() => {
      getUsers();
      localStorage.removeItem("userId");
      isUserUpdate.value = false;
      makeSnackbar("green", "User Role Updated!")
      router.push({ name: "admin" });
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
  isUserUpdate.value = false;
}

function openDelete(itemId) {
  window.localStorage.setItem("userId", JSON.stringify(itemId));
  userId.value = JSON.parse(localStorage.getItem("userId"));
  isDeleted.value = true;
}

function openUserUpdate(itemId, roleId) {
  window.localStorage.setItem("userId", JSON.stringify(itemId));
  userId.value = JSON.parse(localStorage.getItem("userId"));
  currentRole.value = String(roleId);
  userRole.value = String(roleId);
  isUserUpdate.value = true;
}

function closeUserUpdate() {
  localStorage.removeItem("userId");
  isUserUpdate.value = false;
}
function closeDelete() {
  localStorage.removeItem("userId");
  isDeleted.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
      <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"><v-card-title class="pl-0 text-h4 font-weight-bold">Student Users Library
          </v-card-title>
        </v-col>
      </v-row>
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
          <tr v-for="item in userInfo" :key="item.id">
            <td class="text-left" v-if="item.id !== account.id && item.id !== 1">{{ item.firstName }}</td>
            <td class="text-left" v-if="item.id !== account.id && item.id !== 1">{{ item.lastName }}</td>
            <td class="text-left" v-if="item.id !== account.id && item.id !== 1">{{ item.email }}</td>
            <td class="text-left" v-if="item.id !== account.id && item.id !== 1">{{ roles[item.roleId] }}</td>
            <td class="text-right" v-if="item.id !== account.id && item.id !== 1">
              <v-btn rounded variant="text" @click="openUserUpdate(item.id, item.roleId)"> Change Role </v-btn>
              <v-btn rounded variant="text" @click="navigateToView(item)"> View Resumes</v-btn>
              <v-btn rounded variant="text" @click="openDelete(item.id)"> Delete </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog persistent v-model="isUserUpdate" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="text-center headline mb-2">Change User Role?</v-card-title>
          <div class="d-flex align-center flex-column pa-6">
          <v-btn-toggle v-model="userRole" variant="outlined" divided>
            <v-btn value="3">Student</v-btn>
            <v-btn value="2">Career Services</v-btn>
            <v-btn value="1">Admin</v-btn>
          </v-btn-toggle>
        </div>
          <v-card-actions>
            <v-btn variant="flat" color="primary" :disabled="userRole === currentRole" @click="changeUserRole()">Confirm</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeUserUpdate()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent v-model="isDeleted" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="text-center headline mb-2">Delete User?</v-card-title>
          <v-text align="center">This user and all of their content will be deleted!</v-text>

          <v-card-actions>
            <v-btn variant="flat" color="primary" @click="deleteUser()">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeDelete()">Close</v-btn>
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
