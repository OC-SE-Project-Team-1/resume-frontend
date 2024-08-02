<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
function makeSnackbar(color, text){
    snackbar.value.value = true;
    snackbar.value.color = color;
    snackbar.value.text = text;
}
const account = ref({
  userName: "",
  password: "",
});

onMounted(async () => {
  localStorage.removeItem("account");
});

//Go to Different Pages
function navigateToSignUp() {
  router.push({ name: "signup" });
}

//Login To Account
async function login() {
  await UserServices.loginUser(account)
    .then((data) => {
      window.localStorage.setItem("account", JSON.stringify(data.data));
      makeSnackbar("green", "Login Sucessful!")
      router.push({ name: "home" });
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<script>
export default {
  data() {
    return {
      show1: false,
      show2: true,
    }
  },
}
</script>

<template>
  <v-container style="width: 50%;">
    <div id="body">
      <form name="login-form">
        <div class="mb-3">
          <v-card-title class="headline mb-2" align="center">Sign In </v-card-title>
        </div>

        <div class="mb-3">
          <label for="username">Username: </label>
          <v-text-field v-model="account.userName" label="JohnDoe" required></v-text-field>
        </div>

        <div class="mb-3">
          <label for="password">Password: </label>
          <v-text-field v-model="account.password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'" label="*************" required
            @click:append="show1 = !show1"></v-text-field>
        </div>

        <div align="center">
          <v-btn variant="flat" color="primary" @click="login()">Login</v-btn>
          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>

          <div class="mb-3">
            <label for="signup"> New User? </label>
          </div>
          <v-btn variant="flat" color="secondary" @click="navigateToSignUp()">Sign Up</v-btn>
        </div>
      </form>

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
