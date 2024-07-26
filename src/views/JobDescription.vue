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
const isRequestingFeedback = ref(false);

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
    if (selectedJobDescription.value !== null) {
        isRequestingFeedback.value = true;
        await ResumeServices.getFeedback(resumeId.value, selectedJobDescription.value[0])
            .then((response) => {
                console.log(response.data);
                feedback.value = response.data.response;
                isRequestingFeedback.value = false;
                ResumeServices.updateResumeFeedback(resumeId.value, feedback.value, account.value.id);
            })
            .catch((error) => {
                console.log(error);
                isRequestingFeedback.value = false;
                snackbar.value.value = true;
                snackbar.value.color = "error";
                snackbar.value.text = error.response.data.message;
            }
            );
    } else {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Select a value from the table first.";
    }
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
            <v-card-title class="pl-0 text-h5 font-weight-bold">AI Feedback</v-card-title>
        </v-col>
        <v-row>
            <v-col class="text-right">
                <v-btn class="ml-auto" variant="flat" color="secondary" @click="navigateToLibrary()"> Back </v-btn>
            </v-col>
        </v-row>
        <!-- Select Job Description -->
        <v-row>
            <v-col>
                <v-card-title class="pl-0 text-h6 font-weight-bold">Select Job Description</v-card-title>
            </v-col>
        </v-row>
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
                <!-- Add New Job Description -->
                <v-row class="text-right">
                    <div>
                        <v-btn variant="tonal" @click="setNewJobDescVisible">
                            Add New Job Description
                        </v-btn>
                    </div>
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
                    <div class="mb-10">
                        <v-spacer></v-spacer>
                    </div>
                    <v-divider></v-divider>
                    <div class="mb-10">
                        <v-spacer></v-spacer>
                    </div>
                </v-row>
                <v-row>
                    <v-card class="rounded-lg elevation-5 my-8">
                        <v-card-title class="text-center headline mb-2">Feedback</v-card-title>
                        <v-card-text>
                            <v-skeleton-loader v-if="isRequestingFeedback" type="card"></v-skeleton-loader>
                            <v-textarea v-if="!isRequestingFeedback" v-model="feedback" label="View Feedback" auto-grow
                                readonly></v-textarea>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn variant="flat" color="primary" @click="requestFeedback()">Request Feedback</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-row>
            </v-col>
            <v-col>
                <div id="body">
                    <v-card class="rounded-lg elevation-5 my-8">
                        <v-card-title class="text-center headline mb-2">Resume</v-card-title>
                        <div>
                            <v-row>
                                <v-col>
                                    <div v-if="templateId == 1">
                                        <template1></template1>
                                    </div>
                                    <div v-if="templateId == 2">
                                        <template2></template2>
                                    </div>
                                    <div v-if="templateId == 3">
                                        <template3></template3>
                                    </div>
                                    <div v-if="templateId == 4">
                                        <template4></template4>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card>
                </div>
            </v-col>
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