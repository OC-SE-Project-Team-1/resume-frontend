<script setup>
import { computed, ref, watch } from "vue";
import LinkServices from "../services/LinkServices.js";

const props = defineProps({
    isNewLinkVisible: Boolean,
    account: Object,
    makeSnackbar: Function,
    getLinks: Function,
});

const isLinked = computed(() => {
    return (
        link.value !== "" &&
        linkDescription.value !== ""
    )
});


const linkDescription = ref("");
const link = ref("");

const emit = defineEmits(['update:isNewLinkVisible']);

const isNewLinkVisible = ref(props.isNewLinkVisible);

watch(() => props.isNewLinkVisible, (newVal) => {
    isNewLinkVisible.value = newVal;
});

function closeNewLink() {
    isNewLinkVisible.value = false;
    link.value = "";
    linkDescription.value = "";
    emit('update:isNewLinkVisible', false);
}

async function addNewLink() {
    await LinkServices.addLink(link.value, linkDescription.value, parseInt(props.account.id))
        .then(() => {
            props.makeSnackbar("green", "Link Added!")
            closeNewLink();
            props.getLinks();
        })
        .catch((error) => {
            console.log(error);
            props.makeSnackbar("error", props.error.response.data.message)
        });
}
</script>

<template>
    <v-container>
        <v-row>
            <v-col>
                <v-text-field v-model="linkDescription" label="Description"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field v-model="link" label="Link"></v-text-field>
            </v-col>
        </v-row>
        <v-col>

        </v-col>
        <v-btn variant="tonal" @click="closeNewLink()">
            Cancel
        </v-btn>
        &nbsp;&nbsp;&nbsp;
        <v-btn variant="tonal" :disabled="!isLinked" @click="addNewLink()">
            Submit
        </v-btn>
    </v-container>
</template>