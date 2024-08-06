<script setup>
import { ref, onMounted, watch } from 'vue';
import ExperienceServices from '../services/ExperienceServices';

// Define props
const props = defineProps({
  makeSnackbar: Function,
  editingItem: Object,
  editExperienceDialog: Boolean,
  isRequestingAiAssist: Boolean,
  experienceAIAssist: Function
});

// Define emits
const emit = defineEmits([
  'update:editExperienceDialog',
  'update:editingItem',
  'update:isRequestingAiAssist',
]);

// Local state for editing
const account = ref(null);
const editedItem = ref(props.editingItem);
const localEditExperienceDialog = ref(props.editExperienceDialog);
const localisRequestingAiAssist = ref(props.isRequestingAiAssist);

// Watch for changes in props
watch(() => props.editingItem, (newValue) => {
  editedItem.value = newValue;
});

watch(() => props.editExperienceDialog, (newValue) => {
  localEditEducationDialog.value = newValue;
});

watch(() => props.isRequestingAiAssist, (newValue) => {
  localisRequestingAiAssist.value = newValue;
});

// Emit updates for each local state
watch(editedItem.value, (newValue) => emit('update:editingItem', newValue));
// watch(localisRequestingAiAssist.value, (newValue) => emit('update:isRequestingAiAssist', newValue));

// Fetch account info
onMounted(() => {
  account.value = JSON.parse(localStorage.getItem('account'));
});

// Methods
function closeEditExperienceDialog() {
  emit('update:editExperienceDialog', false);
}

async function saveEditExperience() {
  if (editedItem.value.current == true) {
    editedItem.value.endDate = null;
  }
  await ExperienceServices.updateExperience(editedItem.value.title, editedItem.value.description, editedItem.value.startDate, editedItem.value.endDate,
    editedItem.value.current, editedItem.value.city, editedItem.value.state, editedItem.value.organization, editedItem.value.chatHistory,
    account.value.id, editedItem.value.id
  )
    .then(() => {
      props.makeSnackbar("green", "Experience Updated!");
    })
    .catch((error) => {
      console.log(error);
      props.makeSnackbar("error", props.error.response.data.message);
    });
  closeEditExperienceDialog();
}

</script>

<template>
  <v-container v-if="editedItem !== ''">
    <v-dialog v-model="localEditExperienceDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Item</span>
        </v-card-title>
        <v-card-text>


          <v-container>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.title" label="Position Title"></v-text-field>
              </v-col>
              <v-col v-if="editedItem.experienceTypeId !== 5 && editedItem.experienceTypeId !== 6">
                <v-text-field v-model="editedItem.organization" label="Company Name"></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="editedItem.experienceTypeId !== 5 && editedItem.experienceTypeId !== 6">
              <v-col>
                <v-text-field v-model="editedItem.city" label="City"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="editedItem.state" label="State" hint="Two letters for State"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.startDate" label="Start Date" hint="Ex: Aug 2024"></v-text-field>
              </v-col>
              <v-col v-if="editedItem.experienceTypeId !== 5 && editedItem.experienceTypeId !== 6">
                <v-text-field :disabled="editedItem.current" v-model="editedItem.endDate"
                  label="End Date" hint="Ex: Aug 2024"></v-text-field>
                <v-switch v-model="editedItem.current" label="Present Job" color="primary"></v-switch>
              </v-col>
            </v-row>
            <v-skeleton-loader v-if="localisRequestingAiAssist" type="card"></v-skeleton-loader>
            <v-row>

              <v-textarea v-if="!localisRequestingAiAssist" v-model="editedItem.description" label="Summary/Description">

                <template #append-inner>
                  <div v-if="editedItem.experienceTypeId !== 5 && editedItem.experienceTypeId !== 6">
                    <v-btn color="secondary" rounded="xl" value="Ai Assist" @click="props.experienceAIAssist(true)">
                      AI Assist
                    </v-btn>
                  </div>
                </template>
              </v-textarea>
            </v-row>
            <v-col>
            </v-col>

          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!isRequestingAiAssist" color="blue darken-1" text
            @click="closeEditExperienceDialog">Cancel</v-btn>
          <v-btn v-if="!isRequestingAiAssist" color="blue darken-1" text @click="saveEditExperience">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
