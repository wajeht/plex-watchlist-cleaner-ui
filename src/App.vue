<script setup>
import { ref } from 'vue';

const count = ref(0);

</script>

<template>

  <h1>{{ count  }}</h1>
  <button @click="count++">✅</button>
  <button @click="count--">❌</button>

</template>

<style scoped>
</style>
