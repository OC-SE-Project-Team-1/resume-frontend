<script setup>
import { ref, onMounted } from "vue";
import { useDate } from 'vuetify';
import ResumeServices from "../services/ResumeServices";
import UserServices from "../services/UserServices";

const date = useDate();
const account = ref(null);
const user = ref({
  id: "",
  userName: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phoneNumber: "",
  address: "",
  darkMode: "",
  roleId: ""
});
const resumeId = ref(null);
const resumeData = ref();

const links = ref([]);
const goal = ref([]);
const education = ref([]);
const experience = ref([]);
const skills = ref([]);

const leadership = ref([]);
const activities = ref([]);
const work = ref([]);
const volunteer = ref([]);


onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  resumeId.value = JSON.parse(localStorage.getItem("resumeId"));
  await getResume();
  await getUser();
  await sortData();
});

async function getResume() {
  await ResumeServices.getResume(resumeId.value)
    .then((response) => {
      resumeData.value = response.data;
      console.log(resumeData);

    })
    .catch((error) => {
      console.log(error);
    });
}
async function getUser() {
  await UserServices.getUser(resumeData.value.userId)
    .then((response) => {
      user.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function sortData() {
  links.value = resumeData.value.Link;
  goal.value = resumeData.value.Goal[0].description;
  education.value = resumeData.value.Education;
  experience.value = resumeData.value.Experience;

  console.log(experience.value);
  for (let [key, value] of Object.entries(experience.value)) {

    if (value.experienceTypeId == 1) {
      work.value.push(value);
    }
    else if (value.experienceTypeId == 2) {
      leadership.value.push(value);
    }
    else if (value.experienceTypeId == 3) {
      activities.value.push(value);
    }
    else if (value.experienceTypeId == 4) {
      volunteer.value.push(value);
    }

  }

  skills.value = resumeData.value.Skill;
}

</script>

<template>
  <v-container>
    <v-sheet :elevation="4" style="width: calc(90vh * 8.5 / 11);
          margin: 0 auto; 
          position: relative;  
          background-color: white;">
      <div class="resume">
        <header>
          <h1>{{ user.firstName }} {{ user.lastName }}</h1>
          <p>{{ user.address }} ♦ {{ user.phoneNumber }} ♦ {{ user.email }}
            <a v-if="links.length > 0"> ♦ </a><a v-if="links.length > 0" v-for="(link, index) in links">
              {{ link.type }}: {{ link.url }}<a v-if="index !== links.length - 1"> ♦ </a></a>
          </p>
        </header>

        <section>
          <h2>OBJECTIVE</h2>
          <p>{{ goal }}</p>
        </section>

        <section>
          <h2>EDUCATION</h2>
          <div v-for="edu in education">
            <div class="dated-row">
              <div>
                <p><strong>{{ edu.organization }}</strong>, {{ edu.city }}, {{ edu.state }}</p>
              </div>
              <div>
                <p>{{ date.format(edu.startDate, 'monthAndYear') }} - <a v-if="edu.gradDate !== null">Projected </a>{{
                  date.format(edu.endDate, 'monthAndYear') }}</p>
              </div>
            </div>

            <p>{{ edu.degree }}</p>
            <p v-if="edu.minor !== 'null'">Minor: {{ edu.minor }}</p>
            <!-- TODO: Cumulative GPA Instead of Total GPA??; Cumulative GPA: {{ edu.cumulativeGPA }} -->
            <p>Major GPA: {{ edu.gpa }}</p>
            <p v-if="edu.courses !== 'null'">Coursework: {{ edu.courses }}</p>
          </div>
        </section>

        <section v-if="leadership.length > 0">
          <h2>LEADERSHIP</h2>
          <div v-for="(exp, index) in experience" :key="index">
            <div v-if="exp.experienceTypeId == 2">
              <div class="dated-row">
                <div>
                  <p><strong>{{ exp.organization }}</strong></p>
                </div>
                <div>
                  <p>{{ date.format(exp.startDate, 'monthAndYear') }} - <a v-if="exp.current">Current</a><a v-else>{{
                    date.format(exp.endDate, 'monthAndYear') }}</a></p>
                </div>
              </div>
              <div>
                <p><em>{{ exp.title }}</em></p>
                <ul>
                  <li v-for="achievement in exp.description.split('\n')">{{ achievement }}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section v-if="work.length > 0">
          <h2>WORK EXPERIENCE</h2>
          <div v-for="(exp, index) in experience" :key="index">
            <div v-if="exp.experienceTypeId == 1">
              <div class="dated-row">
                <div>
                  <p>{{ exp.organization }}, {{ exp.city }}, {{ exp.state }}</p>
                </div>
                <div>
                  <p>{{ date.format(exp.startDate, 'monthAndYear') }} - <a v-if="exp.current">Current</a><a v-else>{{
                    date.format(exp.endDate, 'monthAndYear') }}</a></p>
                </div>
              </div>
              <p><strong><em>{{ exp.title }}</em></strong></p>
              <ul>
                <li v-for="achievement in exp.description.split('\n')">{{ achievement }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section v-if="activities.length > 0">
          <h2>ACTIVITIES</h2>
          <div v-for="(exp, index) in experience" :key="index">
            <div v-if="exp.experienceTypeId == 3">
              <div class="dated-row">
                <div>
                  <p>{{ exp.organization }}, {{ exp.city }}, {{ exp.state }}</p>
                </div>
                <div>
                  <p>{{ date.format(exp.startDate, 'monthAndYear') }} - <a v-if="exp.current">Current</a><a v-else>{{
                    date.format(exp.endDate, 'monthAndYear') }}</a></p>
                </div>
              </div>
              <p><strong><em>{{ exp.title }}</em></strong></p>
              <ul>
                <li v-for="achievement in exp.description.split('\n')">{{ achievement }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section v-if="volunteer.length > 0">
          <h2>VOLUNTEER WORK</h2>
          <div v-for="(exp, index) in experience" :key="index">
            <div v-if="exp.experienceTypeId == 4">
              <div class="dated-row">
                <div>
                  <p>{{ exp.organization }}, {{ exp.city }}, {{ exp.state }}</p>
                </div>
                <div>
                  <p>{{ date.format(exp.startDate, 'monthAndYear') }} - <a v-if="exp.current">Current</a><a v-else>{{
                    date.format(exp.endDate, 'monthAndYear') }}</a></p>
                </div>
              </div>
              <p><strong><em>{{ exp.title }}</em></strong></p>
              <ul>
                <li v-for="achievement in exp.description.split('\n')">{{ achievement }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2> HONORS AND AWARDS</h2>
          <div v-for="(exp, index) in experience" :key="index">
            <div v-if="exp.experienceTypeId == 5 || exp.experienceTypeId == 6">
              <div class="dated-row">
                <div>
                  <p><strong>{{ exp.title }} </strong></p>
                </div>
                <div>
                  <p>{{ date.format(exp.startDate, 'monthAndYear') }}</p>
                </div>
              </div>
              <ul>
                <li v-for="achievement in exp.description.split('\n')">{{ achievement }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2>SKILLS</h2>
          <ul style="padding-left: 0%;">
            <li style="list-style-type: none;" v-for="skill in skills" :key="skill">{{ skill.title }}: {{
              skill.description }}</li>
          </ul>
        </section>
      </div>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.resume {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0 auto;
  padding-top: 7%;
  padding-left: 12%;
  padding-right: 12%;
  padding-bottom: 5%;
  font-size: x-small;
  color: black;
}

header {
  text-align: center;
}

header h1 {
  margin: 0;
  font-size: medium;
}

header p {
  margin: 0px 0;
}

h1 {
  color: #2c3e50;
}

h2 {
  color: #2c3e50;
  font-size: 1.1em;

  padding-top: 10px;
}

ul {
  list-style-type: disc;
  padding-left: 30px;
}

.dated-row {
  display: flex;
  justify-content: space-between;
}
</style>