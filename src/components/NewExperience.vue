<script setup>
import { computed, ref, watch } from "vue";
import ExperienceServices from "../services/ExperienceServices.js";

const props = defineProps({
    isJobExperience: Boolean,
    account: Object,
    makeSnackbar: Function,
    getExperiences: Function,
    toggleExperience: Function,
    whichExperience: Number,
    experienceAIAssist: Function,
    isRequestingAiAssist: Boolean,
    jobDescription: String,
    isLeadershipExperience: Boolean,
    isActivitiesExperience: Boolean,
    isVolunteerExperience: Boolean,
    isHonorExperience: Boolean,
    isAwardExperience: Boolean,
    isProjectExperience: Boolean
});

const jobExperienceTitle = ref(null);
const jobCompany = ref(null);
const jobCity = ref(null);
const jobState = ref(null);
const jobStart = ref(null);
const jobEnd = ref(null);
const jobDescription = ref(props.jobDescription);
const localisRequestingAiAssist = ref(props.isRequestingAiAssist);

const isCurrent = ref(false);
let experienceChatHistory = [];

const isExperienced = computed(() => {
    var isEndDate = isCurrent.value ? true : (jobEnd.value !== "" && jobEnd.value !== null)
    return (
        jobExperienceTitle.value !== "" && jobExperienceTitle.value !== null &&
        jobCompany.value !== "" && jobCompany.value !== null &&
        jobCity.value !== "" && jobCity.value !== null &&
        jobState.value !== "" && jobState.value !== null &&
        jobStart.value !== "" && jobStart.value !== null &&
        jobDescription.value !== "" && jobDescription.value !== null && isEndDate
    )
})

const isOthered = computed(() => {
    return (
        jobExperienceTitle.value !== "" && jobExperienceTitle.value !== null &&
        jobStart.value !== "" && jobStart.value !== null &&
        jobDescription.value !== "" && jobDescription.value !== null
    )
})

const emit = defineEmits(['update:isJobExperience', 'update:isLeadershipExperience',
    'update:isActivitiesExperience', 'update:isVolunteerExperience',
    'update:isHonorExperience', 'update:isAwardExperience', 'update:isProjectExperience',
    'update:isRequestingAiAssist',]);

const isJobExperience = ref(props.isJobExperience);
const isLeadershipExperience = ref(props.isLeadershipExperience);
const isActivitiesExperience = ref(props.isActivitiesExperience);
const isVolunteerExperience = ref(props.isVolunteerExperience);
const isHonorExperience = ref(props.isHonorExperience);
const isAwardExperience = ref(props.isAwardExperience);
const isProjectExperience = ref(props.isProjectExperience);

watch(() => props.isJobExperience, (newVal) => {
    isJobExperience.value = newVal;
});
watch(() => props.isLeadershipExperience, (newVal) => {
    isLeadershipExperience.value = newVal;
});
watch(() => props.isActivitiesExperience, (newVal) => {
    isActivitiesExperience.value = newVal;
});
watch(() => props.isVolunteerExperience, (newVal) => {
    isVolunteerExperience.value = newVal;
});
watch(() => props.isHonorExperience, (newVal) => {
    isHonorExperience.value = newVal;
});
watch(() => props.isAwardExperience, (newVal) => {
    isAwardExperience.value = newVal;
});
watch(() => props.isProjectExperience, (newVal) => {
    isProjectExperience.value = newVal;
});

watch(() => props.jobDescription, (newVal) => {
    jobDescription.value = newVal;
});

watch(() => props.isRequestingAiAssist, (newValue) => {
    localisRequestingAiAssist.value = newValue;
});


async function addNewExperience(type) {
    if (isCurrent.value == true) {
        jobEnd.value = null;
    }
    await ExperienceServices.addExperience(jobExperienceTitle.value, jobDescription.value, jobStart.value, jobEnd.value,
        isCurrent.value, props.account.id, type, jobCity.value, jobState.value, jobCompany.value, experienceChatHistory)
        .then(() => {
            props.makeSnackbar("green", "Experience Added!");
            props.getExperiences();
            clearExperienceData();
            closeNewJobExperience();
        })
        .catch((error) => {
            console.log(error);
            props.makeSnackbar("error", error.response.data.message);
        });
}


async function clearExperienceData() {
    jobExperienceTitle.value = null;
    jobCompany.value = null;
    jobCity.value = null;
    jobState.value = null;
    jobStart.value = null;
    jobEnd.value = null;
    jobDescription.value = null;
    experienceChatHistory = [];
    isCurrent.value = false;
}

async function closeNewJobExperience() {
    isJobExperience.value = false;
    emit('update:isJobExperience', false);
    isLeadershipExperience.value = false;
    emit('update:isLeadershipExperience', false);
    isActivitiesExperience.value = false;
    emit('update:isActivitiesExperience', false);
    isVolunteerExperience.value = false;
    emit('update:isVolunteerExperience', false);
    isHonorExperience.value = false;
    emit('update:isHonorExperience', false);
    isAwardExperience.value = false;
    emit('update:isAwardExperience', false);
    isProjectExperience.value = false;
    emit('update:isProjectExperience', false);

}
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <v-text-field v-model="jobExperienceTitle" label="Position Title"></v-text-field>
            </v-col>
            <v-col v-if="props.whichExperience !== 5 && props.whichExperience !== 6">
                <v-text-field v-model="jobCompany" label="Company Name"></v-text-field>
            </v-col>
        </v-row>
        <v-row v-if="props.whichExperience !== 5 && props.whichExperience !== 6">
            <v-col>
                <v-text-field v-model="jobCity" label="City"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field v-model="jobState" label="State" hint="Two letters for State"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-text-field v-model="jobStart" label="Start Date" hint="Ex: Aug 2024"></v-text-field>
            </v-col>
            <v-col v-if="props.whichExperience !== 5 && props.whichExperience !== 6">
                <v-text-field :disabled="isCurrent" v-model="jobEnd" label="End Date"
                    hint="Ex: Aug 2024"></v-text-field>
                <v-switch v-model="isCurrent" label="Present Job" color="primary"></v-switch>
            </v-col>
        </v-row>
        <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
        <v-row>
            <v-textarea v-if="!isRequestingAiAssist" v-model="jobDescription" label="Work Summary">
                <template #append-inner>
                    <div v-if="props.whichExperience !== 5 && props.whichExperience !== 6">
                        <v-btn color="secondary" rounded="xl" value="Ai Assist" @click="props.experienceAIAssist()">
                            AI Assist
                        </v-btn>
                    </div>
                </template>
            </v-textarea>
        </v-row>

        <div v-if="props.whichExperience !== 5 && props.whichExperience !== 6">
            <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="props.toggleExperience(props.whichExperience)">
                Cancel
            </v-btn>
            &nbsp;&nbsp;&nbsp;
            <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isExperienced"
                @click="addNewExperience(props.whichExperience)">
                Submit
            </v-btn>
        </div>
        <div v-if="props.whichExperience === 5 || props.whichExperience === 6">
            <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="props.toggleExperience(props.whichExperience)">
                Cancel
            </v-btn>
            &nbsp;&nbsp;&nbsp;
            <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isOthered"
                @click="addNewExperience(props.whichExperience)">
                Submit
            </v-btn>
        </div>
    </v-container>
</template>