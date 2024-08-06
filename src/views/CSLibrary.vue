<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";

const router = useRouter();
const account = ref(null);
const userInfo = ref();

const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text){
  snackbarValue.value = true;
  snackbarColor.value = color;
  snackbarText.value = text;
}

onMounted(async () => {
  localStorage.removeItem("selectedUser");
  localStorage.removeItem("previousPage");
  localStorage.removeItem("resumeId");
  account.value = JSON.parse(localStorage.getItem("account"));
  await getUsers();
});

//Grab all User Info
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

//Navigate to View Page
function navigateToView(itemId) {
  window.localStorage.setItem("selectedUser", JSON.stringify(itemId));
  window.localStorage.setItem("previousPage", "cslibrary");
  router.push({ name: "studentresumeslist" });
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
              Students
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in userInfo" :key="item.id">
            <td class="text-left" v-if="item.roleId === 3">{{ item.firstName }}</td>
            <td class="text-left" v-if="item.roleId === 3">{{ item.lastName }}</td>
            <td class="text-right" v-if="item.roleId === 3">
              <v-btn rounded variant="text" @click="navigateToView(item)"> View Resumes</v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
      @update:show="value => snackbarValue = value"></Snackbar>

    </div>
  </v-container>
</template>