<script setup>
import { ref, onMounted, watch } from 'vue';
import EducationServices from '../services/EducationServices';

// Define props
const props = defineProps({
  eduId: Number,
  title: String,
  organization: String,
  city: String,
  state: String,
  gpa: String,
  totalGPA: String,
  description: String,
  startDate: String,
  endDate: String,
  gradDate: String,
  courses: String,
  minor: String,
  awards: String,
  studyAbroadTitle: String,
  studyAbroadOrganization: String,
  studyAbroadLocation: String,
  studyAbroadTime: String,
  studyAbroadYear: String,
  isAttending: Boolean,
  editEducationDialog: Boolean
});

// Define emits
const emit = defineEmits([
  'update:editEducationDialog',
  'update:organization',
  'update:description',
  'update:city',
  'update:state',
  'update:gpa',
  'update:totalGPA',
  'update:startDate',
  'update:endDate',
  'update:gradDate',
  'update:courses',
  'update:minor',
  'update:awards',
  'update:studyAbroadTitle',
  'update:studyAbroadOrganization',
  'update:studyAbroadLocation',
  'update:studyAbroadTime',
  'update:studyAbroadYear',
  'update:isAttending'
]);

// Local state for editing
const account = ref(null);
const localOrganization = ref(props.organization);
const localCity = ref(props.city);
const localState = ref(props.state);
const localGpa = ref(props.gpa);
const localTotalGPA = ref(props.totalGPA);
const localDescription = ref(props.description);
const localStartDate = ref(props.startDate);
const localEndDate = ref(props.endDate);
const localGradDate = ref(props.gradDate);
const localCourses = ref(props.courses);
const localMinor = ref(props.minor);
const localAwards = ref(props.awards);
const localStudyAbroadTitle = ref(props.studyAbroadTitle);
const localStudyAbroadOrganization = ref(props.studyAbroadOrganization);
const localStudyAbroadLocation = ref(props.studyAbroadLocation);
const localStudyAbroadTime = ref(props.studyAbroadTime);
const localStudyAbroadYear = ref(props.studyAbroadYear);
const localIsAttending = ref(props.isAttending);
const localEditEducationDialog = ref(props.editEducationDialog);

// Watch for changes in props
watch(() => props.organization, (newValue) => {
  localOrganization.value = newValue;
});

watch(() => props.city, (newValue) => {
  localCity.value = newValue;
});

watch(() => props.state, (newValue) => {
  localState.value = newValue;
});

watch(() => props.gpa, (newValue) => {
  localGpa.value = newValue;
});

watch(() => props.totalGPA, (newValue) => {
  localTotalGPA.value = newValue;
});

watch(() => props.description, (newValue) => {
  localDescription.value = newValue;
});

watch(() => props.startDate, (newValue) => {
  localStartDate.value = newValue;
});

watch(() => props.endDate, (newValue) => {
  localEndDate.value = newValue;
});

watch(() => props.gradDate, (newValue) => {
  localGradDate.value = newValue;
});

watch(() => props.courses, (newValue) => {
  localCourses.value = newValue;
});

watch(() => props.minor, (newValue) => {
  localMinor.value = newValue;
});

watch(() => props.awards, (newValue) => {
  localAwards.value = newValue;
});

watch(() => props.studyAbroadTitle, (newValue) => {
  localStudyAbroadTitle.value = newValue;
});

watch(() => props.studyAbroadOrganization, (newValue) => {
  localStudyAbroadOrganization.value = newValue;
});

watch(() => props.studyAbroadLocation, (newValue) => {
  localStudyAbroadLocation.value = newValue;
});

watch(() => props.studyAbroadTime, (newValue) => {
  localStudyAbroadTime.value = newValue;
});

watch(() => props.studyAbroadYear, (newValue) => {
  localStudyAbroadYear.value = newValue;
});

watch(() => props.isAttending, (newValue) => {
  localIsAttending.value = newValue;
});

watch(() => props.editEducationDialog, (newValue) => {
  localEditEducationDialog.value = newValue;
});

