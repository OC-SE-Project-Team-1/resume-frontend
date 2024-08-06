<script>
export default {
  props: {
    show: Boolean,
    color: String,
    message: String,
  },
  computed: {
    show2: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit("update", value);
      },
    },
  },
};
</script>

<template>
    <v-snackbar v-model="show2" rounded="pill" >
            {{ message }}

        <template v-slot:actions>
            <v-btn :color="color" @click="show2=false">Close</v-btn>
        </template>
    </v-snackbar>
</template>

