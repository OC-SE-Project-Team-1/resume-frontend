<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router"

const router = useRouter();
const account = ref(null);

onMounted(() => {
  account.value = JSON.parse(localStorage.getItem("account"));
});

function navigateToCreateResume() {
  router.push({ name: "createResume" });
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10">
          <v-card-title class="pl-0 text-h4 font-weight-bold">Welcome to The R.A.I.N.!
          </v-card-title>
          <v-card-title class="pl-0 text-h6 font-weight-bold">Here to help you easily create resume with a little help from AI.
          </v-card-title>
        </v-col>
      </v-row>
    </div>

    <div>
      <v-row align="center">
        <v-col align="center">
          <v-btn  v-if="account !== null" variant="flat" color="secondary" @click="navigateToCreateResume()">Create a Resume</v-btn>
          <div class="mb-10">
            <v-spacer></v-spacer>
          </div>
          <v-btn v-if="account === null" class="mx-2" :to="{ name: 'login' }" variant="flat" color="secondary">
            Sign In
          </v-btn>
        </v-col>
      </v-row>
    </div>

  </v-container>
</template>
