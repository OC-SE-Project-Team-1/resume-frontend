<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import UserServices from "../services/UserServices";
import Snackbar from "../components/Snackbar.vue";

const account = ref(null);
const valid = ref(false);
const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text){
  snackbarValue.value = true;
  snackbarColor.value = color;
  snackbarText.value = text;
}

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
      makeSnackbar(true, "error", error.response.data.message)
    });
}

//Edit Account Name or Email
function editAccount() {
  isAccountEditable.value = !isAccountEditable.value;

  if (isAccountEditable.value == false) {

    updateAccount();
  }
}

// disables/enable save button when changing password
const isReadPass = computed(() => {
  return (
    checkbox1.value === true &&
    newPassword.value !== "" &&
    confirmPassword.value !== "" &&
    valid.value === true
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
  confirmPassword.value = null;
  checkbox1.value = false;
}

async function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
  makeSnackbar("error", "Passwords do not match")
  }
  else {
      await UserServices.updatePassword(account.value.id,newPassword.value)
  .then(() => {
      makeSnackbar("green", "Password Updated!")
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });  
    closeChangePasswordDialog();
  }


}

async function updateAccount() {
  await UserServices.updateAccount(account.value.id, newUsername.value, newEmail.value, newFirstName.value, newLastName.value, newAddress.value, newPhoneNumber.value)
  .then((response) => {
      makeSnackbar("green", "Account updated!")
      accountData.value.token = JSON.parse(localStorage.getItem("account")).token //keep token
      window.localStorage.setItem("account", JSON.stringify(accountData.value));
      account.value = JSON.parse(localStorage.getItem("account"));
      window.location.reload(true)
    })
    .catch((error) => {
      console.log(error);
      makeSnackbar("error", error.response.data.message)
    });
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

  <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
  @update:show="value => snackbarValue = value"></Snackbar>

  <v-dialog v-model="changePasswordDialog" persistent>
<v-form ref="form" v-model="valid">

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
</v-form>
  </v-dialog>

</template>
