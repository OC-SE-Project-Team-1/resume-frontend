<script setup>
import MenuBar from "./components/MenuBar.vue";
</script>

<template>
 <!-- <v-app :style="{ background: '#F2F5F8' }"> -->
  <v-app color="background">
    <MenuBar :key="$route.fullPath" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
