<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import JobDescriptionServices from "../services/JobDescriptionServices.js";
import ResumeServices from "../services/ResumeServices.js";
import template1 from "../components/Template1.vue";
import template2 from "../components/Template2.vue";
import template3 from "../components/Template3.vue";
import template4 from "../components/Template4.vue";
import Snackbar from "../components/Snackbar.vue";

const router = useRouter();
const isRequestingFeedback = ref(false);

// Snackbar
const snackbarValue = ref(false);
const snackbarColor = ref("");
const snackbarText = ref("");

function makeSnackbar(color, text) {
    snackbarValue.value = true;
    snackbarColor.value = color;
    snackbarText.value = text;
}

// Resume variables
const resumeId = ref();
const resumeData = ref(null);
const feedback = ref("");
const templateId = ref(0);

// Job Description Variables
const account = ref(null);
const jobDescriptionInfo = ref();
const selectedJobDescription = ref([]);
const jobDescriptionTitle = ref("");
const jobDescription = ref("");
const isNewJobDescVisible = ref(false);

onMounted(async () => {
    account.value = JSON.parse(localStorage.getItem("account"));
    resumeId.value = JSON.parse(localStorage.getItem("resumeId"));
    getJobDescInfo();
    await getResume();
});

async function getResume() {
    await ResumeServices.getResume(resumeId.value)
        .then((response) => {
            resumeData.value = response.data;
            templateId.value = resumeData.value.template;
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message)
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
            makeSnackbar("error", error.response.data.message)
        });
}

async function addNewJobDesc() {
    await JobDescriptionServices.addJobDescription(jobDescriptionTitle.value, jobDescription.value, account.value.id)
        .then(() => {
            makeSnackbar("green", "Job Description Added!")
            getJobDescInfo();
        })
        .catch((error) => {
            console.log(error);
            makeSnackbar("error", error.response.data.message)
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
                feedback.value = response.data.response;
                isRequestingFeedback.value = false;
                ResumeServices.updateResumeFeedback(resumeId.value, feedback.value, account.value.id);
            })
            .catch((error) => {
                console.log(error);
                isRequestingFeedback.value = false;
                makeSnackbar("error", error.response.data.message)
            }
            );
    } else {
        makeSnackbar("error", "Select a value from the table first.")
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
        <v-col class="text-right">
            <v-btn class="ml-auto" variant="flat" color="secondary" @click="navigateToLibrary()"> Back </v-btn>
        </v-col>

        <v-card-title class="pl-0 text-h5 font-weight-bold" align="center">AI Feedback</v-card-title>
        <v-row>
            <v-col>
                <v-container>
                    <div>
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
                        <v-container align="center">
                            <v-btn variant="tonal" @click="setNewJobDescVisible">
                                Add New Job Description
                            </v-btn>
                        </v-container>
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

                    <v-card class="rounded-lg elevation-5 my-8">
                        <v-card-title class="text-center headline mb-2">Feedback</v-card-title>
                        <v-card-text>
                            <v-skeleton-loader v-if="isRequestingFeedback" type="card"></v-skeleton-loader>
                            <v-textarea v-if="!isRequestingFeedback" v-model="feedback" label="View Feedback" auto-grow
                                readonly></v-textarea>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn :disabled="selectedJobDescription.length == 0" variant="flat" color="primary"
                                @click="requestFeedback()">Request Feedback</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-container>
            </v-col>

            <v-col>
                <div id="body">
                    <v-card class="rounded-lg elevation-5 my-8">
                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>
                        <v-card-title class="text-center headline mb-2">Resume </v-card-title>
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

        <Snackbar :show="snackbarValue" :color="snackbarColor" :message="snackbarText"
            @update:show="value => snackbarValue = value"></Snackbar>

    </v-container>
</template>