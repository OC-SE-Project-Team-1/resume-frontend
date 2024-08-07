<script setup>
import { ref, watch } from "vue";
import LinkServices from "../services/LinkServices.js";
import GoalServices from "../services/GoalServices.js";
import SkillServices from "../services/SkillServices.js";
import EducationServices from "../services/EducationServices.js";
import ExperienceServices from "../services/ExperienceServices.js";
import { useRoute } from 'vue-router';

const props = defineProps({
    isDeleted: Boolean,
    tab: String,
    deleteItemId: Number,
    account: Object,
    makeSnackbar: Function,
    getLinks: Function,
    getGoals: Function,
    getEducationInfo: Function,
    getExperiences: Function,
    getSkills: Function,
});


const route = useRoute();
const emit = defineEmits(['update:isDeleted']);
const isDeleted = ref(props.isDeleted);

watch(() => props.isDeleted, (newVal) => {
    isDeleted.value = newVal;
});

function closeDelete() {
    isDeleted.value = false;
    emit('update:isDeleted', false);
}

async function deleteItem() {
    if (route.path.includes('/database')) {
        switch (parseInt(props.tab)) {
            case 1:
                await deleting(LinkServices.deleteLink);
                props.getLinks();
                break;
            case 2:
                await deleting(GoalServices.deleteGoal);
                props.getGoals();
                break;
            case 3:
                await deleting(EducationServices.deleteEducation);
                props.getEducationInfo();
                break;
            case 4: case 5: case 6: case 7: case 9: case 10: case 11:
                await deleting(ExperienceServices.deleteExperience);
                props.getExperiences();
                break;
            case 8:
                await deleting(SkillServices.deleteSkill);
                props.getSkills();
                break;
        }
    } else if (route.path.includes('/createResume')) {
        switch (parseInt(props.tab)) {
            case 1:
                await deleting(LinkServices.deleteLink);
                props.getLinks();
                break;
            case 2:
                await deleting(GoalServices.deleteGoal);
                props.getGoals();
                break;
            case 3:
                await deleting(EducationServices.deleteEducation);
                props.getEducationInfo();
                break;
            case 4: case 6:
                await deleting(ExperienceServices.deleteExperience);
                props.getExperiences();
                break;
            case 5:
                await deleting(SkillServices.deleteSkill);
                props.getSkills();
                break;
        }
    }
    closeDelete();
}

async function deleting(deleteItem) {
    await deleteItem(props.deleteItemId, props.account.id)
        .then(() => {
            props.makeSnackbar("green", "Item Deleted!");
        })
        .catch((error) => {
            console.log(error);
            props.makeSnackbar("error", error.response.data.message);
        });

}

</script>

<template>
    <v-dialog  persistent v-model="props.isDeleted" width="800" >
        <v-card class="rounded-lg elevation-5" style="margin: 20%; padding-top: 1%; padding-bottom: 1%; padding-left:2%; padding-right:2%">
            <v-card-title class="text-center headline mb-2">Delete Item?</v-card-title>
            <p align="center">You will be unable to retrieve this item once
                deleted!</p>

            <v-card-actions style="padding-top: 5%;">
                <v-btn variant="text" color="accent" @click="closeDelete()">Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="primary" @click="deleteItem()">Delete</v-btn>

            </v-card-actions>
        </v-card>
    </v-dialog>
</template>