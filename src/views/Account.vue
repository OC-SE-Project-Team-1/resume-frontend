<script setup>
import { computed, onMounted } from "vue";
import { ref, toRaw, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from 'vuetify'
import UserServices from "../services/UserServices";


const account = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const isAccountEditable = ref(false);

const accountData = ref(null);

const changePasswordDialog = ref(false);
const checkbox1 = ref(false);

onMounted(async () => {

  account.value = JSON.parse(localStorage.getItem("account"));
  await getAccount();
  await populateAccount();


});

async function populateAccount(){
  newUsername.value = accountData.value.userName;
  newPassword.value = "";
  newEmail.value = accountData.value.email;
  newFirstName.value = accountData.value.firstName;
  newLastName.value = accountData.value.lastName;
  newAddress.value = accountData.value.address;
  newPhoneNumber.value = accountData.value.phoneNumber;
}

async function getAccount() {
  await UserServices.getUser(account.value.id)
    .then((response) => {
      accountData.value = response.data;
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

//Edit Account Name or Email
function editAccount() {
  isAccountEditable.value = !isAccountEditable.value;

  if (isAccountEditable.value == false) {

    updateAccount();
  }
  
}

/*
//Edit Account Username and Email
async function updateAccountUserEmail() {
  await UserServices.updateAccount(account.value.id, newUsername.value, newEmail.value)
    .then((response) => {
      updateAccount();
      console.log(response);
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Username and Email Updated";
      router.push({ name: "account" });
    })
    .catch((error) => {

      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Edit Account Username
async function updateAccountUsername() {
  await UserServices.updateUsername(account.value.id, newUsername.value)
    .then((response) => {
      updateAccount();
      console.log(response);
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Username Updated";
      router.push({ name: "account" });
    })
    .catch((error) => {

      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Edit Account Email
async function updateAccountEmail() {
  await UserServices.updateEmail(account.value.id, newEmail.value)
    .then((response) => {
      updateAccount();
      console.log(response);
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Email Updated";
      router.push({ name: "account" });
    })
    .catch((error) => {

      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Save Account Changes and Update Visuals
async function updateAccount() {
  await UserServices.getUser(account.value.id)
    .then((response) => {
      response.data.token = JSON.parse(localStorage.getItem("account")).token
      console.log(JSON.parse(localStorage.getItem("account")).token)

      window.localStorage.setItem("account", JSON.stringify(response.data));
      account.value = JSON.parse(localStorage.getItem("account"));
      window.location.reload();
    })
    .catch((error) => {

      console.log(error);
    });
}
    */




// disables/enable save button when changing password
const isReadPass = computed(() => {
  return (
    checkbox1.value === true &&
    newPassword.value !== "" &&
    confirmPassword.value !== ""
  )
});

//Password Rules for length of password
const passwordRules = [
  v => !!v || 'Password is required',
  v => (v && v.length >= 8 && v.length <= 16) || 'Password must be between 8-16 characters'
];

// checks if both textboxes match each other to confirm password
const confirmPasswordRules = computed(() => [
  v => !!v || 'Confirm Password is required',
  v => v === newPassword.value || 'Passwords must match'
]);


// LIN'S SECTION AND VARIABLES THAT IS PROB WHAT HE NEEDS

const newUsername = ref();
const newPassword = ref();
const newEmail = ref();
const newFirstName = ref();
const newLastName = ref();
const newAddress = ref();
const newPhoneNumber = ref();

//dw about this one
const confirmPassword = ref();

// opens change password dialog
function openChangePasswordDialog() {
  changePasswordDialog.value = true;
}

//closes change password dialog
function closeChangePasswordDialog() {
  changePasswordDialog.value = false;
  newPassword.value = null;
  checkbox1.value = false;
}

function changePassword() {

  TODO: //ADD IN THE LOGICS FOR CHANGE PASSWORD FUNCTION
  closeChangePasswordDialog();
}

function updateAccount() {


  TODO: //ADD IN LOGICS FOR UPDATED ACCOUNT

  closeChangePasswordDialog();
}






</script>

<script>
export default {
  data() {
    return {
      show1: false,
      show2: true,
      password: 'Password',
      dialog: false,
    }
  },
  data: () => ({
    items: ['Short', 'Medium', 'Long'],
    value: 'Medium',
    tempMessage: 'hi'
  }),


}
</script>

<style>
.panel-wrapper {
  margin-bottom: 1rem;
}
</style>

<template>
  <v-container>
    <div id="body">
      <div class="mb-3">
        <v-card-title class="pl-0 text-h4 font-weight-bold">Account
        </v-card-title>
      </div>
    </div>
  </v-container>
  <div id="body" align="center">

    <v-container>
      <title>
        Account Settings
      </title>

      
      <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="isAccountEditable" @click="isAccountEditable = false; populateAccount(); ">Cancel</v-btn>
            <v-btn variant="text" @click="editAccount()">
              {{ isAccountEditable ? 'Save' : 'Edit' }}
            </v-btn>
          </v-card-actions>

          <v-row>
            <v-col cols="2">
              <v-text for="character" class="headline mb-2">Username: </v-text>
            </v-col>
            <v-col>
              <v-text-field v-model="newUsername" :readonly="!isAccountEditable"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text for="character" class="headline mb-2">Password: </v-text>
            </v-col>
            <v-col>
              <v-row>
                <v-btn 
                variant="tonal" v-if="isAccountEditable" @click="openChangePasswordDialog"> Change Password </v-btn>
              </v-row>

            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text for="character" class="headline mb-2">Email: </v-text>
            </v-col>
            <v-col>
              <v-text-field v-model="newEmail" :readonly="!isAccountEditable"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text for="character" class="headline mb-2">First Name: </v-text>
            </v-col>
            <v-col>
              <v-text-field v-model="newFirstName" :readonly="!isAccountEditable"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text for="character" class="headline mb-2">Last Name: </v-text>
            </v-col>
            <v-col>
              <v-text-field v-model="newLastName" :readonly="!isAccountEditable"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text for="character" class="headline mb-2">Address: </v-text>
            </v-col>
            <v-col>
              <v-text-field v-model="newAddress" :readonly="!isAccountEditable"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text for="character" class="headline mb-2">Phone Number: </v-text>
            </v-col>
            <v-col>
              <v-text-field v-model="newPhoneNumber" :readonly="!isAccountEditable"></v-text-field>
            </v-col>
          </v-row>

    </v-container>

  </div>

  <v-snackbar v-model="snackbar.value" rounded="pill">
    {{ snackbar.text }}

    <template v-slot:actions>
      <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>

  <v-dialog v-model="changePasswordDialog" persistent>

    <v-card>
      <v-card-title>
        <span class="headline">Change Password?</span>
      </v-card-title>
      <v-card-text>
        <div class="mb-3">
          <label for="password">Password: </label>
          <v-text-field v-model="newPassword" :rules="passwordRules" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'" label="Password" hint="8-16 characters" required
            @click:append="show1 = !show1">
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
        <v-checkbox v-model="checkbox1" required
          :label="`I understand that I will be changing the password`"></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeChangePasswordDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="changePassword" :disabled="!isReadPass">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
