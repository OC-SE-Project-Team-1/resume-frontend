<script setup>
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";

const account = ref();
//Snackbar to display errors
const snackbar = ref({
    value: false,
    color: "",
    text: "",
});
const isNewLinkVisible = ref(false);
const tab = ref("0");
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
            "Others"]
    }
);

const personalInfo = ref();
const firstName = ref();
const lastName = ref();
const address = ref();
const phoneNumber = ref();
const email = ref();
const jobtitle = ref();

const selectedSections = ref();

const isPersonalDetails = ref(false);
const isProfSum = ref(false);
const isEducation = ref(false);
const isExperience = ref(false);
const isSkills = ref(false);
const isOthers = ref(false);


onMounted(() => {
    account.value = JSON.parse(localStorage.getItem("account"));
    console.log(account.value);
    // resumeSection.value = JSON.parse(localStorage.getItem("resumeSections"));
    resumeTemplate.value = JSON.parse(localStorage.getItem("resumeTemplate"));
    console.log(resumeTemplate.value);
});

function closeSnackBar() {
    snackbar.value.value = false;
}

async function setNewLinkVisible() {
    isNewLinkVisible.value = true;
}

async function closeNewLink() {
    isNewLinkVisible.value = false;
}

async function addNewLink() {
    closeNewLink();
}
async function nextTab(input) {

    //const temp = parseInt(tab.value) + 1;
    const temp = input + 1;

    if (temp == 1) {

        console.log("TESTED AND THIS IS FIRST TAB");
        if (isPersonalDetails.value == false) {
            console.log("First tab isn't visible");

            console.log(temp);
            nextTab(temp);

        }
        else {
            tab.value = temp.toString();
            resetNewInput();
        }
    }
    else if (temp == 2) {
        console.log("TESTED AND THIS IS SECOND TAB");
        if (isProfSum.value == false) {
            nextTab(temp);
        } else {
            tab.value = temp.toString();
            resetNewInput();
        }
    }
    else if (temp == 3) {
        console.log("TESTED AND THIS IS THIRD TAB");
        if (isEducation.value == false) {
            nextTab(temp);
        } else {
            tab.value = temp.toString();
            resetNewInput();
        }
    }
    else if (temp == 4) {
        console.log("TESTED AND THIS IS FOURTH TAB");
        if (isExperience.value == false) {
            nextTab(temp);
        } else {
            tab.value = temp.toString();
            resetNewInput();
        }
    }
    else if (temp == 5) {
        console.log("TESTED AND THIS IS FIFTH TAB");
        if (isSkills.value == false) {
            nextTab(temp);
        } else {
            tab.value = temp.toString();
            resetNewInput();
        }
    }
    else if (temp == 6) {
        console.log("TESTED AND THIS IS SIXTH TAB");
        if (isSkills.value == false) {
            nextTab(temp);
        } else {
            tab.value = temp.toString();
            resetNewInput();
        }
    }
    else if (temp == 7) {
        console.log("TESTED AND THIS IS SEVENTH TAB");
        if (isSkills.value == false) {
            nextTab(temp);
        } else {
            tab.value = temp.toString();
            resetNewInput();
        }
    }


}

async function resetNewInput() {

    isNewLinkVisible.value = false;
}

async function showTab(index) {
    if (index == "Personal Details") {
        isPersonalDetails.value = !isPersonalDetails.value;
        console.log("1");
    }
    else if (index == "Professional Summary") {
        isProfSum.value = !isProfSum.value;
        console.log("2");
    }
    else if (index == "Education") {
        isEducation.value = !isEducation.value;
        console.log("3");
    }
    else if (index == "Experience") {
        isExperience.value = !isExperience.value;
        console.log("4");
    }
    else if (index == "Skills") {
        isSkills.value = !isSkills.value;
        console.log("5");
    }
    else if (index == "Others") {
        isOthers.value = !isOthers.value;
        console.log("6");
    }

}

