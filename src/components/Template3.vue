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
    <v-sheet :elevation="4" style="width: calc(90vh * 8.5 / 11);
          margin: 0 auto; 
          position: relative;  background-color: white;">

      <div class="resume">
        <header>
          <h1>{{ user.firstName }} {{ user.lastName }}</h1>
          <p>{{ user.address }} | {{ user.phoneNumber }} | <a>{{ user.email }}</a>
            <a v-if="links.length > 0"> | </a><a v-if="links.length > 0" v-for="link in links">
              {{ link.type }}: {{ link.url }}<a v-if="index !== links.length - 1"> | </a></a>
          </p>
        </header>

        <section>
          <p>{{ goal }}</p>
        </section>

        <section>
          <h2><strong>EDUCATION</strong></h2>
          <div v-for="item in education">
            <div class="dated-row">
              <div>
                <p><strong>{{ item.organization }}</strong>, {{ item.city }}, {{ item.state }} </p>
              </div>
              <div>
                <p>{{ date.format(item.startDate, 'monthAndYear') }} - <a v-if="item.gradDate !== null">Projected</a> {{
                  date.format(item.endDate, 'monthAndYear') }}</p>
              </div>
            </div>
            <div class="dated-row">
              <div>
                <p>{{ item.degree }}</p>
              </div>
              <div>
                <p> GPA: {{ item.gpa }} </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2><strong>EXPERIENCE</strong></h2>
          <div v-for="job in experience" :key="job.id">
            <div v-if="job.experienceTypeId < 5">
              <div class="dated-row">
                <div>
                  <p><strong>{{ job.organization }}</strong>, {{ job.city }}, {{ job.state }} </p>
                </div>
                <div>
                  <p>{{ date.format(job.startDate, 'monthAndYear') }} - <a v-if="job.current">Current</a><a v-else>{{
                    date.format(job.endDate, 'monthAndYear') }}</a></p>
                </div>
              </div>
              <p>{{ job.title }}</p>
              <ul>
                <li v-for="achievement in job.description.split('\n')">{{ achievement }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2><strong>PROJECTS</strong></h2>
          <div v-for="project in experience" :key="project.id">
            <div v-if="project.experienceTypeId == 7">
              <div class="dated-row">
                <div>
                  <p><strong>{{ project.organization }}</strong>, {{ project.city }}, {{ project.state }} </p>
                </div>
                <div>
                  <p>{{ date.format(project.startDate, 'monthAndYear') }} - <a v-if="project.current">Current</a><a
                      v-else>{{ date.format(project.endDate, 'monthAndYear') }}</a></p>
                </div>
              </div>

              <p>{{ project.title }}</p>
              <ul>
                <li v-for="task in project.description.split('\n')" :key="task">{{ task }}</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2><strong>SKILLS</strong></h2>
          <p><a v-for="(item, index) in skills">{{ item.title }}<a v-if="index !== skills.length - 1"> | </a></a></p>
        </section>
      </div>
    </v-sheet>
  </v-container>

</template>

<style scoped>
.resume {
  font-family: Arial, sans-serif;
  padding-top: 8%;
  padding-left: 10%;
  padding-right: 10%;
  padding-bottom: 8%;
  font-size: x-small;
  margin: 0 auto;
  color: black;
}

header {
  text-align: center;
  margin-bottom: 13px;
  border-bottom: 1px solid #000;
}


h1 {
  color: #333;
  font-size: medium;
}

h2 {
  color: #333;
  font-size: small;
}

section h2 {
  border-bottom: 2px solid #000;
  padding-bottom: 5px;
  padding-top: 10px;
  font-size: 1.2em;
}

ul {
  padding-left: 20px;
  margin-bottom: 10px;
}

a {
  text-decoration: none;
}

.dated-row {
  display: flex;
  justify-content: space-between;
}
</style>