<script setup>
import { ref, onMounted, watch } from 'vue';
import GoalServices from '../services/GoalServices';

// Define props
const props = defineProps({
  makeSnackbar: Function,
  editingItem: Object,
  editProfSumDialog: Boolean,
});

// Define emits
const emit = defineEmits([
  'update:editProfSumDialog',
  'update:editingItem'
]);

// Local state for editing
const account = ref(null);
const editedItem = ref(props.editingItem);
const localEditProfSumDialog = ref(props.editProfSumDialog);

// Watch for changes in props
watch(() => props.editingItem, (newValue) => {
  editedItem.value = newValue;
});

watch(() => props.editProfSumDialog, (newValue) => {
  localEditProfSumDialog.value = newValue;
});

// Emit updates for each local state
watch(editedItem.value, (newValue) => emit('update:editingItem', newValue));

// Fetch account info
onMounted(() => {
  account.value = JSON.parse(localStorage.getItem('account'));
});

// Methods
function closeEditProfSumDialog() {
  emit('update:editProfSumDialog', false);
}

async function saveEditProfSum() {
  await GoalServices.updateGoal(editedItem.value.id, editedItem.value.title, editedItem.value.description, account.value.id)
    .then(() => {
      props.makeSnackbar("green", "Professional Summary Updated!");
    })
    .catch((error) => {
      console.log(error);
      props.makeSnackbar("error", props.error.response.data.message);
    });
    closeEditProfSumDialog();
}

</script>

<template>
  <v-container v-if="editedItem !== ''">
    <v-dialog v-model="localEditProfSumDialog" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">Edit Item</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
          <v-textarea v-model="editedItem.description" label="Description"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditProfSumDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="saveEditProfSum">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
