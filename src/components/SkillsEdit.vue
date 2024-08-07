<script setup>
import { ref, onMounted, watch } from 'vue';
import SkillServices from '../services/SkillServices';

// Define props
const props = defineProps({
  makeSnackbar: Function,
  editingItem: Object,
  editSkillsDialog: Boolean,
  isRequestingAiAssist: Boolean,
  skillAiAssist: Function
});

// Define emits
const emit = defineEmits([
  'update:editSkillsDialog',
  'update:editingItem',
  'update:isRequestingAiAssist',
]);

// Local state for editing
const account = ref(null);
const editedItem = ref(props.editingItem);
const localEditSkillsDialog = ref(props.editSkillsDialog);
const localisRequestingAiAssist = ref(props.isRequestingAiAssist);

// Watch for changes in props
watch(() => props.editingItem, (newValue) => {
  editedItem.value = newValue;
});

watch(() => props.editSkillsDialog, (newValue) => {
  localEditSkillsDialog.value = newValue;
});

watch(() => props.isRequestingAiAssist, (newValue) => {
  localisRequestingAiAssist.value = newValue;
});

// Emit updates for each local state
watch(editedItem.value, (newValue) => emit('update:editingItem', newValue));

// Fetch account info
onMounted(() => {
  account.value = JSON.parse(localStorage.getItem('account'));
});

// Methods
function closeEditSkillsDialog() {
  emit('update:editSkillsDialog', false);
}

async function saveEditSkills() {
  await SkillServices.updateSkill(editedItem.value.id, editedItem.value.title, editedItem.value.description, editedItem.value.chatHistory, account.value.id)
    .then(() => {
      props.makeSnackbar("green", "Skill Updated!");
    })
    .catch((error) => {
      console.log(error);
      props.makeSnackbar("error", props.error.response.data.message);
    });
  closeEditSkillsDialog();
}

</script>

<template>
  <v-container v-if="editedItem !== ''">
    <v-dialog v-model="localEditSkillsDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Item</span>
        </v-card-title>
        <v-card-text>

          <v-container>
            <v-row>
              <v-col>
                <v-text-field v-model="editedItem.title" label="Skill"></v-text-field>
              </v-col>
            </v-row>
            <v-skeleton-loader v-if="isRequestingAiAssist" type="card"></v-skeleton-loader>
            <v-row>
              <v-col>
                <v-textarea v-if="!isRequestingAiAssist" v-model="editedItem.description"
                  label="Brief Description/Proficientcy Level, click AI assist button along with your input to help create a better description">
                  <template #append-inner>
                    <v-btn color="secondary" rounded="xl" value="Ai Assist" @click="props.skillAiAssist(true)">
                      AI Assist
                    </v-btn>
                  </template>
                </v-textarea>
              </v-col>
            </v-row>
          </v-container>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!isRequestingAiAssist" color="accent" text @click="closeEditSkillsDialog">Cancel</v-btn>
          <v-btn v-if="!isRequestingAiAssist" color="accent" text @click="saveEditSkills">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
