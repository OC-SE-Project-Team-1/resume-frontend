<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import JobDescriptionServices from "../services/JobDescriptionServices.js";

const account = ref(null);
const jobDescriptionInfo = ref(); 
const selectedJobDescription = ref(null);
const jobDescriptionTitle = ref("");
const jobDescription = ref("");
const isNewJobDescVisible = ref(false);

onMounted(() => {
    account.value = JSON.parse(localStorage.getItem("account"));
    getJobDescInfo();
});

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
    await JobDescriptionServices.addEducation(jobDescriptionTitle.value, jobDescription.value, account.value.id)
        .then(() => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Job Description Added!";
            closeNewJobDesc();
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
</script>

<script>
export default {
    data: () => ({
    }),
}
</script>

<template>

    <v-container>
        <!-- Job Descriptions -->
        <div id="body">
            <v-text class="headline mb-10">Select Job Description: </v-text>

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

            <v-col>
            </v-col>
            <v-btn variant="tonal" @click="closeNewJobDesc()">
                Cancel
            </v-btn>
            &nbsp;&nbsp;&nbsp;
            <v-btn variant="tonal" @click="addNewJobDesc()">
                Submit
            </v-btn>
        </v-container>
    </v-container>
</template>