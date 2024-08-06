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
    <v-sheet :elevation="4" style="width: calc(90vh * 8.5 / 11); position:relative; margin: 0 auto;  background-color: white;">
        <div class="resume">
      <header>
        <h1><strong>{{ user.firstName }} {{ user.lastName }}</strong></h1>
        <!-- :href="'mailto:' + user.email" :href="linkedInUrl" -->
        <p>{{ user.address }} | {{ user.phoneNumber }} | <a >{{ user.email }}</a>
          <a v-if="links.length > 0"> | </a><a v-for="(link, index) in links">
            {{ link.type }}: {{ link.url }}<a v-if="index !== links.length - 1"> | </a></a></p>
      </header>
      
      <section>
        <h2>PROFESSIONAL SUMMARY</h2>
        <p>{{ goal }}</p>
      </section>
  
      <section>
        <h2>EDUCATION</h2>
        <div v-for="item in education">
        <div class="dated-row">
            <div class="education-left" >
                <p><strong>{{ item.organization }}</strong>, {{ item.city }}, {{ item.state }}</p>
            </div>
            <div class="education-right" v-if="item.gradDate !== null">
                <p>{{ date.format(item.startDate, 'monthAndYear') }} - Projected {{ date.format(item.gradDate, 'monthAndYear') }}</p>
            </div>
            <div class="education-right" v-if="item.gradDate == null">
                <p>{{ date.format(item.startDate, 'monthAndYear') }} - {{ date.format(item.endDate, 'monthAndYear') }}</p>
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
        <div class="job" v-for="(job, index) in experience" :key="index" >
          <div v-if="job.experienceTypeId < 5 && (job.experienceTypeId !== 3 || skills.length > 0)">
            <div class="dated-row">

                <div class="job-left">
                    <p><strong>{{ job.organization }}</strong>, <em>{{ job.title }}</em>, {{ job.city }}, {{ job.state }}</p>    
                </div>
                <div class="job-right">
                    <p>{{ date.format(job.startDate, 'monthAndYear') }} - <a v-if="job.current">Current</a><a v-else>{{ date.format(job.endDate, 'monthAndYear') }}</a></p>
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
          <!-- <span class="small-text">| LEADERSHIP SKILLS</span> -->
          <h2>SKILLS </h2>
          <ul class="padded-top-list">
            <li v-for="(skill, index) in skills" :key="index"><em>{{ skill.title }}</em>: {{ skill.description }}</li>
            <!-- <li v-for="(languageSkill, index) in languageSkills" :key="index"><em>{{ languageSkill.title }}</em>{{ languageSkill.content }}</li> -->
          </ul>
        </section>
      </div>
      <div v-else>
        <section>
          <!-- <span class="small-text">ACTIVITIES | EXTRACURRICULAR ACTIVITIES</span> -->
          <h2 > ACTIVITIES </h2>
          <ul class="padded-top-list">
            <div v-for="(exp, index) in experience" :key="index">
              <li v-if="exp.experienceTypeId == 3"><em>{{ exp.organization }} {{ exp.title }}</em>: {{ exp.description }}</li>
            </div>
          </ul>
        </section>
      </div>
    </div>
    </v-sheet>
</v-container>
  </template>
  
  <script>
  export default {
    name: 'Resume',
    data() {
      return {
        firstName: 'First Name',
        lastName: 'Last Name',
        city: 'Oklahoma City',
        state: 'Oklahoma',
        phone: '(555) 555-5555',
        email: 'ike.theagle@oc.edu',
        linkedInUrl: 'LinkedIn/Website URL (optional)',
        professionalSummary: 'Bachelor of Arts degree candidate, with a major in Economics, and experience developing and analyzing cost models, providing quality assurance reviews, and creating process solutions to improve financial forecasts for clients. Looking to continue the development of risk management, audit, and compliance skills in a team-centered environment.',
        schoolName: 'Oklahoma Christian University',
        schoolCity: 'Oklahoma City',
        schoolState: 'OK',
        startMonthYear: 'Start Month, Year',
        projectedMonthYear: 'Projected Month, Year',
        degree: 'Bachelor of Arts /Bachelor of Science in XX /B.B.A in XX',
        accounting: '(Accounting add your 150 hours)',
        gpa: '',
        awards: '(optional)',
        coursework: '(optional, only list if specifically requested)',
        professionalExperience: [
          {
            employer: 'Employer',
            title: 'Your Title',
            city: 'City',
            state: 'State',
            startDate: 'Start Month, year',
            endDate: 'End Month, year',
            achievements: [
              'Accomplished {X} as measured by {Y}, by doing {Z}',
              'Action + Project/Problem + Results = Accomplishment',
              'Three bullet points is sufficient for the most relevant position.'
            ]
          },
          {
            employer: 'Employer',
            title: 'Your Title',
            city: 'City',
            state: 'State',
            startDate: 'Start Month, year',
            endDate: 'End Month, year',
            achievements: [
              'Filed papers and organized 100+ employee documents a month to ensure compliance with employment law & successfully passed the annual audit all three years in the role.',
              'Led a 5-person leadership team to increase student participation by 100% from 50 to 100 members by creating a stronger social media presence'
            ]
          },
          {
            employer: 'Employer',
            title: 'Your Title',
            city: 'City',
            state: 'State',
            startDate: 'Start Month, year',
            endDate: 'End Month, year',
            achievements: [
              'Developed concepts and designs for 10 clients, including consumer products, electronics and enterprise technology, utilizing Adobe Photoshop and Illustrator',
              'Collaborated with the IT team to develop an online application submission and tracking system, reducing cost by 10%'
            ]
          },
          {
            employer: 'Various Roles in Industry as Job Title',
            title: '',
            city: '',
            state: '',
            startDate: 'August 2011',
            endDate: 'August 2017',
            achievements: [
              'Action verb job title who managed own business and strived to give the highest quality customer service.'
            ]
          }
        ],
        allSkills: [
            {
                title: 'Hard skills or Computer Skills: ',
                content: '(optional)'
            }
        ],
        languageSkills: [
            {
                title: 'Language Skills: ',
                content: '(optional – include levels of proficiency)'
            }
          
        ]
      };
    }
  };
  </script>
  
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
  