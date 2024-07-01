<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const isNewLinkVisible = ref(false);
const tab= ref("1");

async function setNewLinkVisible () {
    isNewLinkVisible.value = true;
}

async function closeNewLink() {
    isNewLinkVisible.value = false;
}

async function addNewLink() {

    closeNewLink();
}
async function nextTab() {

    const temp = parseInt(tab.value) + 1;
    tab.value = temp.toString();
    resetNewInput();
}

async function resetNewInput() {
    
    isNewLinkVisible.value = false;
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
            <v-sheet color="#0d1117" elevation="3" rounded="lg" align="center">
                <v-tabs
                    v-model="tab"
                    :items="tabs"
                    align-tabs="center"
                    color="white"
                    height="60"
                    slider-color="#f78166"
                >
                   
                <v-tab value="1" @click="resetNewInput()">Personal Details</v-tab>
                <v-tab value="2" @click="resetNewInput()">Professional Experience</v-tab>
                <v-tab value="3" @click="resetNewInput()">Education</v-tab>
                <v-tab value="4" @click="resetNewInput()">Skills</v-tab>
                <v-tab value="5" @click="resetNewInput()">Professional Summary</v-tab>
                </v-tabs>


                <v-tabs-window v-model="tab">

                    <v-tabs-window-item value="1"  style="padding: 50px">
                        <v-row>
                            <v-col>
                                <v-text-field  label="First Name"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field  label="Last Name"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field  label="Job Title"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field  label="Address"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field  label="Phone Number"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field  label="Email Address"></v-text-field>
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
                                <v-text-field  label="Description"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field  label="Link"></v-text-field>
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
                            
                        <v-btn variant="tonal" @click="nextTab()" >
                            Next
                        </v-btn>
                        </div>
                    </v-tabs-window-item>

                    <v-tabs-window-item value="2"  style="padding: 50px">
                        <div align="left">
                            <v-text class="headline mb-2" >Select Job Experiences: </v-text> 
                            
                            <v-container>
                                <v-list lines="two">
                                    <v-list-item
                                    v-for="n in 3"
                                    :key="n"
                                    > 
                                    <v-row>
                                        <v-col cols="2">
                                            <v-checkbox ></v-checkbox>
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
                                <v-text-field  label="Position Title"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field  label="Company Name"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field  label="City"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field  label="State"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field  label="Start Date"></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field  label="End Date"></v-text-field>
                                <v-switch
                                label="Present Job"
                                color="primary"
                                ></v-switch>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-textarea label="Work Summary">
                                <template #append-inner>
                                <v-btn
                                    color="secondary"
                                    rounded="xl"
                                    value="Ai Assist">
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
                            
                            <v-btn variant="tonal" @click="nextTab()" >
                                Next
                            </v-btn>
                            </div>
                    </v-tabs-window-item>






                </v-tabs-window>




                </v-sheet>

        </v-card>
    </v-container>
    
  </template>