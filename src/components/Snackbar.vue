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
  console.log(props.show);
}

</script>

<template>
    <v-snackbar v-model="show" rounded="pill" >
            {{ message }}

        <template v-slot:actions>
            <v-btn :color="color" @click="closeSnackbar">Close</v-btn>
        </template>
    </v-snackbar>
</template>

