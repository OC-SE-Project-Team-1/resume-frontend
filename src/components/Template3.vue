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
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}
async function getUser() {
  await UserServices.getUser(resumeData.value.userId)
    .then((response) => {
      user.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
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
          position: relative;">

      <div class="resume" >
      <header>
        <h1>{{ user.firstName }} {{ user.lastName }}</h1>
        <p>{{ user.address }} | {{ user.phoneNumber }} | <a>{{ user.email }}</a>
          <a v-if="links.length > 0"> | </a><a v-if="links.length > 0"v-for="link in links">
            {{ link.type }}: {{ link.url }}<a v-if="index !== links.length - 1"> | </a></a></p>
      </header>
  
      <section >
        <p >{{ goal }}</p>
      </section>
  
      <section>
        <h2><strong>EDUCATION</strong></h2>
        <div v-for="item in education">
        <div class="dated-row">
            <div>
            <p><strong>{{ item.organization }}</strong>, {{ item.city }}, {{ item.state }} </p>
          </div>
          <div >
              <p>{{ date.format(item.startDate, 'monthAndYear') }} - <a v-if="item.gradDate !== null">Projected</a> {{ date.format(item.endDate, 'monthAndYear') }}</p>
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
          <div >
            <p>{{ date.format(job.startDate, 'monthAndYear') }} - <a v-if="job.current">Current</a><a v-else>{{ date.format(job.endDate, 'monthAndYear') }}</a></p>
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
            <p>{{ date.format(project.startDate, 'monthAndYear') }} - {{ date.format(project.endDate, 'monthAndYear') }}</p>
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
  
  <script>
  export default {
    data() {
      return {
        name: "Ike T. Eagle",
        location: "Edmond, OK",
        phone: "405.453.3245",
        email: "ike.eagle@eagles.oc.edu",
        linkedin: "Linkedin Url / Website Url (optional)",
        about: "Analytic-focused data professional with 2+ years’ experience developing computational models and executing statistical projects to drive insights. Demonstrated ability to translate complex datasets into actionable information and support overarching research initiatives.",
        schoolEducation: {
          institution: "Oklahoma Christian University",
          location: "Edmond, OK",
          graduation: "May, 20xx",
          degree: "Computer Engineering",
          gpa: "3.xx/4.x"
        },
        allExperience: [
          {
            id: 1,
            company: "Oklahoma Christian University",
            location: "Edmond, OK",
            period: "August, 20xx – Present",
            title: "Job Title",
            tasks: [
              "Collaborated with cross-functional team of computer, electrical, and mechanical engineers to define and prioritize data science projects, driving $1.5M NIST-funded research in multimedia storage systems",
              "Conducted exploratory data analysis (EDA) on large datasets using Python and SQL, identifying key trends and patterns to inform research focused on multimedia bit rate conversion",
              "Conducted statistical analysis of experimental results to evaluate the effectiveness of algorithms and models",
              "Developed software tools and libraries in Python to facilitate data analysis, visualization, and modeling",
              "Presented weekly research updates with Tableau dashboards and made recommendations to primary investigator on study direction"
            ]
          }
        ],
        projects: [
          {
            id: 1,
            institution: "Oklahoma Christian University",
            location: "Edmond, OK",
            period: "June, 20xx – August, 20xx",
            title: "Undergraduate Researcher for the Computer Science Lab",
            tasks: [
              "Used SQL to extract and manipulate data from relational databases for $250K funding",
              "Maintained and updated existing data pipelines and extract, transform, and load ETL workflows to ensure data integrity and reliability",
              "Implemented data cleaning and preprocessing from raw Excel data to transfer into Stata for further analyses"
            ]
          }
        ],
        allSkills: [
          "Simple Linear Regression",
          "Multivariate Linear Regression",
          "Statistical Modeling",
          "Data Integrity",
          "Parametric Tests",
          "Nonparametric Tests",
          "Sampling Methods",
          "Natural Language Processing (NLP)",
          "Tableau",
          "R",
          "VBA",
          "Excel",
          "Python",
          "SQL",
          "Java"
        ]
      };
    }
  };
  </script>
  
  <style scoped>
  .resume {
    font-family: Arial, sans-serif;
    padding-top: 8%;
    padding-left: 10%;
    padding-right: 10%;
    padding-bottom: 8%;
    font-size:x-small;
    margin: 0 auto;
  }
  
  header {
    text-align: center;
    margin-bottom: 13px;
    border-bottom: 1px solid #000;
  }

  
  h1{
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
  