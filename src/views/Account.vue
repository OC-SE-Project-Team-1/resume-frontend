<script setup>
import { onMounted } from "vue";
import { ref, toRaw, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from 'vuetify'
import UserServices from "../services/UserServices";

import CharacterNameServices from "../services/CharacterNameServices.js";
import CharacterRoleServices from "../services/CharacterRoleServices.js";
import GenreServices from "../services/GenreServices.js";
import TimeServices from "../services/TimePeriodServices.js";
import LocationServices from "../services/LocationServices.js";

const router = useRouter();
const account = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const isAccountEditable = ref(false);
const isDark = ref();

const newUsername = ref();
const newEmail = ref();

const characterName = ref();
const selectedExperience = ref(null);
const characterRole = ref();
const selectedEducation = ref(null);
const genre = ref();
const selectedSkill = ref(null);
const time = ref();
const selectedTime = ref(null);
const location = ref();
const selectedLocation = ref(null);

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  theme.global.name.value = JSON.parse(localStorage.getItem("darkMode"));
  newUsername.value = account.value.userName;
  newEmail.value = account.value.email;

  await getTheme();
  await getCharacterNames();
  await getCharacterRoles();
  await getGenres();
  await getTimes();
  await getLocations();
});

function closeSnackBar() {
  snackbar.value.value = false;
}

