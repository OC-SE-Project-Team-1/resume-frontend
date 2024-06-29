<script setup>
import { onMounted } from "vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const router = useRouter();
const confirmPassword = ref('');
const valid = ref(false);
const userRole = ref(null);
const verifyRoleCode = ref("");

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const account = ref({
  userName: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: ""
});

const allFilled = computed(() => {
  console.log(allFilled);
  console.log(account);
  console.log(userRole.value);
  console.log(verifyRoleCode.value);
  return (
    // account.userName.value !== null &&
    (userRole.value === 'student' || 
    (userRole.value !== 'student' && 
    verifyRoleCode.value !== "")) 
  )
})

//Password Rules
const passwordRules = [
  v => !!v || 'Password is required',
  v => (v && v.length >= 8 && v.length <= 16) || 'Password must be between 8-16 characters'
];

const confirmPasswordRules = computed(() => [
  v => !!v || 'Confirm Password is required',
  v => v === account.value.password || 'Passwords must match'
]);


onMounted(async () => {
  localStorage.removeItem("account");
});

function navigateToLogin() {
  router.push({ name: "login" });
}

//Create Account
async function createAccount() {
  await UserServices.addUser(account.value)
    .then((data) => {
      window.localStorage.setItem("account", JSON.stringify(data.data));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Account created successfully!";
      router.push({ name: "home" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
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
      user: {
        password: ''
      },
      show1: false,
      show2: true,
    }
  },
}
</script>

<style scoped>
.custom-hint {
  white-space: pre-line;
}
</style>

<template>
  <v-container style="width: 50%;">

    <v-form ref="form" v-model="valid">

      <div id="body">
        <form name="login-form">
          <div class="mb-3">
            <v-card-title class="headline mb-2" align="center">Sign Up </v-card-title>
          </div>

          <div class="mb-3">
            <label for="firstname">First Name: </label>
            <v-text-field v-model="account.firstName" label="John" required></v-text-field>
          </div>
          <div class="mb-3">
            <label for="lastname">Last Name: </label>
            <v-text-field v-model="account.lastName" label="Doe" required></v-text-field>
          </div>

          <div class="mb-3">
            <label for="email">Email: </label>
            <v-text-field v-model="account.email" label="j.doe@gmail.com" required></v-text-field>
          </div>

          <div class="mb-3">
            <label for="phonenumber">Phone Number: </label>
            <v-text-field v-model="account.phoneNumber" label="(555)555-5555" required hint="Input Phone Number as Shown">
            </v-text-field>
          </div>

          <div class="mb-3">
            <label for="username">Username: </label>
            <v-text-field v-model="account.userName" label="JohnDoe" required></v-text-field>
          </div>

          <div class="mb-3">
            <label for="password">Password: </label>
            <v-text-field v-model="account.password" :rules="passwordRules"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" label="Password"
              hint="8-16 characters" required @click:append="show1 = !show1">
              <template v-slot:message>
                <div class="custom-hint">
                  8-16 characters<br>
                </div>
              </template>
            </v-text-field>
          </div>

          <div class="mb-3">
            <label for="password">Confirm Password: </label>
            <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" :type="show1 ? 'text' : 'password'" label="Password"
              required @click:append="show1 = !show1"></v-text-field>
          </div>

          <div class="mb-3">
            <label for="userRole">Role: </label>
            <v-radio-group inline v-model="userRole">
            <v-radio label="Student" value="student"></v-radio>
            <v-radio label="Career Service" value="careerservice"></v-radio>
            <v-radio label="Admin" value="admin"></v-radio>
          </v-radio-group>
          </div>
          
          <div class="mb-3" v-show="userRole !== 'student' && userRole !== null">
            <label for="confirmRole">Enter Code: </label>
            <v-text-field v-model="verifyRoleCode" label="Code"></v-text-field>
          </div>

          <div align="center">
            <!-- :disabled="!allFilled" -->
            <v-btn variant="flat" color="primary" :disabled="!allFilled" @click="createAccount()">Sign Up</v-btn>
            <div class="mb-10">
              <v-spacer></v-spacer>
            </div>
            <v-btn variant="flat" color="secondary" @click="navigateToLogin()">Back to Sign In</v-btn>
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
    </v-form>
  </v-container>
</template>
