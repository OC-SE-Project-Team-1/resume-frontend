<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import template1 from "/Template1.png";
import template2 from "/Template2.png";
import template3 from "/Template3.png";
import template4 from "/Template4.png";

const router = useRouter();
const account = ref(null);
const resumeTitle = ref();
const resumeTemplate = ref();
const resumeSections = ref(
    {
        0: ["Personal Details",
            "Professional Summary",
            "Education",
            "Experience",
            "Skills"],
        1: ["Personal Details",
            "Professional Summary",
            "Education",
            "Experience"],
        2: ["Personal Details",
            "Professional Summary",
            "Education",
            "Experience",
            "Skills"],
        3: ["Personal Details",
            "Professional Summary",
            "Education",
            "Experience",
            "Skills",
            "Other"]
    }
);

onMounted(() => {
    resumeTitle.value = null;
    resumeTemplate.value = null;
    // window.localStorage.setItem("resumeTitle", JSON.stringify(resumeTitle.value));
    // window.localStorage.setItem("resumeTemplate", JSON.stringify(resumeTemplate.value));
    localStorage.removeItem("resumeTitle");
    localStorage.removeItem("resumeTemplate");
    localStorage.removeItem("resumeSections");
});

async function newResumeInfo() {
    window.localStorage.setItem("resumeTitle", JSON.stringify(resumeTitle.value));
    window.localStorage.setItem("resumeTemplate", JSON.stringify(resumeTemplate.value));
    window.localStorage.setItem("resumeSections", JSON.stringify(resumeSections));
}

</script>

<script>
export default {
    data: () => ({
        selection: [],
    }),
}
</script>

<template>
    <v-container>
        <div id="body">
             <div class="mb-3">
                <v-card-title class="pl-0 text-h4 font-weight-bold">Create your Resume
                </v-card-title>
            </div>
            <div class="mb-3">
                <v-card-title class="pl-0 text-h5 font-weight-bold" align="center">Select a Template
                </v-card-title>
            </div>
        </div>
    </v-container>

    <v-card class="mx-auto" max-width="1000">
        <v-container class="pa-1">
            <v-item-group v-model="resumeTemplate">
                <v-row>
                    

                    <v-tooltip :text="resumeSections[0].join(', ')">
                        <template v-slot:activator="{ props }">
                            <v-col v-bind="props">
                            <v-item v-slot="{ isSelected, toggle }">
                                <v-img :src=template1 height="500" @click="toggle">
                                    <v-btn :icon="isSelected ? 'mdi-heart' : 'mdi-heart-outline'"></v-btn>
                                </v-img>
                            </v-item>
                        </v-col>
                        </template>
                    </v-tooltip>

                    <v-tooltip :text="resumeSections[1].join(', ')">
                        <template v-slot:activator="{ props }">
                             <v-col v-bind="props">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-img :src=template2 height="500" @click="toggle">
                                        <v-btn :icon="isSelected ? 'mdi-heart' : 'mdi-heart-outline'"></v-btn>
                                    </v-img>
                                </v-item>
                            </v-col>
                        </template>
                    </v-tooltip>
                </v-row>

                <v-row>

                    <v-tooltip :text="resumeSections[2].join(', ')">
                        <template v-slot:activator="{ props }"> 
                            <v-col v-bind="props">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-img :src=template3 height="500" @click="toggle">
                                        <v-btn :icon="isSelected ? 'mdi-heart' : 'mdi-heart-outline'"></v-btn>
                                    </v-img>
                                </v-item>
                            </v-col>
                        </template>
                    </v-tooltip>

                    <v-tooltip :text="resumeSections[3].join(', ')">
                        <template v-slot:activator="{ props }">
                            <v-col v-bind="props">
                                <v-item v-slot="{ isSelected, toggle }">
                                    <v-img :src=template4 height="500" @click="toggle">
                                        <v-btn :icon="isSelected ? 'mdi-heart' : 'mdi-heart-outline'"></v-btn>
                                    </v-img>
                                </v-item>
                            </v-col>
                         </template>
                    </v-tooltip>
                </v-row>
            </v-item-group>

        </v-container>


    </v-card>
    <div class="mb-10">
        <v-spacer></v-spacer>
    </div>
    <div align="center">
        <v-text-field label="Create title" v-model="resumeTitle" variant="solo-filled"
            style="width: 25%;"></v-text-field>

        <v-btn variant="tonal" :to="{ name: 'inputInfo' }" @click="newResumeInfo()">
            Next
        </v-btn>

    </div>
    <div class="mb-10">
        <v-spacer></v-spacer>
    </div>
</template>

<style>
.v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: 0.9;
    position: absolute;
    width: 100%;
}
</style>