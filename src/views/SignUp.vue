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

const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text){
  snackbarValue.value = true;
  snackbarColor.value = color;
  snackbarText.value = text;
}

const account = ref({
  userName: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  address: "",
  roleId: userRole,
  darkMode: true //TODO: Get Dark Mode working Properly
});

const allFilled = computed(() => {
  console.log(allFilled);
  console.log(account);
  console.log(userRole.value);
  console.log(verifyRoleCode.value);
  return (
    account.value.address !== "" &&
    account.value.userName !== "" &&
    account.value.email !== "" &&
    account.value.password !== "" &&
    account.value.firstName !== "" &&
    account.value.lastName !== "" &&
    account.value.phoneNumber !== "" &&
    account.value.darkMode !== ""  &&
    valid.value === true &&
    (userRole.value === '3' || 
    (userRole.value === '2' && 
      verifyRoleCode.value === "services")|| 
    (userRole.value === '1' && 
      verifyRoleCode.value === "admin")) 
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


const message = ref("Passwords do not match");
//Create Account
async function createAccount() {
  console.log(account.value);

  if (account.value.password !== confirmPassword.value) {
    console.log(message);
      makeSnackbar("error", "Passwords do not match")
  } else {
  await UserServices.addUser(account.value)
    .then((data) => {
      window.localStorage.setItem("account", JSON.stringify(data.data));
      makeSnackbar("green", "Account created successfully!")
      router.push({ name: "home" });
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
  }
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
            <v-text-field v-model="account.phoneNumber" label="555-555-5555" required hint="Input Phone Number as Shown">
            </v-text-field>
          </div>

          <div class="mb-3">
            <label for="address">Address: </label>
            <v-text-field v-model="account.address" label="555 W. Street, Oklahoma City, OK 55555" required hint="Input Address as Shown">
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
            <v-radio-group inline v-model="userRole" >
            <v-radio label="Student" value="3"></v-radio>
            <v-radio label="Career Service" value="2"></v-radio>
            <v-radio label="Admin" value="1"></v-radio>
          </v-radio-group>
          </div>
          
          <div class="mb-3" v-if="userRole !== '3' && userRole !== null">
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

        <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
        @update:show="value => snackbarValue = value"></Snackbar>

      </div>
    </v-form>
  </v-container>
</template>
