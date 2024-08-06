<script setup>

import { computed, onMounted, ref, watch } from "vue";
import SkillServices from "../services/SkillServices.js";



const props = defineProps({
    isNewSkillVisible: Boolean,
    account: Object,
    makeSnackbar: Function,
    getSkills: Function,
    skillAiAssist: Function,
    isRequestingAiAssist:Boolean,
    skillDescription: String,
    skillHistory: Array,


});

const isSkilled = computed(() => {
    return (
        skillTitle.value !== "" &&
        skillDescription.value !== ""
    )
});


const skillTitle = ref("");
const skillDescription = ref("");
const skills = ref();
let skillHistory = [];
const selectedSkills = ref(null);

const isRequestingAiAssist = ref(props.isRequestingAiAssist);

const localisRequestingAiAssist = ref(props.isRequestingAiAssist);



const emit = defineEmits(['update:isNewSkillVisible', 'update:skillDescription', 'update:skillHistory']);

const isNewSkillVisible = ref(props.isNewSkillVisible);

watch(() => props.isNewSkillVisible, (newVal) => {
    isNewSkillVisible.value = newVal;
});
watch(() => props.skillDescription, (newVal) => {
    skillDescription.value = newVal;
});
watch(() => props.skillHistory, (newVal) => {
    skillHistory.value = newVal;
});

watch(() => props.isRequestingAiAssist, (newValue) => {
    isRequestingAiAssist.value = newValue;
});



async function addNewSkill() {
    await SkillServices.addSkill(skillTitle.value, skillDescription.value, skillHistory, parseInt(props.account.id))
        .then(() => {
            props.makeSnackbar("green", "Skill Added!")
            closeNewSkill();
            props.getSkills();
        })
        .catch((error) => {
            console.log(error);
            props.makeSnackbar("error", error.response.data.message)
        });
}


async function closeNewSkill() {
    isNewSkillVisible.value = false;
    skillTitle.value = "";
    skillDescription.value = "";
    skillHistory = [];
    emit('update:isNewSkillVisible', false);
}

</script>

<template>
    <v-container >
        <v-skeleton-loader v-if="isRequestingAiAssist" type="paragraph"></v-skeleton-loader>
        <v-row>
            <v-col>
                <v-text-field v-if="!isRequestingAiAssist" v-model="skillTitle" label="Skill"></v-text-field>
            </v-col>
        </v-row>

        <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
        <v-row>
            <v-col>
                <v-textarea v-if="!isRequestingAiAssist" v-model="skillDescription"
                    label="Brief Description/Proficientcy Level, click AI assist button along with your input to help create a better description">
                    <template #append-inner>
                        <v-btn color="secondary" rounded="xl" value="Ai Assist" @click="props.skillAiAssist(false)">
                            AI Assist
                        </v-btn>
                    </template>
                </v-textarea>
            </v-col>
        </v-row>
        <v-col>

        </v-col>
        <v-btn v-if="!isRequestingAiAssist" variant="tonal" @click="closeNewSkill()">
            Cancel
        </v-btn>
        &nbsp;&nbsp;&nbsp;
        <v-btn v-if="!isRequestingAiAssist" variant="tonal" :disabled="!isSkilled" @click="addNewSkill()">
            Submit
        </v-btn>
    </v-container>
</template>