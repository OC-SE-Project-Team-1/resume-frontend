<script setup>
import { ref, onMounted, watch, defineEmits } from 'vue';
import LinkServices from '../services/LinkServices';

// Define props
const props = defineProps({
  url: String,
  description: String,
  linkId: Number,
  editLinksDialog: Boolean
});

// Define emits
const emit = defineEmits(['update:editLinksDialog']);

// Local state for editing
const account = ref(null);
const localDescription = ref(props.description);
const localUrl = ref(props.url);
const localEditLinksDialog = ref(props.editLinksDialog);

// Watch for changes in props
watch(() => props.description, (newValue) => {
  localDescription.value = newValue;
});

watch(() => props.url, (newValue) => {
  localUrl.value = newValue;
});

watch(() => props.editLinksDialog, (newValue) => {
  localEditLinksDialog.value = newValue;
});

// Fetch account info
onMounted(() => {
  account.value = JSON.parse(localStorage.getItem('account'));
});

// Methods
function closeEditLinksDialog() {
  emit('update:editLinksDialog', false);
}

async function saveEditLinks() {
  try {
    await LinkServices.updateLink(props.linkId, localDescription.value, localUrl.value, account.value.id);
    // makeSnackbar("green", "Link Updated!");
  } catch (error) {
    console.log(error);
    // makeSnackbar("error", error.response.data.message);
  } finally {
    closeEditLinksDialog();
  }
}
</script>

<template>
  <v-container v-if="localUrl !== ''">
    <v-card>
      <v-card-title>
        <span class="headline">Edit Item</span>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="localDescription" label="Description"></v-text-field>
        <v-text-field v-model="localUrl" label="URL"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeEditLinksDialog">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveEditLinks">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
