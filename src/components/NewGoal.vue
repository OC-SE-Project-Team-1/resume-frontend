<script setup>
import { computed, ref, watch } from "vue";
import GoalServices from "../services/GoalServices.js";

const props = defineProps({
    isNewGoalVisible: Boolean,
    account: Object,
    makeSnackbar: Function,
    getGoals: Function,

});

const isGoals = computed(() => {
    return (
        goalTitle.value !== "" &&
        goalDescription.value !== ""
    )
});

const goalTitle = ref("");
const goalDescription = ref("");
const aiGoalExperiences = ref();
const aiGoalAchievements = ref();
const aiGoalTitle = ref();
let goalChatHistory = [];

const dialog = ref(false);
const isRequestingAiAssist = ref(false);

const emit = defineEmits(['update:isNewGoalVisible']);

const isNewGoalVisible = ref(props.isNewGoalVisible);

watch(() => props.isNewGoalVisible, (newVal) => {
    isNewGoalVisible.value = newVal;
});

async function closeNewGoal() {
    isNewGoalVisible.value = false;
    goalTitle.value = "";
    goalDescription.value = "";
    emit('update:isNewGoalVisible', false);
}

async function addNewGoal() {
    await GoalServices.addGoal(goalTitle.value, goalDescription.value, parseInt(props.account.id), goalChatHistory)
        .then(() => {
            props.makeSnackbar("green", "Goal Added!")
            closeNewGoal();
            props.getGoals();
        })
        .catch((error) => {
            console.log(error);
            props.makeSnackbar("error", props.error.response.data.message)
        });
}

async function aiGoalAssist() {
    isRequestingAiAssist.value = true;
    await GoalServices.goalAiAssist(aiGoalTitle.value, aiGoalExperiences.value.split(","), aiGoalAchievements.value.split(","))
        .then((response) => {
            goalDescription.value = response.data.description
            goalChatHistory.push(response.data.chatHistory[0])
            goalChatHistory.push(response.data.chatHistory[1])
            clearGoalAiAssist();
        })
}

function clearGoalAiAssist() {
    aiGoalExperiences.value = null;
    aiGoalAchievements.value = null;
    aiGoalTitle.value = null;
    isRequestingAiAssist.value = false;
}
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <v-skeleton-loader v-if="isRequestingAiAssist" type="paragraph"></v-skeleton-loader>
                <v-text-field v-if="!isRequestingAiAssist" v-model="goalTitle" label="Title">
                </v-text-field>
            </v-col>
        </v-row>
        <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
        <v-row>
            <v-textarea v-if="!isRequestingAiAssist" v-model="goalDescription"
                label="A brief overview of your skills and experiences">
                <template #append-inner>
                    <div class="text-center pa-4">
                        <v-dialog v-model="dialog" persistent>
                            <template v-slot:activator="{ props: activatorProps }">
                                <v-btn color="secondary" rounded="xl" value="Ai Assist" v-bind="activatorProps">
                                    AI Assist
                                </v-btn>
                            </template>

                            <v-card 
                                text="Please list your Experiences and Achievements that you want to include in the summary, separated by commas(,) ."
                                title="Goal AI Assist">
                                    <v-spacer></v-spacer>
                                        <v-row class="px-10 pt-4">
                                            <v-text-field label="Experiences" v-model="aiGoalExperiences"
                                                variant="outlined" style="width: 30%;"> 
                                            </v-text-field>
                                        </v-row>
                                        <v-row class="px-10">
                                            <v-text-field label="Achievements" v-model="aiGoalAchievements"
                                                variant="outlined" style="width: 30%;">
                                            </v-text-field>
                                        </v-row>
                                        <v-row class="px-10">
                                            <v-text-field label="Professional title" v-model="aiGoalTitle"
                                                variant="outlined" style="width: 30%;">
                                            </v-text-field>
                                        </v-row>
                                        <div align="center">
                                            <v-row style="width:50%" class="my-2">
                                                <v-col>
                                                    <v-btn @click="clearGoalAiAssist(), dialog = false">
                                                        Cancel </v-btn>
                                                </v-col>
                                                <v-col>
                                                    <v-btn @click="aiGoalAssist(), dialog = false">
                                                        Confirm </v-btn>
                                                </v-col>
                                            </v-row>
                                        </div>
                            </v-card>
                        </v-dialog>
                    </div>
                </template>
            </v-textarea>
        </v-row>
        <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="closeNewGoal()">
            Cancel
        </v-btn>
        &nbsp;&nbsp;&nbsp;
        <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isGoals" @click="addNewGoal()">
            Submit
        </v-btn>
    </v-container>
</template>