//Grab all Characacter Names 
async function getCharacterNames() {
  await CharacterNameServices.getcharacterNameForUser(account.value.id)
    .then((response) => {
      characterName.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Grab all Characacter Roles 
async function getCharacterRoles() {
  await CharacterRoleServices.getcharacterRoleForUser(account.value.id)
    .then((response) => {
      characterRole.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Grab all Genres 
async function getGenres() {
  await GenreServices.getgenreForUser(account.value.id)
    .then((response) => {
      genre.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Grab all Times 
async function getTimes() {
  await TimeServices.gettimePeriodForUser(account.value.id)
    .then((response) => {
      time.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Grab all Locations
async function getLocations() {
  await LocationServices.getlocationForUser(account.value.id)
    .then((response) => {
      location.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Delete Selected Character Name
async function deleteExpValue(input) {
  if (!isDefault(input)) {
    await CharacterNameServices.deletecharacterName(input.id, account.value.id)
      .then(() => {
        getCharacterNames();
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Name Deleted";
        router.push({ name: "account" });
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }

}

//Delete Selected Character Role
async function deleteEducation(input) {
  if (!isDefault(input)) {
    await CharacterRoleServices.deletecharacterRole(input.id, account.value.id)
      .then(() => {
        getCharacterRoles();
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Name Deleted";
        router.push({ name: "account" });
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }

}

//Delete Selected Genre
async function deleteSkill(input) {
  if (!isDefault(input)) {
    await GenreServices.deleteSkill(input.id, account.value.id)
      .then(() => {
        getGenres();
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Genre Deleted";
        router.push({ name: "account" });
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }

}

//Delete Selected Time
async function deleteTime(input) {
  if (!isDefault(input)) {
    await TimeServices.deletetimePeriod(input.id, account.value.id)
      .then(() => {
        getTimes();
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Time Deleted";
        router.push({ name: "account" });
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }

}

//Delete Selected Location
async function deleteLocation(input) {
  if (!isDefault(input)) {
    console.log(account.value.id);
    console.log(input.id);
    await LocationServices.deletelocation(input.id, account.value.id)
      .then(() => {
        getLocations();
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Location Deleted";
        router.push({ name: "account" });
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }
}

//Add Character Name
async function addExpValue() {
  await CharacterNameServices.addExpValue(selectedExperience.value, account.value.id)
    .then(() => {
      getCharacterNames();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Name Added";
      router.push({ name: "account" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

}

//Add Character Role
async function addEducation() {
  await CharacterRoleServices.addEducation(selectedEducation.value, account.value.id)
    .then(() => {
      getCharacterRoles();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Role Added";
      router.push({ name: "account" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Add Genre
async function addSkill() {
  await GenreServices.addSkill(selectedSkill.value, account.value.id)
    .then(() => {
      getGenres();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Genre Added";
      router.push({ name: "account" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Add Time
async function addTime() {
  await TimeServices.addtimePeriod(selectedTime.value, account.value.id)
    .then(() => {
      getTimes();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Time Added";
      router.push({ name: "account" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Add Location
async function addLocation() {
  await LocationServices.addlocation(selectedLocation.value, account.value.id)
    .then(() => {
      getLocations();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Location Added";
      router.push({ name: "account" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Check if Value is Default
function isDefault(input) {

  if (input.userId === null) {
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = "Selected Value is a Default Value";
    return true;
  }
  else {
    return false;
  }
}

//Edit Account Name or Email
function editAccount() {
  isAccountEditable.value = !isAccountEditable.value;

  if (isAccountEditable.value == false &&
    newUsername.value !== account.value.userName &&
    newEmail.value !== account.value.email) {

    updateAccountUserEmail();
  }
  else if (isAccountEditable.value == false &&
    newUsername.value !== account.value.userName) {

    updateAccountUsername();
  }
  else if (isAccountEditable.value == false &&
    newEmail.value !== account.value.email) {

    updateAccountEmail();
  }
}

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


const theme = useTheme();
async function getTheme() {
  if (theme.global.name.value == 'LightTheme') {
    isDark.value = false;
  }
  else {
    isDark.value = true;
  }
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
  /* Adjust the value as needed */
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

    <v-expansion-panels style="width: 50%;">
      <v-expansion-panel>
        <v-expansion-panel-title>
          Account Settings
        </v-expansion-panel-title>

        <v-expansion-panel-text align="left" style="margin-left: 5%;">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="text" @click="editAccount()">
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
              <v-text for="character" class="headline mb-2">Email: </v-text>
            </v-col>
            <v-col>
              <v-text-field v-model="newEmail" :readonly="!isAccountEditable"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text for="character" class="headline mb-2">Phone Number: </v-text>
            </v-col>
            <v-col>
              <v-text-field v-model="newEmail" :readonly="!isAccountEditable"></v-text-field>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <div class="mb-10">
      <v-spacer></v-spacer>
    </div>

    <v-expansion-panels style="width:50%;">

      <v-expansion-panel>
        <v-expansion-panel-title>
          Database Settings
        </v-expansion-panel-title>

        <v-expansion-panel-text>

          <v-expansion-panels style="width: 75%;">

            <v-expansion-panel>

              <v-expansion-panel-title>
                Experience:
              </v-expansion-panel-title>


              <v-expansion-panel-text>
                <v-row>
                  <v-col>

                    <v-list>
                      <v-list-item v-for="name in characterName" :key="name.id">

                        <v-row margin="align-center">
                          <v-col md="8"><v-list-item-title>{{ name.name }}</v-list-item-title> </v-col>
                          <v-col cols="1">
                            <v-icon icon="mdi-trash-can" @click="deleteExpValue(name)"></v-icon>
                          </v-col>
                        </v-row>

                      </v-list-item>

                    </v-list>

                  </v-col>
                </v-row>


                <v-row style="width: 75%;">
                  <v-text-field label="New Name" v-model="selectedExperience">

                  </v-text-field>
                </v-row>
                <v-row>
                  <v-col align="right">
                    <v-btn color="primary" variant="text" @click="addExpValue()">
                      Add
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>


            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>

        <v-expansion-panel-text>

          <v-expansion-panels style="width: 75%;">

            <v-expansion-panel>

              <v-expansion-panel-title>
                Education:
              </v-expansion-panel-title>


              <v-expansion-panel-text>
                <v-row>
                  <v-col>

                    <v-list>
                      <v-list-item v-for="role in characterRole" :key="role.id">

                        <v-row>
                          <v-col md="8"><v-list-item-title>{{ role.name }}</v-list-item-title> </v-col>
                          <v-col cols="1">
                            <v-icon icon="mdi-trash-can" @click="deleteEducation(role)"></v-icon>
                          </v-col>
                        </v-row>

                      </v-list-item>

                    </v-list>


                  </v-col>
                </v-row>


                <v-row style="width: 75%;">
                  <v-text-field label="New Role" v-model="selectedEducation">

                  </v-text-field>
                </v-row>
                <v-row>
                  <v-col align="right">
                    <v-btn color="primary" variant="text" @click="addEducation()">
                      Add
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>


            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>

        <v-expansion-panel-text>

          <v-expansion-panels style="width: 75%;">

            <v-expansion-panel>

              <v-expansion-panel-title>
                Skills:
              </v-expansion-panel-title>


              <v-expansion-panel-text>
                <v-row>
                  <v-col>

                    <v-list>
                      <v-list-item v-for="g in genre" :key="g.id">

                        <v-row>
                          <v-col md="8"><v-list-item-title>{{ g.name }}</v-list-item-title> </v-col>
                          <v-col cols="1">
                            <v-icon icon="mdi-trash-can" @click="deleteSkill(g)"></v-icon>
                          </v-col>
                        </v-row>

                      </v-list-item>

                    </v-list>


                  </v-col>
                </v-row>


                <v-row style="width: 75%;">
                  <v-text-field label="New Genre" v-model="selectedSkill">

                  </v-text-field>
                </v-row>
                <v-row>
                  <v-col align="right">
                    <v-btn color="primary" variant="text" @click="addSkill()">
                      Add
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>


            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>


<!--
        <v-expansion-panel-text>

          <v-expansion-panels style="width: 75%;">

            <v-expansion-panel>

              <v-expansion-panel-title>
                Time:
              </v-expansion-panel-title>


              <v-expansion-panel-text>
                <v-row>
                  <v-col>

                    <v-list>
                      <v-list-item v-for="t in time" :key="t.id">

                        <v-row>
                          <v-col md="8"><v-list-item-title>{{ t.name }}</v-list-item-title> </v-col>
                          <v-col cols="1">
                            <v-icon icon="mdi-trash-can" @click="deleteTime(t)"></v-icon>
                          </v-col>
                        </v-row>

                      </v-list-item>

                    </v-list>

                  </v-col>
                </v-row>


                <v-row style="width: 75%;">
                  <v-text-field label="New Time" v-model="selectedTime">

                  </v-text-field>
                </v-row>
                <v-row>
                  <v-col align="right">
                    <v-btn color="primary" variant="text" @click="addTime()">
                      Add
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>


            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>


        <v-expansion-panel-text>

          <v-expansion-panels style="width: 75%;">

            <v-expansion-panel>

              <v-expansion-panel-title>
                Location:
              </v-expansion-panel-title>


              <v-expansion-panel-text>
                <v-row>
                  <v-col>

                    <v-list>
                      <v-list-item v-for="l in location" :key="l.id">

                        <v-row>
                          <v-col md="8"><v-list-item-title>{{ l.location }}</v-list-item-title> </v-col>
                          <v-col cols="1">
                            <v-icon icon="mdi-trash-can" @click="deleteLocation(l)"></v-icon>
                          </v-col>
                        </v-row>

                      </v-list-item>

                    </v-list>


                  </v-col>
                </v-row>


                <v-row style="width: 75%;">
                  <v-text-field label="New Location" v-model="selectedLocation">

                  </v-text-field>
                </v-row>
                <v-row>
                  <v-col align="right">
                    <v-btn color="primary" variant="text" @click="addLocation()">
                      Add
                    </v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            

            </v-expansion-panel>
          </v-expansion-panels>
        </v-expansion-panel-text>
      -->


      </v-expansion-panel>
    </v-expansion-panels>

    <div class="mb-10">
      <v-spacer></v-spacer>
    </div>


    <v-expansion-panels style="width: 50%;">
      <v-expansion-panel>
        <v-expansion-panel-title>
          Personal Settings
        </v-expansion-panel-title>
        <v-expansion-panel-text>

          <v-row>
          <v-col>
            <v-switch
              color="primary"
              label="Dark mode"
              hide-details
            ></v-switch>
          </v-col>
        </v-row>

        </v-expansion-panel-text>
       
        
        </v-expansion-panel>
    </v-expansion-panels>

  </div>

  <v-snackbar v-model="snackbar.value" rounded="pill">
    {{ snackbar.text }}

    <template v-slot:actions>
      <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
