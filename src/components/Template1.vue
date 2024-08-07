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
  skills.value = resumeData.value.Skill;
}

</script>

<template>
  <v-container>
    <v-sheet :elevation="4"
      style="width: calc(90vh * 8.5 / 11); position:relative; margin: 0 auto;  background-color: white;">
      <div class="resume">
        <header>
          <h1><strong>{{ user.firstName }} {{ user.lastName }}</strong></h1>
          <!-- :href="'mailto:' + user.email" :href="linkedInUrl" -->
          <p>{{ user.address }} | {{ user.phoneNumber }} | <a>{{ user.email }}</a>
            <a v-if="links.length > 0"> | </a><a v-for="(link, index) in links">
              {{ link.type }}: {{ link.url }}<a v-if="index !== links.length - 1"> | </a></a>
          </p>
        </header>

        <section>
          <h2>PROFESSIONAL SUMMARY</h2>
          <p>{{ goal }}</p>
        </section>

        <section>
          <h2>EDUCATION</h2>
          <div v-for="item in education">
            <div class="dated-row">
              <div class="education-left">
                <p><strong>{{ item.organization }}</strong>, {{ item.city }}, {{ item.state }}</p>
              </div>
              <div class="education-right" v-if="item.gradDate !== null">
                <p>{{ date.format(item.startDate, 'monthAndYear') }} - Projected {{ date.format(item.gradDate,
                  'monthAndYear') }}</p>
              </div>
              <div class="education-right" v-if="item.gradDate == null">
                <p>{{ date.format(item.startDate, 'monthAndYear') }} - {{ date.format(item.endDate, 'monthAndYear') }}
                </p>
              </div>
            </div>
            <div class="dated-row">
              <div class="degree-left">
                <p><i>{{ item.description }}</i></p>
              </div>
              <div class="accounting-right" v-if="item.accounting && education[item].accounting">
                <p style="font-weight: 800;"><strong>{{ item.accounting }}</strong></p>
              </div>
            </div>
            <p><i>GPA: {{ item.gpa }}</i></p>
            <p v-if="item.awards !== 'null'"><i>Awards: {{ item.awards }}</i></p>
            <p v-if="item.courses !== 'null'"><i>Coursework: {{ item.courses }}</i></p>
          </div>
        </section>

        <section>
          <h2>PROFESSIONAL EXPERIENCE</h2>
          <div class="job" v-for="(job, index) in experience" :key="index">
            <div v-if="job.experienceTypeId < 5 && (job.experienceTypeId !== 3 || skills.length > 0)">
              <div class="dated-row">

                <div class="job-left">
                  <p><strong>{{ job.organization }}</strong>, <em>{{ job.title }}</em>, {{ job.city }}, {{ job.state }}
                  </p>
                </div>
                <div class="job-right">
                  <p>{{ date.format(job.startDate, 'monthAndYear') }} - <a v-if="job.current">Current</a><a v-else>{{
                    date.format(job.endDate, 'monthAndYear') }}</a></p>
                </div>
              </div>
              <ul>
                <li v-for="achievement in job.description.split('\n')">{{ achievement }}</li>
              </ul>
            </div>
          </div>
        </section>

        <div v-if="skills.length > 0">
          <section>
            <h2>SKILLS</h2>
            <ul class="padded-top-list">
              <li v-for="(skill, index) in skills" :key="index"><em>{{ skill.title }}</em>: {{ skill.description }}</li>
            </ul>
          </section>
        </div>
        <div v-else>
          <section>
            <h2>ACTIVITIES</h2>
            <ul class="padded-top-list">
              <div v-for="(exp, index) in experience" :key="index">
                <li v-if="exp.experienceTypeId == 3"><em>{{ exp.organization }} {{ exp.title }}</em>: {{ exp.description
                  }}</li>
              </div>
            </ul>
          </section>
        </div>
      </div>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.resume {
  font-family: 'Times New Roman', Times, serif;
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
}

header p {
  margin: 0px 0;
}

section {

  margin: 10px 0;
}

section h2 {
  border-bottom: 2px solid #000;
  padding-bottom: 5px;
  font-size: 1.2em;
}

.dated-row {
  display: flex;
  justify-content: space-between;
}

.job {
  margin-bottom: px;
}

.job p {
  margin: 5px 0;
}

ul {
  margin: 0;
  padding-left: 30px;
}

ul li {
  margin: 0px 0;
}

.padded-top-list {
  padding-top: 20px;
}

.small-text {
  font-size: 0.7em;
}
</style>