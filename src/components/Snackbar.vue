<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  show: Boolean,
  color: String,
  message: String,

})

const emit = defineEmits(['update:show']);

const show = ref(props.show);

watch(() => props.show, (newValue) => {
  show.value = newValue;
});

function closeSnackbar() {
  show.value = false;
  emit('update:show', false);
}

</script>
<!-- its not a bug its a feature -->
<template>
    <v-snackbar v-model="show" rounded="pill" timeout=-1>
            {{ message }}

        <template v-slot:actions>
            <v-btn persistence :color="color" @click="closeSnackbar">Close</v-btn>
        </template>
    </v-snackbar>
</template>

