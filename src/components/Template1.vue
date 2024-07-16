<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import { useTheme } from 'vuetify'

const router = useRouter();
const account = ref(null);


onMounted(async () => {
  // account.value = JSON.parse(localStorage.getItem("account"));
});


</script>

<template>
  <div>
    <v-sheet class="mx-auto my-auto" >
      <v-table class="mx-2 my-2">
      <v-row class="my-2">
        <v-col>
        <h1 align="center" style="font-weight: bold">First Name Last Name</h1>
        <p align="center">Oklahoma City, Oklahoma | (555) 555-5555 | email@email.com | LinkedIn URL</p>
      </v-col>
      </v-row>

      <v-row class="my-8">
        <v-col>
        <h3 align="left" style="font-weight: bold">PROFESSIONAL SUMMARY</h3>
        <v-divider :thickness="3" class="border-opacity-100"></v-divider>
        <p>Professional Summary</p>
      </v-col>
      </v-row>

      <v-row class="my-8">
        <v-col>
        <h3 align="left" style="font-weight: bold">EDUCATION</h3>
        <v-divider :thickness="3" class="border-opacity-100"></v-divider>
      </v-col>
      </v-row>
      <v-row class="my-1">
        <v-col>
        <p><div style="font-weight: bold">Oklahoma Christian University</div>, 
          Oklahoma City, OK</p>
      </v-col>
      <v-col>
          <p align="right">August 2024 - August 2024</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
        <p>Bachelor of Science in Computer Science</p>
      </v-col>
      </v-row>
      <v-row>
        <v-col>
        <p>GPA: 4.00</p>
      </v-col>
      </v-row>
      <v-row>
        <v-col>
        <p>Awards: (Optional)</p>
      </v-col>
      </v-row>
      <v-row>
        <v-col>
        <p>Coursework: (Optional)</p>
      </v-col>
      </v-row>

      <v-row class="my-8">
        <v-col>
        <h3 align="left" style="font-weight: bold">PROFESSIONAL EXPERIENCE</h3>
        <v-divider :thickness="3" class="border-opacity-100"></v-divider>
      </v-col>
      </v-row>
      <v-row>
        <v-col>
        <p>Employer, Your Title, City, State</p>
      </v-col>
        <v-col align="right">
        <p>Date</p>
      </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ul>
          <li>Accomplished something</li>
          <li>Programmed cool things</li>
          <li>Existed to get paycheck</li>
        </ul> 
      </v-col>
      </v-row>

      <v-row class="my-8">
        <v-col>
        <h3 align="left" style="font-weight: bold">SKILLS</h3>
        <v-divider :thickness="3" class="border-opacity-100"></v-divider>
      </v-col>
      </v-row>
      <v-row>
        <v-col>
          <ul>
          <li>Hard Skills: OOP, Agile</li>
          <li>Language Skills: Python, Java</li>
        </ul> 
      </v-col>
      </v-row>


    </v-table>
  </v-sheet>
  </div>
</template>