// Emit updates for each local state
watch(localOrganization, (newValue) => emit('update:organization', newValue));
watch(localCity, (newValue) => emit('update:city', newValue));
watch(localState, (newValue) => emit('update:state', newValue));
watch(localGpa, (newValue) => emit('update:gpa', newValue));
watch(localTotalGPA, (newValue) => emit('update:totalGPA', newValue));
watch(localDescription, (newValue) => emit('update:description', newValue));
watch(localStartDate, (newValue) => emit('update:startDate', newValue));
watch(localEndDate, (newValue) => emit('update:endDate', newValue));
watch(localGradDate, (newValue) => emit('update:gradDate', newValue));
watch(localCourses, (newValue) => emit('update:courses', newValue));
watch(localMinor, (newValue) => emit('update:minor', newValue));
watch(localAwards, (newValue) => emit('update:awards', newValue));
watch(localStudyAbroadTitle, (newValue) => emit('update:studyAbroadTitle', newValue));
watch(localStudyAbroadOrganization, (newValue) => emit('update:studyAbroadOrganization', newValue));
watch(localStudyAbroadLocation, (newValue) => emit('update:studyAbroadLocation', newValue));
watch(localStudyAbroadTime, (newValue) => emit('update:studyAbroadTime', newValue));
watch(localStudyAbroadYear, (newValue) => emit('update:studyAbroadYear', newValue));
watch(localIsAttending, (newValue) => emit('update:isAttending', newValue));

// Fetch account info
onMounted(() => {
  account.value = JSON.parse(localStorage.getItem('account'));
});

// Methods
function toggleIsAttending() {
  localIsAttending.value = !localIsAttending.value;

    if (localIsAttending.value == false) {
      localGradDate.value = null;
    }
}

function closeEditEducationDialog() {
  emit('update:editEducationDialog', false);
}

async function saveEditEducation() {
  var studyAbroad = (localStudyAbroadTitle.value || localStudyAbroadOrganization.value || 
                      localStudyAbroadLocation.value || localStudyAbroadTime.value || 
                      localStudyAbroadYear.value) ? {
                        title: localStudyAbroadTitle.value,
                        organization: localStudyAbroadOrganization.value,
                        location: localStudyAbroadLocation.value,
                        term: localStudyAbroadTime.value,
                        year: localStudyAbroadYear.value
                      } : null;

  var awards = localAwards.value === '' ? null : localAwards.value;
  var minors = localMinor.value === '' ? null : localMinor.value;
  var courses = localCourses.value === '' ? null : localCourses.value;
  if (localGradDate.value !== null) {
        localEndDate.value = localGradDate.value;
    }

  try {
    await EducationServices.updateEducation( props.title,
      localDescription.value, localStartDate.value,
      localEndDate.value, localGradDate.value, localGpa.value, localOrganization.value, localCity.value,
      localState.value, courses, minors, localTotalGPA.value,
      awards, studyAbroad, account.value.id, props.eduId
    );
    // makeSnackbar("green", "Education Updated!");
  } catch (error) {
    console.log(error);
    // makeSnackbar("error", error.response.data.message);
  } finally {
    closeEditEducationDialog();
  }
}

</script>

<template>
  <v-container v-if="localOrganization !== ''">
    <v-dialog v-model="localEditEducationDialog" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Edit Item</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="localOrganization" label="School Name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="localCity" label="City"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="localState" label="State"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="localGpa" label="GPA"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="localTotalGPA" label="Max GPA"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="localDescription" label="Title of Degree"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="localStartDate" label="Start Date" hint="Ex: Aug 2024"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="localEndDate" v-if="!localIsAttending" label="End Date" hint="Ex: Aug 2024"></v-text-field>
              <v-text-field v-model="localGradDate" v-if="localIsAttending" label="Grad Date" hint="Ex: Aug 2024"></v-text-field>
              <v-switch v-model="localIsAttending" label="Still Attending" color="primary" @click="toggleIsAttending()"></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="localCourses" label="Course(s)"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="localMinor" label="Minor(s)"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="localAwards" label="Award(s)"></v-text-field>
            </v-col>
          </v-row>
          <div>
            <v-row>
              <v-text-field v-model="localStudyAbroadTitle" label="Study Abroad Title" hint="Name of Study Abroad Program"></v-text-field>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="localStudyAbroadOrganization" label="Study Abroad Organization" hint="Ex) Capital Normal"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="localStudyAbroadLocation" label="Study Abroad Location" hint="Ex) Beijing, China"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="localStudyAbroadTime" label="Study Abroad Term" hint="Ex) Fall Semester"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="localStudyAbroadYear" label="Study Abroad Year" hint="Ex) 2018"></v-text-field>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeEditEducationDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveEditEducation">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </v-container>
</template>
