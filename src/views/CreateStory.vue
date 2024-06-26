<script setup>
import { ref, toRaw, computed, watch, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import CreateStoryServices from "../services/CreateStoryServices.js";
import CharacterNameServices from "../services/CharacterNameServices.js";
import CharacterRoleServices from "../services/CharacterRoleServices.js";
import GenreServices from "../services/GenreServices.js";
import LocationServices from "../services/LocationServices.js";
import LanguagesServices from "../services/LanguagesServices.js";
import TimePeriodServices from "../services/TimePeriodServices.js";
import StoryExport from "../reports/StoryExport.js";

const router = useRouter();
const isExport = ref(false);
const isGenerated = ref(false);
const isSaved = ref(false);
const isSavedPanel = ref(false);
const numCharacters = ref(1);
const isCharacterErrored = ref(false);
const isCharacter2 = ref(false);
const isCharacter3 = ref(false);
const isCharacter4 = ref(false);
const isCharacter5 = ref(false);
const isMaxCharacters = ref(true);

//Story Title and Content
const loading = ref(false);
const content = ref();
const title = ref();

//Snackbar to display errors
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

//Vars to hold get request results
const account = ref(null);
const characterName = ref();
const characterRole = ref();
const genre = ref();
const location = ref();
const language = ref();
const length = ref("medium");
const timePeriod = ref();

//Vars to send post requests
const selectedLanguage = ref(null);
const selectedLocation = ref(null);
const selectedcharName1 = ref(null);
const selectedcharRole1 = ref(null);
const selectedcharName2 = ref(null);
const selectedcharRole2 = ref(null);
const selectedcharName3 = ref(null);
const selectedcharRole3 = ref(null);
const selectedcharName4 = ref(null);
const selectedcharRole4 = ref(null);
const selectedcharName5 = ref(null);
const selectedcharRole5 = ref(null);
const selectedTime = ref(null);
const selectedGenre = ref(null);

//Conditional statment to make generate button greyed out or not
const allFilled = computed(() => {
  let condition = selectedcharName1.value !== null && selectedcharRole1.value !== null;
  if (numCharacters.value >= 2) {
    condition = condition && selectedcharName2.value !== null && selectedcharRole2.value !== null;
  }
  if (numCharacters.value >= 3) {
    condition = condition && selectedcharName3.value !== null && selectedcharRole3.value !== null;
  }
  if (numCharacters.value >= 4) {
    condition = condition && selectedcharName4.value !== null && selectedcharRole4.value !== null;
  }
  if (numCharacters.value >= 5) {
    condition = condition && selectedcharName5.value !== null && selectedcharRole5.value !== null;
  }
  return (
    selectedGenre.value !== null &&
    selectedTime.value !== null &&
    selectedLocation.value !== null &&
    selectedLanguage.value !== null &&
    condition)
})

//Prepopulate all comboboxes with data from DB
onMounted(async () => {
  localStorage.removeItem("storyId");
  account.value = JSON.parse(localStorage.getItem("account"));
  await getCharacterNames();
  await getCharacterRoles();
  await getGenres();
  await getLocations();
  await getLangauges();
  await getTimePeriods();

  watch(selectedGenre, (val) => {
    if (val.length > 2) {
      // Use nextTick if you need to perform DOM updates or Vue reactivity
      nextTick(() => selectedGenre.value.pop())
    }
    if (val.length < 1) {
      // Use nextTick if you need to perform DOM updates or Vue reactivity
      nextTick(() => selectedGenre.value = null)
    }
  })
});

function showError(error) {
  console.log(error);
  snackbar.value.value = true;
  snackbar.value.color = "error";
  snackbar.value.text = error.response.data.message;
}
//call the method with current userID and get items back
async function getUserItems(method) {
  var names = [];
  await method(account.value.id)
    .then((response) => {
      for (let item in response.data) {
        names.push(response.data[item]);
      }
    })
    .catch((error) => {
      showError(error)
    });
  return names;
}

//call method and retrieve default values from db
async function getdefaultItems(method) {
  var names = [];
  for (let i = 1; i <= 4; ++i) {
    await method(i)
      .then((response) => {
        names.push(response.data);
      }
      )
      .catch((error) => {
        showError(error)
      });
  }
  return names;
}

//Grab all Characacter Names
async function getCharacterNames() {
  var names = [];
  if (account.value == null) {
    names = await getdefaultItems(CharacterNameServices.getcharacterName)
  }
  else {
    names = await getUserItems(CharacterNameServices.getcharacterNameForUser)
  }
  //extract name from names
  characterName.value = [];
  for (let item in names) {
    characterName.value.push(names[item].name);
  }
}

//Grab all Characacter Roles
async function getCharacterRoles() {
  var names = [];
  if (account.value == null) {
    names = await getdefaultItems(CharacterRoleServices.getcharacterRole)
  }
  else {
    names = await getUserItems(CharacterRoleServices.getcharacterRoleForUser)
  }
  //extract name from names
  characterRole.value = [];
  for (let item in names) {
    characterRole.value.push(names[item].name);
  }
}

//Grab all Genres
async function getGenres() {
  var names = [];
  if (account.value == null) {
    names = await getdefaultItems(GenreServices.getgenre)
  }
  else {
    names = await getUserItems(GenreServices.getgenreForUser)
  }
  //extract name from names
  genre.value = [];
  for (let item in names) {
    genre.value.push(names[item].name);
  }
}

//Grab all Locations
async function getLocations() {
  var names = [];
  if (account.value == null) {
    names = await getdefaultItems(LocationServices.getlocation)
  }
  else {
    names = await getUserItems(LocationServices.getlocationForUser)
  }
  //extract location from names
  location.value = [];
  for (let item in names) {
    location.value.push(names[item].location);
  }
}

//Grab all Languages
async function getLangauges() {
  await LanguagesServices.getLanguages()
    .then((response) => {
      var languages = [];
      for (let item in response.data) {
        languages.push(response.data[item].language);
      }
      language.value = languages
    })
    .catch((error) => {
      showError(error)
    });
}

//Grab all Time Periods 
async function getTimePeriods() {
  var names = [];
  if (account.value == null) {
    names = await getdefaultItems(TimePeriodServices.gettimePeriod)
  }
  else {
    names = await getUserItems(TimePeriodServices.gettimePeriodForUser)
  }
  //extract location from names
  timePeriod.value = [];
  for (let item in names) {
    timePeriod.value.push(names[item].name);
  }
}

//Navigate to different pages on Function call
function navigateToEdit() {
  router.push({ name: "edit" });
}
function navigateToLibrary() {
  router.push({ name: "library" });
}

//Save story into account's library
async function saveStory() {
  await CreateStoryServices.saveStory(account.value.id, title.value, content.value)
    .then((response) => {
      window.localStorage.setItem("storyId", JSON.stringify(response.data.id));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story saved successfully!";
      openSaved();
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Make a Post Request to Cohere to Make story and title with given values from comboboxes 
async function generate() {
  isGenerated.value = false;
  loading.value = true;
  if (account.value == null) {
    await CreateStoryServices.createStory(numCharacters.value, selectedcharName1.value, selectedcharRole1.value, selectedTime.value,
      selectedGenre.value, selectedLocation.value, selectedLanguage.value, length.value, 1,
      selectedcharName2.value, selectedcharRole2.value, selectedcharName3.value, selectedcharRole3.value,
      selectedcharName4.value, selectedcharRole4.value, selectedcharName5.value, selectedcharRole5.value)
      .then((response) => {
        loading.value = false;
        title.value = response.data.title
        content.value = response.data.story
        isSaved.value = false;
        isGenerated.value = true;
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Story Creation Successful!";
        router.push({ name: "createstory" });
      })
      .catch((error) => {
        showError(error)
      });
  }
  else {
    await CreateStoryServices.createStory(numCharacters.value, selectedcharName1.value, selectedcharRole1.value, selectedTime.value,
      selectedGenre.value, selectedLocation.value, selectedLanguage.value, length.value, account.value.id,
      selectedcharName2.value, selectedcharRole2.value, selectedcharName3.value, selectedcharRole3.value,
      selectedcharName4.value, selectedcharRole4.value, selectedcharName5.value, selectedcharRole5.value)
      .then((response) => {
        loading.value = false;
        title.value = response.data.title
        content.value = response.data.story
        isSaved.value = false;
        isGenerated.value = true;
        snackbar.value.value = true;
        snackbar.value.color = "green";
        snackbar.value.text = "Story Creation Successful!";
        router.push({ name: "createstory" });
      })
      .catch((error) => {
        showError(error)
      });
  }

}

//Export Story
async function exportStory() {
  await StoryExport.exportStory(JSON.parse(localStorage.getItem("storyId")))
    .then(() => {
      closeExport();
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Story Exported!";
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

//Keep track of what has been pressed on screen for opening pop up screens
function openSaved() {
  isSaved.value = true;
  isSavedPanel.value = true;
}
function closeSaved() {
  isSavedPanel.value = false;
}
function closeSnackBar() {
  snackbar.value.value = false;
}
function openExport() {
  isExport.value = true;
}
function closeExport() {
  isExport.value = false;
}

//Keep track of Number of characters allowed.
async function newCharacter() {
  if (numCharacters.value <= 5) {
    numCharacters.value += 1;
    multipleCharacters();
  }
  else {
    isCharacterErrored.value = true;
  }
}

//Sets multiple character name/roles visible 
async function multipleCharacters() {
  if (numCharacters.value == 2) {
    isCharacter2.value = true;
    isMaxCharacters.value = true;
  }
  else if (numCharacters.value == 3) {
    isCharacter3.value = true;
    isMaxCharacters.value = true;
  }
  else if (numCharacters.value == 4) {
    isCharacter4.value = true;
    isMaxCharacters.value = true;
  }
  else if (numCharacters.value == 5) {
    isCharacter5.value = true;
    isMaxCharacters.value = false;
    console.log(numCharacters.value);
  } else {
    isMaxCharacters.value = true;
  }
}

//Deletes character name & role row 2 and shifts values as needed
async function deleteCharacterButton2() {
  isMaxCharacters.value = true;
  if (numCharacters.value == 2) {
    isCharacter2.value = false;
    numCharacters.value -= 1;

    selectedcharName2.value = null;
    selectedcharRole2.value = null;
  }
  else if (numCharacters.value == 5) {
    selectedcharName2.value = selectedcharName3.value;
    selectedcharName3.value = selectedcharName4.value;
    selectedcharName4.value = selectedcharName5.value;

    selectedcharRole2.value = selectedcharRole3.value;
    selectedcharRole3.value = selectedcharRole4.value;
    selectedcharRole4.value = selectedcharRole5.value;

    isCharacter5.value = false;
    numCharacters.value -= 1;

    selectedcharName5.value = null;
    selectedcharRole5.value = null;
  }
  else if (numCharacters.value == 4) {
    selectedcharName2.value = selectedcharName3.value;
    selectedcharName3.value = selectedcharName4.value;

    selectedcharRole2.value = selectedcharRole3.value;
    selectedcharRole3.value = selectedcharRole4.value;

    isCharacter4.value = false;
    isCharacter5.value = false;
    numCharacters.value -= 1;

    selectedcharName4.value = null;
    selectedcharRole4.value = null;
    selectedcharName5.value = null;
    selectedcharRole5.value = null;
  }
  else if (numCharacters.value == 3) {
    selectedcharName2.value = selectedcharName3.value;

    selectedcharRole2.value = selectedcharRole3.value;

    isCharacter3.value = false;
    isCharacter4.value = false;
    isCharacter5.value = false;
    numCharacters.value -= 1;

    selectedcharName3.value = null;
    selectedcharRole3.value = null;
    selectedcharName4.value = null;
    selectedcharRole4.value = null;
    selectedcharName5.value = null;
    selectedcharRole5.value = null;
  }
}

//Deletes character name & role row 3 and shifts values as needed
async function deleteCharacterButton3() {
  isMaxCharacters.value = true;
  if (numCharacters.value == 3) {
    isCharacter3.value = false;
    numCharacters.value -= 1;
    selectedcharName3.value = null;
    selectedcharRole3.value = null;
  }
  else if (numCharacters.value == 5) {
    selectedcharName3.value = selectedcharName4.value;
    selectedcharName4.value = selectedcharName5.value;

    selectedcharRole3.value = selectedcharRole4.value;
    selectedcharRole4.value = selectedcharRole5.value;

    isCharacter5.value = false;
    numCharacters.value -= 1;

    selectedcharName5.value = null;
    selectedcharRole5.value = null;
  }
  else if (numCharacters.value == 4) {
    selectedcharName3.value = selectedcharName4.value;

    selectedcharRole3.value = selectedcharRole4.value;

    isCharacter4.value = false;
    isCharacter5.value = false;
    numCharacters.value -= 1;

    selectedcharName4.value = null;
    selectedcharRole4.value = null;
    selectedcharName5.value = null;
    selectedcharRole5.value = null;
  }
}

//Deletes character name & role row 4 and shifts values as needed
async function deleteCharacterButton4() {
  isMaxCharacters.value = true;
  if (numCharacters.value == 4) {
    isCharacter4.value = false;
    numCharacters.value -= 1;

    selectedcharName4.value = null;
    selectedcharRole4.value = null;
  }
  else if (numCharacters.value == 5) {
    selectedcharName4.value = selectedcharName5.value;
    selectedcharRole4.value = selectedcharRole5.value;

    isCharacter5.value = false;
    numCharacters.value -= 1;

    selectedcharName5.value = null;
    selectedcharRole5.value = null;
  }
}

//Deletes character name & role row 5 and shifts values as needed
async function deleteCharacterButton5() {
  isMaxCharacters.value = true;
  if (numCharacters.value == 5) {
    isCharacter5.value = false;
    numCharacters.value -= 1;

    selectedcharName5.value = null;
    selectedcharRole5.value = null;
  }
}

</script>

<script>
export default {
  data() {
    return {
      select: [],
      search: null,
    }
  },
  computed: {
    comboRules() {
      return [
        (v) => !!v && v.length <= 2 || 'You must select 1 or 2 genres!'
      ];
    }
  },
}
</script>



<template>
  <v-container>
    <div id="body">
      <!-- Story Input Card -->
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="text-center headline mb-2">Story Input </v-card-title>
        <v-card-text>
          <v-text for="character" class="headline mb-2">Character</v-text>
          <v-spacer></v-spacer>

          <!-- Character Name and Role Section -->
          <div>
            <div>
              <v-row style="width: 50%;">
                <v-col cols="5">
                  <!-- Char Name Box 1-->
                  <v-combobox v-model="selectedcharName1" label="Name" :items="characterName" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
                <v-col cols="5">
                  <!-- Char Role Box 1-->
                  <v-combobox v-model="selectedcharRole1" label="Role" :items="characterRole" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
              </v-row>
            </div>
            <div v-show="isCharacter2">
              <v-row style="width: 50%;">
                <v-col cols="5">
                  <!-- Char Name Box 2-->
                  <v-combobox v-model="selectedcharName2" label="Name" :items="characterName" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
                <v-col cols="5">
                  <!-- Char Role Box 2-->
                  <v-combobox v-model="selectedcharRole2" label="Role" :items="characterRole" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
                <v-col cols="1">
                  <!-- Char Role Delete Box 2-->
                  <v-btn icon="mdi-trash-can" @click="deleteCharacterButton2"></v-btn>
                </v-col>
              </v-row>
            </div>
            <div v-show="isCharacter3">
              <v-row style="width: 50%;">
                <v-col cols="5">
                  <!-- Char Name Box 3-->
                  <v-combobox v-model="selectedcharName3" label="Name" :items="characterName" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
                <v-col cols="5">
                  <!-- Char Role Box 3-->
                  <v-combobox v-model="selectedcharRole3" label="Role" :items="characterRole" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
                <v-col cols="1">
                  <!-- Char Role Delete Box 3-->
                  <v-btn icon="mdi-trash-can" @click="deleteCharacterButton3"></v-btn>
                </v-col>
              </v-row>
            </div>
            <div v-show="isCharacter4">
              <v-row style="width: 50%;">
                <v-col cols="5">
                  <!-- Char Name Box 4-->
                  <v-combobox v-model="selectedcharName4" label="Name" :items="characterName" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
                <v-col cols="5">
                  <!-- Char Role Box 4-->
                  <v-combobox v-model="selectedcharRole4" label="Role" :items="characterRole" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
                <v-col cols="1">
                  <!-- Char Role Delete Box 4-->
                  <v-btn icon="mdi-trash-can" @click="deleteCharacterButton4"></v-btn>
                </v-col>
              </v-row>
            </div>
            <div v-show="isCharacter5">
              <v-row style="width: 50%;">
                <v-col cols="5">
                  <!-- Char Name Box 5-->
                  <v-combobox v-model="selectedcharName5" label="Name" :items="characterName" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
                <v-col cols="5">
                  <!-- Char Role Box 5-->
                  <v-combobox v-model="selectedcharRole5" label="Role" :items="characterRole" variant="outlined"
                    auto-select-first="exact"></v-combobox>
                </v-col>
                <v-col cols="1">
                  <!-- Char Role Delete Box 5-->
                  <v-btn icon="mdi-trash-can" @click="deleteCharacterButton5"></v-btn>
                </v-col>
              </v-row>
            </div>
            <v-btn variant="flat" color="primary" @click="newCharacter()" v-show="isMaxCharacters">Add Character</v-btn>
            <v-spacer></v-spacer>
            <div class="mb-5">
            </div>
            <p v-if="isCharacterErrored">Error: Max characters reached</p>
          </div>

          <div class="mb-5"></div>
          <v-text for="genre" class="headline mb-2">Genre</v-text>
          <v-spacer></v-spacer>
          <!-- Genre Box -->
          <v-combobox label="Genre" v-model="selectedGenre" v-model:search="search" :hide-no-data="false" :items="genre"
            :rules="comboRules" variant="outlined" style="width: 30%;" multiple hint="Maximum of 2 Genres"
            auto-select-first="exact" small-chips>
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  No results matching "<strong>{{ search }}</strong>". Press
                  <kbd>enter</kbd> to create a new one
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-combobox>
          <v-spacer></v-spacer>
          <div class="mb-5">
          </div>

          <v-text for="settings" class="headline mb-2">Settings</v-text>
          <v-spacer></v-spacer>
          <div>
            <v-row>
              <v-col>
                <!-- Time Period Box -->
                <v-combobox v-model="selectedTime" label="Time" :items="timePeriod" variant="outlined"
                  auto-select-first="exact"></v-combobox>
              </v-col>
              <v-col>
                <!-- Location Box -->
                <v-combobox v-model="selectedLocation" label="Location" :items="location" variant="outlined"
                  auto-select-first="exact"></v-combobox>
              </v-col>
              <v-col>
                <!-- Language Box -->
                <v-combobox v-model="selectedLanguage" label="Language" :items="language" variant="outlined"
                  auto-select-first="exact"></v-combobox>
              </v-col>
            </v-row>
          </div>

          <v-spacer></v-spacer>
          <!-- Length Btns -->
          <v-text for="length" class="headline mb-2">Length</v-text>
          <v-spacer></v-spacer>
          <v-radio-group inline v-model="length">
            <v-radio label="Short" value="short"></v-radio>
            <v-radio label="Medium" value="medium"></v-radio>
            <v-radio label="Long" value="long"></v-radio>
          </v-radio-group>
          <v-spacer></v-spacer>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- Generate Btn -->
          <v-btn variant="flat" color="primary" @click="generate()" :disabled="!allFilled">Generate</v-btn>
        </v-card-actions>
      </v-card>

      <!-- Story Output Card -->
      <v-card class="rounded-lg elevation-5 my-8">
        <v-card-title class="text-center headline mb-2">Generated Story</v-card-title>

        <v-container v-if="loading">
          <v-skeleton-loader type="card"></v-skeleton-loader>
        </v-container>

        <!-- Story Text -->
        <v-card-text>
          <v-card-title v-if="isGenerated" for="storyTitle" class="headline mb-2">{{ title }}</v-card-title>
          <v-spacer></v-spacer>
          <v-textarea v-if="isGenerated" v-model="content" auto-grow readonly></v-textarea>
        </v-card-text>

        <!-- Edit, Export, Save Btns -->
        <v-card-actions>
          <v-btn v-if="isSaved && isGenerated" variant="flat" color="secondary" @click="navigateToEdit()">Edit</v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="isSaved && isGenerated" variant="flat" color="secondary" @click="openExport()">Export</v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="!isSaved && isGenerated && (account != null)" variant="flat" color="secondary"
            @click="saveStory()">Save</v-btn>
        </v-card-actions>
      </v-card>

      <!-- Saved Pop Up -->
      <v-dialog persistent v-model="isSavedPanel" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="text-center headline mb-2">Story Saved!</v-card-title>
          <v-card-actions>
            <v-btn variant="flat" color="primary" @click="navigateToLibrary()">Go To Library</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeSaved()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Export Pop Up -->
      <v-dialog persistent v-model="isExport" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="text-center headline mb-2">Export Story?</v-card-title>
          <v-card-actions>
            <v-btn variant="flat" color="primary" @click="exportStory()">Export PDF</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeExport()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar Pop Up -->
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">Close</v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>