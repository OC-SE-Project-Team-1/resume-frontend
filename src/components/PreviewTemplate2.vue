<script setup>
import { ref, onMounted } from "vue";
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

const props = defineProps({
  links: Array,
  goal: String,
  education: Array,
  experience: Array,
  skills: Array
});

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
    });
}

</script>

<template>
  <v-container>
    <v-sheet :elevation="4" class="resume"
      style="width: calc(90vh * 8.5 / 11); position:relative; margin:0 auto;  background-color: white;">
      <div>
        <header>
          <h1>{{ user.firstName }} {{ user.lastName }}</h1>
          <p>{{ user.address }} | {{ user.phoneNumber }} | <a>{{ user.email }}</a>
            <a v-if="props.links && props.links.length > 0"> | </a><a v-if="props.links && props.links.length > 0"
              v-for="(link, index) in links">
              {{ link.type }}: {{ link.url }}<a v-if="index !== links.length - 1"> | </a></a>
          </p>
        </header>
        <section v-if="props.goal && goal.length > 0">
          <h2 style="font-family: 'Calibri';">PROFESSIONAL SUMMARY</h2>
          <p>{{ goal }}</p>
        </section>
        <section>
          <h2>EDUCATION</h2>
          <div v-for="(edu, index) in props.education" :key="index" style="padding-bottom: 15px;">
            <p><strong>{{ edu.organization }}</strong> | {{ date.format(edu.startDate, 'monthAndYear') }} - <a
                v-if="edu.gradDate !== null">Projected </a>{{ date.format(edu.endDate, 'monthAndYear') }}</p>
            <p><strong><em>{{ edu.degree }}</em></strong></p>
            <p>{{ edu.gpa }}</p>
            <div v-if="edu.studyAbroad !== null && edu.studyAbroad.title !== null">
              <p><a v-if="edu.studyAbroad.title !== ''">{{ edu.studyAbroad.title }} </a> <a
                  v-if="edu.studyAbroad.organization !== ''"> {{ edu.studyAbroad.term }} </a> <a
                  v-if="edu.studyAbroad.year !== ''"> {{ edu.studyAbroad.year }}</a></p>
              <p><a v-if="edu.studyAbroad.organization !== ''">{{ edu.studyAbroad.organization }}</a><a
                  v-if="edu.studyAbroad.location !== ''"> | {{ edu.studyAbroad.location }}</a></p>
            </div>
          </div>
        </section>
        <section>
          <h2>EXPERIENCE</h2>
          <div v-for="(exp, index) in props.experience" :key="index">
            <p><strong>{{ exp.title }}</strong>, {{ exp.organization }} | {{ date.format(exp.startDate, 'monthAndYear')
              }} - <a v-if="exp.current">Current</a><a v-else>{{ date.format(exp.endDate, 'monthAndYear') }}</a></p>
            <ul>
              <li v-for="achievement in exp.description.split('\n')">{{ achievement }}</li>
            </ul>
          </div>
        </section>
      </div>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.resume {
  padding-top: 5%;
  padding-left: 8%;
  padding-right: 8%;
  padding-bottom: 15%;
  font-family: 'Times New Roman', Times, serif;
  font-size: x-small;
  color: black;
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