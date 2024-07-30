<script setup>
import ftLogo from "/rain-logo.png";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import { useTheme } from 'vuetify'

const router = useRouter();
const account = ref(null);
const title = ref("The R.A.I.N.");
const logoURL = ref("");
const theme = useTheme();
const accountData = ref(null);
const isDark = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  logoURL.value = ftLogo;
  account.value = JSON.parse(localStorage.getItem("account"));
  

  if (account.value !== null) {
    await getAccount();
    console.log("Account is logged in");
    console.log(accountData.value);
    console.log(isDark.value);

    if (accountData.value.darkMode === true) {
      theme.global.name.value = 'DarkTheme';
    }
    else {
      theme.global.name.value = 'LightTheme';
    }
  }
  else {
    
    console.log("Account isn't logged in");
    console.log(accountData.value);

    if (JSON.parse(localStorage.getItem("darkMode") === null)) {
    theme.global.name.value = 'LightTheme';
    window.localStorage.setItem("darkMode", JSON.stringify(theme.global.name.value));
    }
    else {
      theme.global.name.value = JSON.parse(localStorage.getItem("darkMode"));
    }
  }

});

async function getAccount() {
  await UserServices.getUser(account.value.id)
  .then((response) => {
      accountData.value = response.data;
      isDark.value = response.data.darkMode; 
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function navigateToAccountSettings() {
  router.push({ name: "account" });
}

function logout() {
  UserServices.logoutUser()
    .then((data) => {
      console.log(data);
      router.push({ name: "home" });
    })
    .catch((error) => {
      console.log(error);
    });
  localStorage.removeItem("account");
  localStorage.removeItem("resumeId");
  localStorage.removeItem("selectedUser");
  localStorage.removeItem("previousPage");
  account.value = null;
  location.reload();

}

function toggleTheme() {

  theme.global.name.value = theme.global.current.value.dark ? 'LightTheme' : 'DarkTheme';

  if (account.value !== null) {

    if (theme.global.name.value === 'LightTheme') {
      isDark.value = false;
    }
    else {
      isDark.value = true;
    }

    updateDarkMode();

  }
  else {
  
    window.localStorage.setItem("darkMode", JSON.stringify(theme.global.name.value));

  }

}

async function updateDarkMode() {
  await UserServices.updateDarkMode(account.value.id, isDark.value)
  .then ((response) => {
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

</script>

<template>
  <div>
    <v-app-bar color="primary">
      <router-link :to="{ name: 'home' }">
        <v-img class="mx-2" :src="logoURL" height="50" width="50" contain></v-img>
      </router-link>
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu v-if="account !== null" min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar class="mx-auto text-center" color="accent" size="large">
              <span class="white--text font-weight-bold">{{
                `${account.userName[0]}`
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="accent">
                <span class="white--text text-h5">{{
                  `${account.userName[0]}`
                }}</span>
              </v-avatar>
              <h3>{{ `${account.userName}` }}</h3>
              <p class="text-caption mt-1">
                {{ account.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="navigateToAccountSettings()"> Account Settings </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
  <div>
    <v-app-bar color="secondary">
      <v-btn class="mx-2" :to="{ name: 'home' }">
        Home
      </v-btn>
      <!-- v-if="account !== null" -->
      <v-btn v-if="account !== null" class="mx-2" :to="{ name: 'library' }">
        Library
      </v-btn>
      <v-btn v-if="account !== null" class="mx-2" :to="{ name: 'createResume' }">
        Create Resume
      </v-btn>
      <v-btn v-if="account !== null && parseInt(account.roleId) !== 3" class="mx-2" :to="{ name: 'cslibrary' }">
        Student Library
      </v-btn>
      <v-btn v-if="account !== null && parseInt(account.roleId) === 1" class="mx-2" :to="{ name: 'admin' }">
        Admin
      </v-btn>
      <v-spacer></v-spacer>

      <v-tooltip text="Toggle Light/Dark Mode">
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" v-bind="props"> </v-btn>
        </template>
      </v-tooltip>
      <v-btn v-if="account === null" class="mx-2" :to="{ name: 'login' }">
        Sign In
      </v-btn>
    </v-app-bar>
  </div>
</template>
