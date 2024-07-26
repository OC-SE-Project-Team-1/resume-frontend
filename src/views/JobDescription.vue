<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import JobDescriptionServices from "../services/JobDescriptionServices.js";
import ResumeServices from "../services/ResumeServices.js";
import template1 from "../components/Template1.vue";
import template2 from "../components/Template2.vue";
import template3 from "../components/Template3.vue";
import template4 from "../components/Template4.vue";

const router = useRouter();

// Snackbar
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});

// Resume variables
const resumeId = ref();
const resumeData = ref(null);
const feedback = ref("");
const templateId = ref(0);

// Job Description Variables
const account = ref(null);
const jobDescriptionInfo = ref(); 
const selectedJobDescription = ref(null);
const jobDescriptionTitle = ref("");
const jobDescription = ref("");
const isNewJobDescVisible = ref(false);

onMounted(async () => {
    account.value = JSON.parse(localStorage.getItem("account"));
    resumeId.value = JSON.parse(localStorage.getItem("resumeId"));
    getJobDescInfo();
    await getResume();
    closeSnackBar();
});

function closeSnackBar() {
    snackbar.value.value = false;
}

async function getResume() {
  await ResumeServices.getResume(resumeId.value)
    .then((response) => {
      resumeData.value = response.data;
      templateId.value = resumeData.value.template;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getJobDescInfo() {
    closeNewJobDesc();
    await JobDescriptionServices.getJobDescriptionsForUser(parseInt(account.value.id))
        .then((response) => {
            jobDescriptionInfo.value = response.data;
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function addNewJobDesc() {
    await JobDescriptionServices.addJobDescription(jobDescriptionTitle.value, jobDescription.value, account.value.id)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Job Description Added!";
            getJobDescInfo();
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
}

async function setNewJobDescVisible() {
    isNewJobDescVisible.value = true;
}

async function closeNewJobDesc() {
    isNewJobDescVisible.value = false;
    jobDescriptionTitle.value = "";
    jobDescription.value = "";
}

async function requestFeedback() {
    await ResumeServices.getFeedback(resumeId.value, selectedJobDescription.value[0])
        .then((response) => {
            console.log(response.data);
            feedback.value = response.data.response;
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });;
}

function navigateToLibrary() {
  router.push({ name: "library" });
}
</script>

<script>
export default {
    data: () => ({
    }),
}
</script>

<template>
    <v-container>
        <v-col cols="10">
            <v-card-title class="pl-0 text-h4 font-weight-bold">Select Job Description</v-card-title>
        </v-col>
        <v-row>
            <v-col class="text-right">
                <v-btn  class="ml-auto" variant="flat" color="secondary" @click="navigateToLibrary()"> Back </v-btn>
            </v-col>
        </v-row>
        <!-- Select Job Description -->
        <v-row>
            <v-col>
                <div id="body">
                    <v-container>
                        <v-data-table v-model="selectedJobDescription" :items="jobDescriptionInfo" item-value="id"
                            :headers="[{ title: 'Job Name', value: 'title' }, { title: 'Description', value: 'description' }]"
                            show-select hide-default-footer select-strategy="single">
                        </v-data-table>
                    </v-container>
                </div>
                <div class="mb-10">
                    <v-spacer></v-spacer>
                </div>
                <v-divider></v-divider>
                <div class="mb-10">
                    <v-spacer></v-spacer>
                </div>
            </v-col>
            <v-col>
                <div id="body">
                    <v-card class="rounded-lg elevation-5 my-8">
                        <v-card-title class="text-center headline mb-2">Resume</v-card-title>
                        <div style="padding: 3%;">
                            <v-container>
                                <!-- Resume preview goes here -->
                            </v-container>
                        </div>
                    </v-card>
                    <v-card class="rounded-lg elevation-5 my-8">
                        <v-card-title class="text-center headline mb-2">Feedback</v-card-title>
                        <v-card-text>
                            <v-textarea v-model="feedback" label="View Feedback" auto-grow readonly></v-textarea>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn variant="flat" color="primary" @click="requestFeedback()">Request Feedback</v-btn>
                        </v-card-actions>
                    </v-card>
                </div>
            </v-col>
        </v-row>
        <!-- Add New Job Description -->
        <v-row>
            <v-btn variant="tonal" @click="setNewJobDescVisible">
                Add New Job Description
            </v-btn>
            <v-container v-if="isNewJobDescVisible">
                <v-row>
                    <v-col>
                        <v-text-field v-model="jobDescriptionTitle" label="Job Title"></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-textarea auto-grow v-model="jobDescription" label="Description"></v-textarea>
                    </v-col>
                </v-row>
                <v-col></v-col>
                <v-btn variant="tonal" @click="closeNewJobDesc()">
                    Cancel
                </v-btn>
                &nbsp;&nbsp;&nbsp;
                <v-btn variant="tonal" @click="addNewJobDesc()">
                    Submit
                </v-btn>
            </v-container>
        </v-row>
        <v-snackbar v-model="snackbar.value" rounded="pill">
            {{ snackbar.text }}
            <template v-slot:actions>
                <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
                    Close
                </v-btn>
            </template>
      </v-snackbar>
    </v-container>
</template>