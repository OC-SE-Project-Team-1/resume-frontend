<script setup>
import { ref, onMounted, computed } from "vue";
import { useDate } from 'vuetify';
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

const props = defineProps({links: Array, 
                          goal: String, 
                          education: Array, 
                          experience: Array, 
                          skills: Array});


const isExists = computed(() => {
  var temp = false;
  if (typeof props.experience !== "undefined" && props.experience !== null && props.experience !== []) {
    for (let [key, value] of Object.entries(props.experience.value)) {
      if (value.experienceTypeId == 1) {
        console.log(value.experienceTypeId);
        temp = true;
        break;
      }
    }}

    return (
        temp
    )
})
onMounted(async () => {
  account.value = JSON.parse(localStorage.getItem("account"));
  await getUser();
});

async function getUser() {
  await UserServices.getUser(account.value.id)
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

</script>

<template>
  <v-container>
    <v-sheet :elevation="4" style="width: calc(90vh * 8.5 / 11);
          margin: 0 auto; 
          position: relative;">
      <div class="resume">
        <header>
          <h1>{{ user.firstName }} {{ user.lastName }}</h1>
          <p>{{ user.address }} ♦ {{ user.phoneNumber }} ♦ {{ user.email }}
            <a v-if="props.links && props.links.length > 0"> ♦ </a><a v-if="props.links && props.links.length > 0" v-for="(link, index) in links">
              {{ link.type }}: {{ link.url }}<a v-if="index !== links.length - 1"> ♦ </a></a>
          </p>
        </header>

        <section>
          <h2>OBJECTIVE</h2>
          <p>{{ props.goal }}</p>
        </section>

        <section>
          <h2>EDUCATION</h2>
          <div v-for="edu in props.education">
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
        
        <section v-if="props.experience && experience.some(e => e.experienceTypeId == 2)">
          <h2>LEADERSHIP</h2>
          <div v-for="(exp, index) in props.experience" :key="index">
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

        <section v-if="props.experience && experience.some(e => e.experienceTypeId == 1)">
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

        <section v-if="props.experience && experience.some(e => e.experienceTypeId == 3)">
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

        <section v-if="props.experience  && experience.some(e => e.experienceTypeId == 4)">
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
          <div v-if="props.experience" v-for="(exp, index) in props.experience" :key="index">
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
            <li style="list-style-type: none;" v-if="props.skills" v-for="skill in skills" :key="skill">{{ skill.title }}: {{
              skill.description }}</li>
          </ul>
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
      city: "City",
      state: "State",
      phone: "Phone Number",
      email: "Email Address",
      linkedin: "LinkedIn or Website URL",
      objective: "Recent graduate with a degree in marketing seeking an entry-level position in digital marketing. Experienced in creating social media campaigns and analyzing data to drive engagement and sales.",
      educations: {
        institution: "Oklahoma Christian University",
        location: "Oklahoma City, OK",
        startDate: "Start Month, Year",
        endDate: "Projected Month, Year",
        degree: "Bachelor of Arts /Bachelor of Science in XX /B.B.A in XX",
        minor: "Minor(s) in…. (if applicable)",
        majorGPA: "#.##",
        cumulativeGPA: "#.##",
        coursework: ["Course 1", "Course 2", "Course 3"]
      },
      leadership: {
        title: "LEADERSHIP (or WORK EXPERIENCE, ACTIVITIES, VOLUNTEER WORK)",
        organization: "Organization Name",
        dateRange: "Month Year – Month Year",
        items: [
          {
            dateRange: "Month Year – Month Year",
            positions: [
              {
                title: "Position Title",
                dateRange: "Month Year – Month Year",
                duties: [
                  "Action Verb, followed by description of most relevant or important duties and accomplishments"
                ]
              }
            ]
          },
          {
            dateRange: "Month Year – Month Year",
            positions: [
              {
                title: "Position Title",
                dateRange: "Month Year – Month Year",
                duties: [
                  "Action Verb, followed by description of most relevant or important duties and accomplishments"
                ]
              }
            ]
          }
        ]
      },
      workExperience: {
        title: "WORK EXPERIENCE (or LEADERSHIP, ACTIVITIES, VOLUNTEER WORK)",
        items: [
          {
            company: "Company Name",
            location: "City, State",
            dateRange: "Month Year – Month Year",
            title: "Job Title",
            duties: [
              "Action Verb, followed by description of most relevant or important duties and accomplishments",
              "Action Verb, followed by description of most relevant or important duties and accomplishments"
            ]
          }
        ]
      },
      honors: {
        title: "HONORS (and/or AWARDS)",
        items: [
          {
            name: "Honor/Award/Organization",
            dateRange: "Month Year – Month Year",
            details: [
              "Action Verb, followed by criteria for selection or explanation of involvement"
            ]
          }
        ]
      },
      allSkills: [
        "List language skills and declare fluency (if applicable)",
        "List relevant computer skills"
      ]
    };
  }
};
</script>

<style scoped>
.resume {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0 auto;
  padding-top: 7%;
  padding-left: 12%;
  padding-right: 12%;
  padding-bottom: 5%;
  font-size: x-small;
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