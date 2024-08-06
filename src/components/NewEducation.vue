<script setup>

import { computed, onMounted, ref, watch } from "vue";
import EducationServices from "../services/EducationServices.js";


const props = defineProps({isNewEduVisible: Boolean,
                            account: Object,
                            makeSnackbar: Function,
                            getEducationInfo: Function,
});

const isEducationFilled = computed(() => {
    var endGrad = isAttending.value ? (schoolGrad.value !== "" && schoolGrad.value !== null) :
        (schoolEnd.value !== "" && schoolEnd.value !== null)
    var isdegree = degreeTitle.value == 'High School Diploma' || (degree.value !== "" && degree.value !== null &&
        degreeTitle.value !== "" && degreeTitle.value !== null &&
        degreeType.value !== "" && degreeType.value !== null)
    return (
        schoolName.value !== "" && schoolName.value !== null &&
        schoolCity.value !== "" && schoolCity.value !== null &&
        schoolState.value !== "" && schoolState.value !== null &&
        schoolStart.value !== "" && schoolStart.value !== null &&
        isdegree && endGrad
    )
});


const isMinors = ref(false);
const isCourses = ref(false);
const isStudyAbroad = ref(false);
const isAwards = ref(false);

const isAttending = ref(false);


function toggleIsAttending() {
    isAttending.value = !isAttending.value;

    if (isAttending.value == false) {
        schoolGrad.value = null;
    }
}

const schoolName = ref("");
const schoolCity = ref("");
const schoolState = ref("");
const gpa = ref("");
const maxGpa = ref("");
const degree = ref("");
const schoolStart = ref("");
const schoolEnd = ref("");
const schoolGrad = ref(null);
const degreeTitle = ref("");
const degreeType = ref("");
const minors = ref(null);
const courses = ref(null);
const attending = ref(false);
const awards = ref(null);
const studyAbroadTitle = ref(null);
const studyAbroadOrganization = ref(null);
const studyAbroadLocation = ref(null);
const studyAbroadTime = ref(null);
const studyAbroadYear = ref(null);

const emit = defineEmits(['update:isNewEduVisible']);

const isNewEduVisible = ref(props.isNewEduVisible);

watch(() => props.isNewEduVisible, (newVal) => {
    isNewEduVisible.value = newVal;
});

async function closeEducation() {
    isNewEduVisible.value = false;
    isCourses.value = false;
    isMinors.value = false;
    schoolStart.value = null;
    schoolEnd.value = null;
    schoolGrad.value = null;
    gpa.value = null;
    schoolName.value = null;
    schoolCity.value = null;
    schoolState.value = null;
    courses.value = null;
    minors.value = null;
    maxGpa.value = null;
    degree.value = null;
    degreeTitle.value = "";
    degreeType.value = null;
    awards.value = null;
    studyAbroadTitle.value = null;
    studyAbroadOrganization.value = null;
    studyAbroadLocation.value = null;
    studyAbroadTime.value = null;
    studyAbroadYear.value = null;
    emit('update:isNewEduVisible', false);
}


async function addNewEducation() {
    var tempTitle = schoolState.value + " " + schoolStart.value + " " + gpa.value;
    var tempDegree = degreeTitle.value + " of " + degreeType.value + " in " + degree.value;
    var studyAbroad = null;
    if (studyAbroadTitle !== null && studyAbroadTitle !== "") {
        studyAbroad = {
            "title": studyAbroadTitle.value,
            "organization": studyAbroadOrganization.value,
            "location": studyAbroadLocation.value,
            "term": studyAbroadTime.value,
            "year": studyAbroadYear.value
        }
    }

    if (degreeTitle.value == "High School Diploma") {
        tempDegree = degreeTitle.value;
    }

    if (schoolGrad.value !== null) {
        schoolEnd.value = schoolGrad.value;
    }

    await EducationServices.addEducation(tempTitle, tempDegree, props.account.id,
        schoolStart.value, schoolEnd.value, schoolGrad.value, gpa.value, schoolName.value,
        schoolCity.value, schoolState.value, courses.value, minors.value, maxGpa.value,
        awards.value, studyAbroad)
        .then(() => {
            props.makeSnackbar("green", "Education Added")
            closeEducation();
            props.getEducationInfo();
        })
        .catch((error) => {
            console.log(error);
            props.makeSnackbar("error", error.response.data.message)
        });
}


function showMinors() {
    isMinors.value = !isMinors.value;

    if (isMinors.value == false) {
        minors.value = null;
    }
}

function showCourses() {
    isCourses.value = !isCourses.value;

    if (isCourses.value == false) {
        courses.value = null;
    }
}

function showStudyAbroad() {
    isStudyAbroad.value = !isStudyAbroad.value;

    if (isStudyAbroad.value == false) {
        studyAbroadTitle.value = null;
        studyAbroadOrganization.value = null;
        studyAbroadLocation.value = null;
        studyAbroadTime.value = null;
        studyAbroadYear.value = null;
    }
}

