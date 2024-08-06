<script setup>
import { ref, onMounted, watch } from 'vue';
import EducationServices from '../services/EducationServices';

// Define props
const props = defineProps({
  makeSnackbar: Function,
  editingItem: Object,
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
  'update:editingItem',
  'update:studyAbroadTitle',
  'update:studyAbroadOrganization',
  'update:studyAbroadLocation',
  'update:studyAbroadTime',
  'update:studyAbroadYear',
  'update:isAttending'
]);

// Local state for editing
const account = ref(null);
const editedItem = ref(props.editingItem);
const localStudyAbroadTitle = ref(props.studyAbroadTitle);
const localStudyAbroadOrganization = ref(props.studyAbroadOrganization);
const localStudyAbroadLocation = ref(props.studyAbroadLocation);
const localStudyAbroadTime = ref(props.studyAbroadTime);
const localStudyAbroadYear = ref(props.studyAbroadYear);
const localIsAttending = ref(props.isAttending);
const localEditEducationDialog = ref(props.editEducationDialog);

// Watch for changes in props
watch(() => props.editingItem, (newValue) => {
  editedItem.value = newValue;
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
watch(editedItem.value, (newValue) => emit('update:editingItem', newValue));
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
    editedItem.value.gradDate = null;
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

  var awards = editedItem.value.awards === '' ? null : editedItem.value.awards;
  var minors = editedItem.value.minor === '' ? null : editedItem.value.minor;
  var courses = editedItem.value.courses === '' ? null : editedItem.value.courses;
  if (editedItem.value.gradDate !== null) {
    editedItem.value.endDate = editedItem.value.gradDate;
  }

  await EducationServices.updateEducation(editedItem.value.title,
    editedItem.value.description, editedItem.value.startDate,
    editedItem.value.endDate, editedItem.value.gradDate, editedItem.value.gpa, editedItem.value.organization, editedItem.value.city,
    editedItem.value.state, courses, minors, editedItem.value.totalGPA,
    awards, studyAbroad, account.value.id, props.editingItem.id
  )
    .then(() => {
      props.makeSnackbar("green", "Education Updated!");
    })
    .catch((error) => {
      console.log(error);
      props.makeSnackbar("error", props.error.response.data.message);
    });
  closeEditEducationDialog();

}

</script>

<template>
  <v-container v-if="editedItem !== ''">
    <v-dialog v-model="localEditEducationDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Item</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.organization" label="School Name"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.city" label="City"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.state" label="State"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.gpa" label="GPA"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.totalGPA" label="Max GPA"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.description" label="Title of Degree"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.startDate" label="Start Date" hint="Ex: Aug 2024"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.endDate" v-if="!localIsAttending" label="End Date"
                  hint="Ex: Aug 2024"></v-text-field>
                <v-text-field v-model="editedItem.gradDate" v-if="localIsAttending" label="Grad Date"
                  hint="Ex: Aug 2024"></v-text-field>
                <v-switch v-model="localIsAttending" label="Still Attending" color="primary"
                  @click="toggleIsAttending()"></v-switch>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.courses" label="Course(s)"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.minor" label="Minor(s)"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.awards" label="Award(s)"></v-text-field>
              </v-col>
            </v-row>
            <div>
              <v-row>
                <v-text-field v-model="localStudyAbroadTitle" label="Study Abroad Title"
                  hint="Name of Study Abroad Program"></v-text-field>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="localStudyAbroadOrganization" label="Study Abroad Organization"
                    hint="Ex) Capital Normal"></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field v-model="localStudyAbroadLocation" label="Study Abroad Location"
                    hint="Ex) Beijing, China"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="localStudyAbroadTime" label="Study Abroad Term"
                    hint="Ex) Fall Semester"></v-text-field>
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
