<script setup>
import MenuBar from "./components/MenuBar.vue";
</script>

<template>
  <v-app color="background">
    <MenuBar :key="$route.fullPath" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
