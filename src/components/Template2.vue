<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDate } from 'vuetify';
import ResumeServices from "../services/ResumeServices";
import UserServices from "../services/UserServices";

const router = useRouter();
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
const award = ref([]);
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
  var temp1 = [];
  links.value = resumeData.value.Link;
  goal.value = resumeData.value.Goal[0].description;
  education.value = resumeData.value.Education;
  experience.value = resumeData.value.Experience;
  for (let [key, value] of Object.entries(experience.value)) {
    if (value.experienceTypeId == 6) {
      temp1.push(value.title);
    }
  }
  award.value = temp1;
  skills.value = resumeData.value.Skill;
}

</script>

<template>
<v-container>
    <v-sheet class="resume" style="width: calc(90vh * 8.5 / 11); position:relative; margin:0 auto;">
        <div>
            <header>
                <h1>{{ user.firstName }} {{ user.lastName }}</h1>
                <p>{{ user.address }} | {{ user.phoneNumber }} | <a>{{ user.email }}</a><a v-if="links.length > 0"> | </a><a v-if="links.length > 0" v-for="(link, index) in links">{{ link.type }}: {{ link.url }}<a v-if="index !== links.length - 1"> | </a></a></p>
            </header>
            <section v-if="goal !== []">
                <h2 style="font-family: 'Calibri';">PROFESSIONAL SUMMARY</h2>
                <p>{{ goal }}</p>
            </section>
            <section >
                <h2>EDUCATION</h2>
                <div v-for="(edu, index) in education" :key="index" style="padding-bottom: 15px;">
                <p><strong>{{ edu.organization }}</strong> | {{ date.format(edu.startDate, 'monthAndYear') }} - <a v-if="edu.gradDate !== null">Projected </a>{{ date.format(edu.endDate, 'monthAndYear') }}</p>
                <p><strong><em>{{ edu.degree }}</em></strong></p>
                <p>{{ edu.gpa }}</p>
                <!-- TODO: FIgure out what to do for study abroad -->
                <p>{{ edu.abroad }}</p>
                <ul>
                    <li v-for="(program, index) in edu.studyAbroadPrograms" :key="index">{{ program }}</li>
                </ul>
                </div>
            </section>
            <section>
                <h2>EXPERIENCE</h2>
                <div v-for="(exp, index) in experience" :key="index">
                <p><strong>{{ exp.title }}</strong>, {{ exp.organization }} | {{ date.format(exp.startDate, 'monthAndYear') }} - <a v-if="exp.current">Current</a><a v-else>{{ date.format(exp.endDate, 'monthAndYear') }}</a></p>
                <ul>
                    <li v-for="achievement in exp.description.split('\n')">{{ achievement }}</li>
                </ul>
                </div>
            </section>
        </div>
    </v-sheet>
</v-container>

    
  </template>
  
  <script>
  export default {
    data() {
      return {
        firstName: "First Name",
        lastName: "Last Name",
        location: "Edmond, OK",
        phone: "405.444.4444",
        email: "ike.eagle@eagles.oc.edu",
        linkedinUrl: "Linkedin Url / Website Url (optional)",
        professionalSummary: "Tells the reader the purpose of your resume in 3 (2-4 is okay) sentences • Should identify the kind of work you want to perform • If seeking an internship or co-op, include the time period when you are available to start. Example: Seeking a summer 2020 internship in Marketing or Public Relations.",
        educations: [
          {
            institution: "University of Oklahoma",
            startDate: "August 2023",
            endDate: "Projected May 2026",
            degree: "Master of XX",
            gpa: "GPA 4.0",
            studyAbroadPrograms: []
          },
          {
            institution: "Oklahoma Christian University",
            startDate: "August 2021",
            endDate: "Projected May 2025",
            degree: "Bachelor of Science Interdisciplinary Studies",
            gpa: "GPA (only list if above 3.0, or what is appropriate for your major)",
            abroad: 'Study Abroad Program Fall Semester 2008', 
            studyAbroadPrograms: [
              "Capital Normal | Beijing, China",
              "Ibaraki Christian | Ibaraki, Japan",
              "Macquarie University | Sydney, Australia"
            ]
          }
        ],
        experiences: [
          {
            jobRole: "Job Role",
            companyName: "Name of Company",
            startDate: "08/2022",
            endDate: "Present",
            bulletPoints: [
              "Accomplished {X} as measured by {Y}, by doing {Z}",
              "Action + Project/Problem = Results",
              "Three bullet points is sufficient for the most relevant position."
            ]
          },
          {
            jobRole: "Job Role",
            companyName: "Name of Company",
            startDate: "05/2022",
            endDate: "08/2022",
            bulletPoints: [
              "Developed concepts and designs for 10 clients, including consumer products, electronics and enterprise technology, utilizing Adobe Photoshop and Illustrator"
            ]
          },
          {
            jobRole: "Job Role",
            companyName: "Name of Company",
            startDate: "08/2018",
            endDate: "05/2022",
            bulletPoints: [
              "Developed concepts and designs for 10 clients wanting to bring more awareness to their company. Designs included consumer products, electronics and enterprise technology which boosted new customer engagement for all 10 clients."
            ]
          },
          {
            jobRole: "Job Role",
            companyName: "Name of Company",
            startDate: "01/2017",
            endDate: "08/2018",
            bulletPoints: [
              "Filed papers and organized 100+ employee documents a month to ensure compliance with employment law & successfully passed the annual audit all three years in the role."
            ]
          }
        ]
      };
    }
  };
  </script>
  
  <style scoped>

.resume {
    padding-top: 5%;
    padding-left: 8%;
    padding-right: 8%;
    padding-bottom: 15%;
    font-family: 'Times New Roman', Times, serif;
    font-size: x-small;
}

  header {
    text-align: left;
    font-family: 'Calibri';
  }
  h2 {
    margin-top: 20px;
    font-size: small;
    font-weight: bolder;
  }

  ul {
    padding-left: 50px;
  }
  </style>
  