function showAwards() {
    isAwards.value = !isAwards.value;

    if (isAwards.value == false) {
        awards.value = null;
    }
}
</script>

<template>

<v-container v-if="isNewEduVisible">
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="schoolName" label="School Name"></v-text-field>
                                        </v-col>

                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="schoolCity" label="City"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="schoolState" label="State" hint="Two letters for State"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="gpa" label="GPA" hint="Ex: 3.67"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="maxGpa" label="Max GPA" hint="Ex: 3.67"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row class="mb-1" v-if="degreeTitle != ''">

                                        <v-card-subtitle align="center"
                                            v-if="degreeTitle != 'High School Diploma'">Displayed as: {{ degreeTitle }}
                                            of {{ degreeType }} in {{ degree }}</v-card-subtitle>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <v-combobox v-model="degreeTitle" label="Title of Degree"
                                                :items="['Bachelor', 'Masters', 'Associates', 'PhD', 'Certificate', 'High School Diploma']"></v-combobox>
                                        </v-col>
                                        <v-col>
                                            <v-combobox v-model="degreeType" label="Degree Type"
                                                :items="['Science', 'Arts', 'Fine Arts', 'Architecture']"
                                                :disabled="degreeTitle == 'High School Diploma'"></v-combobox>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="degree" label="Degree"
                                                :disabled="degreeTitle == 'High School Diploma'"></v-text-field>
                                        </v-col>
                                    </v-row>


                                    <v-row>
                                        <v-col>
                                            <v-text-field v-model="schoolStart" label="Start Date"
                                                hint="Ex: Aug 2024"></v-text-field>
                                        </v-col>
                                        <v-col>
                                            <v-text-field v-model="schoolEnd" v-if="!isAttending" label="End Date"
                                                hint="Ex: Aug 2024"></v-text-field>
                                            <v-text-field v-model="schoolGrad" v-if="isAttending" label="Grad Date"
                                                hint="Ex: Aug 2024"></v-text-field>
                                            <v-switch v-model="attending" label="Still Attending" color="primary"
                                                @click="toggleIsAttending()"></v-switch>
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-container align="center">
                                            <v-btn variant="text" @click="showMinors">
                                                Add Minor
                                            </v-btn>
                                            <div class="mb-6">
                                                <v-spacer></v-spacer>
                                            </div>

                                            <div v-if="isMinors">


                                                <v-text-field label=" Minor(s)" v-model="minors"
                                                    hint="If multiple, format as: Minor #1, Minor #2">

                                                </v-text-field>

                                            </div>

                                            <v-btn variant="text" @click="showCourses">
                                                Add Courses
                                            </v-btn>

                                            <div class="mb-6">
                                                <v-spacer></v-spacer>
                                            </div>
                                            <div v-if="isCourses">


                                                <v-text-field label="Course(s)" v-model="courses"
                                                    hint="If multiple, format as: Course name, Course name">

                                                </v-text-field>

                                            </div>

                                            <v-btn variant="text" @click="showAwards">
                                                Add Awards
                                            </v-btn>

                                            <div class="mb-6">
                                                <v-spacer></v-spacer>
                                            </div>
                                            <div v-if="isAwards">


                                                <v-text-field label="Award(s)" v-model="awards"
                                                    hint="If multiple, format as: Award, Award">

                                                </v-text-field>

                                            </div>

                                            <v-btn variant="text" @click="showStudyAbroad">
                                                Add Study Abroad
                                            </v-btn>

                                            <div class="mb-6">
                                                <v-spacer></v-spacer>
                                            </div>
                                            <div v-if="isStudyAbroad">
                                                <v-row>
                                                    <v-text-field label="Title" v-model="studyAbroadTitle"
                                                        hint="Name of Study Abroad Program">
                                                    </v-text-field>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="studyAbroadOrganization"
                                                            label="Organization"
                                                            hint="Ex) Capital Normal"></v-text-field>
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field v-model="studyAbroadLocation" label="Location"
                                                            hint="Ex) Beijing, China"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col>
                                                        <v-text-field v-model="studyAbroadTime" label="Term"
                                                            hint="Ex) Fall Semester"></v-text-field>
                                                    </v-col>
                                                    <v-col>
                                                        <v-text-field v-model="studyAbroadYear" label="Year"
                                                            hint="Ex) 2018"></v-text-field>
                                                    </v-col>
                                                </v-row>



                                            </div>

                                        </v-container>




                                    </v-row>

                                    <v-col>

                                    </v-col>
                                    <v-btn variant="tonal" @click="closeEducation()">
                                        Cancel
                                    </v-btn>
                                    &nbsp;&nbsp;&nbsp;
                                    <v-btn variant="tonal" :disabled="!isEducationFilled" @click="addNewEducation()">
                                        Submit
                                    </v-btn>
                                </v-container>

</template>