async function getPersonalInfo() {
    resetNewInput()
    console.log("HEEEEEEEEELLLLLLLOOOOOO")
    await UserServices.getUser(parseInt(account.value.id))
        .then((response) => {
            personalInfo.value = response.data;
            firstName.value = personalInfo.value.firstName;
            lastName.value = personalInfo.value.lastName;
            address.value = personalInfo.value.address;
            phoneNumber.value = personalInfo.value.phoneNumber;
            email.value = personalInfo.value.email;
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
        });
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
        <v-card>
            <v-sheet elevation="3" rounded="lg" align="center">
                <v-tabs v-model="tab" :items="tabs" align-tabs="center" height="60" slider-color="#f78166">

                    <v-tab value="0" @click="resetNewInput()">Sections</v-tab>
                    <v-tab value="1" @click="getPersonalInfo()" v-if="isPersonalDetails">Personal Details</v-tab>
                    <v-tab value="2" @click="resetNewInput()" v-if="isProfSum">Professional Summary</v-tab>
                    <v-tab value="3" @click="resetNewInput()" v-if="isEducation">Education</v-tab>
                    <v-tab value="4" @click="resetNewInput()" v-if="isExperience">Experience</v-tab>
                    <v-tab value="5" @click="resetNewInput()" v-if="isSkills">Skills</v-tab>
                    <v-tab value="6" @click="resetNewInput()" v-if="isOthers">Others</v-tab>
                    <v-tab value="7" @click="resetNewInput()">Preview Resume</v-tab>


                </v-tabs>


                <v-tabs-window v-model="tab">

                    <v-tabs-window-item value="0" style="padding: 50px">
                        <v-row>
                            <v-col>
                                <v-label>Required Sections</v-label>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-list lines="one">
                                    <v-list-item v-model="selectedSections"
                                        v-for="n in resumeSections[parseInt(resumeTemplate)]" :key="n" :title="n">
                                        <template v-slot:prepend="{ isActive }">
                                            <v-list-item-action start>
                                                <v-checkbox-btn :model-value="isActive"
                                                    @click="showTab(n)"></v-checkbox-btn>
                                            </v-list-item-action>
                                        </template>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>


                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <div align="right">

                            <v-btn variant="tonal" @click="nextTab(0)">
                                Next
                            </v-btn>
                        </div>
                    </v-tabs-window-item>


                    <v-tabs-window-item value="1" style="padding: 50px">
                        <v-row>
                            <v-col>
                                <v-text-field v-model="firstName" label="First Name"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field v-model="lastName" label="Last Name"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="jobtitle" label="Job Title"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="address" label="Address"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="phoneNumber" label="Phone Number"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field v-model="email" label="Email Address"></v-text-field>
                            </v-col>
                        </v-row>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-btn variant="text" @click="setNewLinkVisible()">
                            + Add New link
                        </v-btn>

                        <v-container v-if="isNewLinkVisible">
                            <v-row>
                                <v-col>
                                    <v-text-field label="Description"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="Link"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-col>

                            </v-col>
                            <v-btn variant="tonal" @click="closeNewLink()">
                                Cancel
                            </v-btn>
                            &nbsp;&nbsp;&nbsp;
                            <v-btn variant="tonal" @click="addNewLink()">
                                Submit
                            </v-btn>
                        </v-container>


                        <div align="right">

                            <v-btn variant="tonal" @click="nextTab(1)">
                                Next
                            </v-btn>
                        </div>
                    </v-tabs-window-item>


                    <v-tabs-window-item value="2" style="padding: 50px">

                        <div align="left">
                            <v-text class="headline mb-2">Create Job Summary: </v-text>
                            <div class="mb-10">
                                <v-spacer></v-spacer>
                            </div>
                            <v-row>
                                <v-textarea label="Work Summary">
                                    <template #append-inner>
                                        <v-btn color="secondary" rounded="xl" value="Ai Assist">
                                            AI Assist
                                        </v-btn>
                                    </template>
                                </v-textarea>
                            </v-row>

                            <div align="right">

                                <v-btn variant="tonal" @click="nextTab(2)">
                                    Next
                                </v-btn>
                            </div>

                        </div>

                    </v-tabs-window-item>

                    <v-tabs-window-item value="3" style="padding: 50px">

                        <div align="left">
                            <v-text class="headline mb-2">Select Education: </v-text>

                            <v-container>
                                <v-list lines="two">
                                    <v-list-item v-for="n in 3" :key="n">
                                        <v-row>
                                            <v-col cols="2">
                                                <v-checkbox></v-checkbox>
                                            </v-col>
                                            <v-col cols="10">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ 'School name' }}, {{ 'City' }}, {{ 'State'
                                                        }}</v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        Start date - End Date
                                                    </v-list-item-subtitle>
                                                    <v-list-item-subtitle>
                                                        Degree
                                                    </v-list-item-subtitle>
                                                    <v-list-item-subtitle>
                                                        GPA
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-col>
                                        </v-row>

                                    </v-list-item>
                                </v-list>
                            </v-container>

                        </div>


                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>


                        <v-btn variant="tonal" @click="setNewLinkVisible">
                            Add New Education
                        </v-btn>

                        <v-container v-if="isNewLinkVisible">
                            <v-row>
                                <v-col>
                                    <v-text-field label="School Name"></v-text-field>
                                </v-col>

                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field label="City"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="State"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field label="GPA"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="Degree"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col>
                                    <v-text-field label="Start Date"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="Grad Date"></v-text-field>
                                    <v-switch label="Still Attending" color="primary"></v-switch>
                                </v-col>
                            </v-row>

                            <v-col>

                            </v-col>
                            <v-btn variant="tonal" @click="closeNewLink()">
                                Cancel
                            </v-btn>
                            &nbsp;&nbsp;&nbsp;
                            <v-btn variant="tonal" @click="addNewLink()">
                                Submit
                            </v-btn>
                        </v-container>

                        <div align="right">

                            <v-btn variant="tonal" @click="nextTab(3)">
                                Next
                            </v-btn>
                        </div>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="4" style="padding: 50px">
                        <div align="left">
                            <v-text class="headline mb-2">Select Job Experiences: </v-text>

                            <v-container>
                                <v-list lines="two">
                                    <v-list-item v-for="n in 3" :key="n">
                                        <v-row>
                                            <v-col cols="2">
                                                <v-checkbox></v-checkbox>
                                            </v-col>
                                            <v-col cols="10">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ 'Job Title' }}</v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        Company, Location, etc
                                                    </v-list-item-subtitle>
                                                    <v-list-item-subtitle>
                                                        Job Description
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-col>
                                        </v-row>

                                    </v-list-item>
                                </v-list>
                            </v-container>

                        </div>


                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>


                        <v-btn variant="tonal" @click="setNewLinkVisible">
                            Add New Job Experience
                        </v-btn>

                        <v-container v-if="isNewLinkVisible">
                            <v-row>
                                <v-col>
                                    <v-text-field label="Position Title"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="Company Name"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field label="City"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="State"></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-text-field label="Start Date"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="End Date"></v-text-field>
                                    <v-switch label="Present Job" color="primary"></v-switch>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-textarea label="Work Summary">
                                    <template #append-inner>
                                        <v-btn color="secondary" rounded="xl" value="Ai Assist">
                                            AI Assist
                                        </v-btn>
                                    </template>
                                </v-textarea>
                            </v-row>

                            <v-col>

                            </v-col>
                            <v-btn variant="tonal" @click="closeNewLink()">
                                Cancel
                            </v-btn>
                            &nbsp;&nbsp;&nbsp;
                            <v-btn variant="tonal" @click="addNewLink()">
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


                        <div align="left">
                            <v-text class="headline mb-2">Select Leadership Experience: </v-text>

                            <v-container>
                                <v-list lines="two">
                                    <v-list-item v-for="n in 3" :key="n">
                                        <v-row>
                                            <v-col cols="2">
                                                <v-checkbox></v-checkbox>
                                            </v-col>
                                            <v-col cols="10">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ 'Title' }}</v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        Organization, Role
                                                    </v-list-item-subtitle>
                                                    <v-list-item-subtitle>
                                                        Description
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-col>
                                        </v-row>

                                    </v-list-item>
                                </v-list>
                            </v-container>

                        </div>


                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>


                        <v-btn variant="tonal" @click="setNewLinkVisible">
                            Add New Leadership Experience
                        </v-btn>

                        <v-container v-if="isNewLinkVisible">
                            <v-row>
                                <v-col>
                                    <v-text-field label="Position"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="Organization Name"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col>
                                    <v-text-field label="Start Date"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="End Date"></v-text-field>
                                    <v-switch label="Present Role" color="primary"></v-switch>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-textarea label="Role Summary">
                                    <template #append-inner>
                                        <v-btn color="secondary" rounded="xl" value="Ai Assist">
                                            AI Assist
                                        </v-btn>
                                    </template>
                                </v-textarea>
                            </v-row>

                            <v-col>

                            </v-col>
                            <v-btn variant="tonal" @click="closeNewLink()">
                                Cancel
                            </v-btn>
                            &nbsp;&nbsp;&nbsp;
                            <v-btn variant="tonal" @click="addNewLink()">
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


                        <div align="left">
                            <v-text class="headline mb-2">Select Activities: </v-text>

                            <v-container>
                                <v-list lines="two">
                                    <v-list-item v-for="n in 3" :key="n">
                                        <v-row>
                                            <v-col cols="2">
                                                <v-checkbox></v-checkbox>
                                            </v-col>
                                            <v-col cols="10">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ 'Title' }}</v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        Organization, Role
                                                    </v-list-item-subtitle>
                                                    <v-list-item-subtitle>
                                                        Description
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-col>
                                        </v-row>

                                    </v-list-item>
                                </v-list>
                            </v-container>

                        </div>


                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>


                        <v-btn variant="tonal" @click="setNewLinkVisible">
                            Add New Activities
                        </v-btn>

                        <v-container v-if="isNewLinkVisible">
                            <v-row>
                                <v-col>
                                    <v-text-field label="Position"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="Organization Name"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col>
                                    <v-text-field label="Start Date"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="End Date"></v-text-field>
                                    <v-switch label="Present Role" color="primary"></v-switch>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-textarea label="Role Summary">
                                    <template #append-inner>
                                        <v-btn color="secondary" rounded="xl" value="Ai Assist">
                                            AI Assist
                                        </v-btn>
                                    </template>
                                </v-textarea>
                            </v-row>

                            <v-col>

                            </v-col>
                            <v-btn variant="tonal" @click="closeNewLink()">
                                Cancel
                            </v-btn>
                            &nbsp;&nbsp;&nbsp;
                            <v-btn variant="tonal" @click="addNewLink()">
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


                        <div align="left">
                            <v-text class="headline mb-2">Select Volunteer Work: </v-text>

                            <v-container>
                                <v-list lines="two">
                                    <v-list-item v-for="n in 3" :key="n">
                                        <v-row>
                                            <v-col cols="2">
                                                <v-checkbox></v-checkbox>
                                            </v-col>
                                            <v-col cols="10">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ 'Title' }}</v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        Organization, Role
                                                    </v-list-item-subtitle>
                                                    <v-list-item-subtitle>
                                                        Description
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-col>
                                        </v-row>

                                    </v-list-item>
                                </v-list>
                            </v-container>

                        </div>


                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>


                        <v-btn variant="tonal" @click="setNewLinkVisible">
                            Add New Volunteer
                        </v-btn>

                        <v-container v-if="isNewLinkVisible">
                            <v-row>
                                <v-col>
                                    <v-text-field label="Position"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="Organization Name"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col>
                                    <v-text-field label="Start Date"></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field label="End Date"></v-text-field>
                                    <v-switch label="Present Role" color="primary"></v-switch>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-textarea label="Role Summary">
                                    <template #append-inner>
                                        <v-btn color="secondary" rounded="xl" value="Ai Assist">
                                            AI Assist
                                        </v-btn>
                                    </template>
                                </v-textarea>
                            </v-row>

                            <v-col>

                            </v-col>
                            <v-btn variant="tonal" @click="closeNewLink()">
                                Cancel
                            </v-btn>
                            &nbsp;&nbsp;&nbsp;
                            <v-btn variant="tonal" @click="addNewLink()">
                                Submit
                            </v-btn>
                        </v-container>




                        <div align="right">

                            <v-btn variant="tonal" @click="nextTab(4)">
                                Next
                            </v-btn>
                        </div>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="5" style="padding: 50px">
                        <!-- skills -->
                        <div align="left">
                            <v-text class="headline mb-2">Select Skill(s): </v-text>

                            <v-container>
                                <v-list lines="two">
                                    <v-list-item v-for="n in 3" :key="n">
                                        <v-row>
                                            <v-col cols="2">
                                                <v-checkbox></v-checkbox>
                                            </v-col>
                                            <v-col cols="10">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ 'Skills' }}</v-list-item-title>
                                                </v-list-item-content>
                                            </v-col>
                                        </v-row>

                                    </v-list-item>
                                </v-list>
                            </v-container>

                        </div>


                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>


                        <v-btn variant="tonal" @click="setNewLinkVisible">
                            Add New Skills
                        </v-btn>

                        <v-container v-if="isNewLinkVisible">
                            <v-row>
                                <v-col>
                                    <v-text-field label="Skill"></v-text-field>
                                </v-col>
                            </v-row>



                            <v-col>

                            </v-col>
                            <v-btn variant="tonal" @click="closeNewLink()">
                                Cancel
                            </v-btn>
                            &nbsp;&nbsp;&nbsp;
                            <v-btn variant="tonal" @click="addNewLink()">
                                Submit
                            </v-btn>
                        </v-container>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <div align="right">

                            <v-btn variant="tonal" @click="nextTab(5)">
                                Next
                            </v-btn>
                        </div>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="6" style="padding: 50px">
                        <!-- skills -->

                        <div align="left">
                            <v-text class="headline mb-2">Select Honors: </v-text>

                            <v-container>
                                <v-list lines="two">
                                    <v-list-item v-for="n in 3" :key="n">
                                        <v-row>
                                            <v-col cols="2">
                                                <v-checkbox></v-checkbox>
                                            </v-col>
                                            <v-col cols="10">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ 'Honor Title' }}</v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        Description
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-col>
                                        </v-row>

                                    </v-list-item>
                                </v-list>
                            </v-container>

                        </div>


                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>


                        <v-btn variant="tonal" @click="setNewLinkVisible">
                            Add New Honor
                        </v-btn>

                        <v-container v-if="isNewLinkVisible">
                            <v-row>
                                <v-col>
                                    <v-text-field label="Honor Title"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-textarea label="Description">
                                    <template #append-inner>
                                        <v-btn color="secondary" rounded="xl" value="Ai Assist">
                                            AI Assist
                                        </v-btn>
                                    </template>
                                </v-textarea>
                            </v-row>

                            <v-col>

                            </v-col>
                            <v-btn variant="tonal" @click="closeNewLink()">
                                Cancel
                            </v-btn>
                            &nbsp;&nbsp;&nbsp;
                            <v-btn variant="tonal" @click="addNewLink()">
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
                        <div align="left">
                            <v-text class="headline mb-2">Select Awards: </v-text>

                            <v-container>
                                <v-list lines="two">
                                    <v-list-item v-for="n in 3" :key="n">
                                        <v-row>
                                            <v-col cols="2">
                                                <v-checkbox></v-checkbox>
                                            </v-col>
                                            <v-col cols="10">
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ 'Title' }}</v-list-item-title>
                                                    <v-list-item-subtitle>
                                                        Description
                                                    </v-list-item-subtitle>
                                                </v-list-item-content>
                                            </v-col>
                                        </v-row>

                                    </v-list-item>
                                </v-list>
                            </v-container>

                        </div>


                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>


                        <v-btn variant="tonal" @click="setNewLinkVisible">
                            Add New Award
                        </v-btn>

                        <v-container v-if="isNewLinkVisible">
                            <v-row>
                                <v-col>
                                    <v-text-field label="Title"></v-text-field>
                                </v-col>

                            </v-row>


                            <v-row>
                                <v-textarea label="Award Description">
                                    <template #append-inner>
                                        <v-btn color="secondary" rounded="xl" value="Ai Assist">
                                            AI Assist
                                        </v-btn>
                                    </template>
                                </v-textarea>
                            </v-row>

                            <v-col>

                            </v-col>
                            <v-btn variant="tonal" @click="closeNewLink()">
                                Cancel
                            </v-btn>
                            &nbsp;&nbsp;&nbsp;
                            <v-btn variant="tonal" @click="addNewLink()">
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

                        <div align="right">

                            <v-btn variant="tonal" @click="nextTab(6)">
                                Next
                            </v-btn>
                        </div>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="7" style="padding: 50px">

                        <div>
                            <p> Resume Preview will be here</p>
                            <v-container>
                                <v-skeleton-loader type="card"></v-skeleton-loader>
                            </v-container>
                        </div>





                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>

                        <v-divider></v-divider>

                        <div class="mb-10">
                            <v-spacer></v-spacer>
                        </div>


                        <v-checkbox-btn :model-value="isActive" @click="showTab(n)"
                            label=" Allow feedback"></v-checkbox-btn>



                        <div align="right">

                            <v-btn variant="tonal" @click="">
                                Generate resume
                            </v-btn>
                        </div>
                    </v-tabs-window-item>







                </v-tabs-window>




            </v-sheet>

        </v-card>

        <!-- Snackbar Pop Up -->
        <v-snackbar v-model="snackbar.value" rounded="pill">
            {{ snackbar.text }}
            <template v-slot:actions>
                <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">Close</v-btn>
            </template>
        </v-snackbar>
    </v-container>

</template>