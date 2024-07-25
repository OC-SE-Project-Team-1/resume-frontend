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
import ExperienceServices from "../services/ExperienceServices.js";
import EducationServices from "../services/EducationServices.js";
import SkillServices from "../services/SkillServices.js";

const router = useRouter();
const account = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const id = ref(null);
const isAccountEditable = ref(false);
const isDark = ref();

const newUsername = ref();
const newEmail = ref();

const characterName = ref();
const characterRole = ref();
const genre = ref();
const time = ref();
const selectedTime = ref(null);
const location = ref();
const selectedLocation = ref(null);

const selectedExperience = ref(null);
const experience = ref(null);
const jobExperienceTitle = ref(null);
const jobCompany = ref(null);
const jobCity = ref(null);
const jobState = ref(null);
const jobStart = ref(null);
const jobEnd = ref(null);
const jobDescription = ref(null);

const selectedEducation = ref(null);
const education = ref();
const selectedSkill = ref(null);
const skill = ref();

const isExpEdit = ref(false);

onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  theme.global.name.value = JSON.parse(localStorage.getItem("darkMode"));
  newUsername.value = account.value.userName;
  newEmail.value = account.value.email;

  await getTheme();
  /*
  await getCharacterNames();
  await getCharacterRoles();
  await getGenres();
  await getTimes();
  await getLocations();
  */
  await getExperiences();
  await getEducations();
  await getSkills();
});

//Open/Close Pop Ups
function openExpEdit(itemId) {
  window.localStorage.setItem("id", JSON.stringify(itemId));
  id.value = JSON.parse(localStorage.getItem("id"));
  getExperienceById(id.value);
  
  isExpEdit.value = true;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function closeEdit() {
  isExpEdit.value = false;
}
/*
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
*/
//Grab all Experiences
async function getExperiences() {
  await ExperienceServices.getExperiencesForUser(account.value.id)
    .then((response) => {
      experience.value = response.data;
      console.log(experience.value);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getExperienceById() {
  await ExperienceServices.getExperiences(id.value, account.value.id)
    .then((response) => {
      jobExperienceTitle.value = response.data.title;
      jobCompany.value = response.data.company;
      jobCity.value = response.data.city;
      jobState.value = response.data.state;
      jobStart.value = response.data.startDate;
      jobEnd.value = response.data.endDate;
      jobDescription.value = response.data.description;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Grab all Educations
async function getEducations() {
  await EducationServices.getEducationsForUser(account.value.id)
    .then((response) => {
      education.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Grab all Skills
async function getSkills() {
  await SkillServices.getSkillsForUser(account.value.id)
    .then((response) => {
      skill.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getPersonalInfo() {
    resetNewInput()
    await UserServices.getUser(parseInt(account.value.id))
        .then((response) => {
            personalInfo.value = response.data;
            firstName.value = personalInfo.value.firstName;
            lastName.value = personalInfo.value.lastName;
            address.value = personalInfo.value.address;
            phoneNumber.value = personalInfo.value.phoneNumber;
            email.value = personalInfo.value.email;
            getLinks();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

// Edit Experience
async function editExperience() {
  await ExperienceServices.updateExperience(input.id, account.value.id)
    .then(() => {
      closeEdit();
      localStorage.removeItem("id");
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Experience Editted!";
      router.push({ name: "library" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

}

//Delete Selected Experience
async function deleteExpValue(input) {
  if (!isDefault(input)) {
    await ExperienceServices.deleteExperience(input.id, account.value.id)
      .then(() => {
        getExperiences();
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Experience Deleted";
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

//Delete Selected Education
async function deleteEducation(input) {
  if (!isDefault(input)) {
    await EducationServices.deleteEducation(input.id, account.value.id)
      .then(() => {
        getEducations();
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Education Deleted";
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

//Delete Selected Skill
async function deleteSkill(input) {
  if (!isDefault(input)) {
    await SkillServices.deleteSkill(input.id, account.value.id)
      .then(() => {
        getSkills();
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Skill Deleted";
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

//Add Experience
async function addExpValue() {
  await ExperienceServices.addExpValue(selectedExperience.value, account.value.id)
    .then(() => {
      getExperiences();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Experience Added";
      router.push({ name: "account" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

}

//Add Education
async function addEducation() {
  await EducationServices.addEducation(selectedEducation.value, account.value.id)
    .then(() => {
      getEducations();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Education Added";
      router.push({ name: "account" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Add Skill
async function addSkill() {
  await SkillServices.addSkill(selectedSkill.value, account.value.id)
    .then(() => {
      getSkills();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Skill Added";
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
                      <v-list-item v-for="exp in experience" :key="exp.id">

                        <v-row margin="align-center">
                          <v-col md="8"><v-list-item-title>{{ exp.title }}</v-list-item-title> </v-col>
                          <v-col cols="1">
                            <v-icon icon="mdi-trash-can" @click="openExpEdit(exp.id)"></v-icon>
                          </v-col>
                          <v-col cols="2">
                            <v-icon icon="mdi-trash-can" @click="deleteExpValue(exp)"></v-icon>
                          </v-col>
                        </v-row>

                      </v-list-item>

                    </v-list>

                  </v-col>
                </v-row>

                <v-dialog persistent v-model="isExpEdit" width="800">
                  <v-card class="rounded-lg elevation-5">
                    <v-card-title class="text-center headline mb-2">Edit Experience</v-card-title>
              <v-container>
                <v-row>
                    <v-col>
                        <v-text-field v-model="jobExperienceTitle" label="Position Title"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="jobCompany" label="Company Name"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field v-mmodel="jobCity" label="City"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="jobState" label="State"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-text-field v-model="jobStart" label="Start Date"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field v-model="jobEnd" label="End Date"></v-text-field>
                        <v-switch label="Present Job" color="primary"></v-switch>
                    </v-col>
                </v-row>
                <v-row>
                    <v-textarea v-model="jobDescription" label="Work Summary">
                        <template #append-inner>
                            <v-btn color="secondary" rounded="xl" value="Ai Assist">
                                AI Assist
                            </v-btn>
                        </template>
                    </v-textarea>
                </v-row>
            </v-container>
                    <v-card-actions>
                      <v-btn variant="flat" color="primary" @click="editExperience()">Edit Experience</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn variant="flat" color="secondary" @click="closeEdit()">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <v-row style="width: 75%;">
                  <v-text-field label="New Experience" v-model="selectedExperience">

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
                      <v-list-item v-for="edu in education" :key="edu.id">

                        <v-row>
                          <v-col md="8"><v-list-item-title>{{ edu.description }}</v-list-item-title> </v-col>
                          <v-col cols="1">
                            <v-icon icon="mdi-trash-can" @click="deleteEducation(edu)"></v-icon>
                          </v-col>
                        </v-row>

                      </v-list-item>

                    </v-list>


                  </v-col>
                </v-row>


                <v-row style="width: 75%;">
                  <v-text-field label="New Education" v-model="selectedEducation">

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
                      <v-list-item v-for="s in skill" :key="s.id">

                        <v-row>
                          <v-col md="8"><v-list-item-title>{{ s.title }}</v-list-item-title> </v-col>
                          <v-col cols="1">
                            <v-icon icon="mdi-trash-can" @click="deleteSkill(s)"></v-icon>
                          </v-col>
                        </v-row>

                      </v-list-item>

                    </v-list>


                  </v-col>
                </v-row>


                <v-row style="width: 75%;">
                  <v-text-field label="New Skill" v-model="selectedSkill">

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
