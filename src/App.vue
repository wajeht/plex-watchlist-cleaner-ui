<script setup>
import { reactive, computed } from 'vue';

const states = reactive({
  username: '',
  password: '',
  loading: false,
  showPassword: false,
  result: '',
  error: '',
})

const computedPasswordOrTextType = computed(() => {
  if (states.showPassword) return 'text'
  return 'password';
});

function showPassword() {
  states.showPassword = !states.showPassword
}

async function cleanWatchList() {
  try {
    states.loading = true;

    const res = await fetch('/api/clean', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: states.username,
        password: states.password,
      }),
    });

    const data = await res.json();

    states.result = data;
  } catch (error) {
    states.error = error.message
  } finally {
    states.loading = false;
  }
}

</script>

<template>
  <div>
    <label for="username">username</label>
    <input type="text" name="username" id="username" v-model="states.username">
  </div>

  <div>
    <label for="password">password</label>
    <input :type="computedPasswordOrTextType" name="password" id="password" v-model="states.password">
    <button @click="showPassword"> {{ states.showPassword ? '🫣' : '🙈' }}</button>
  </div>

  <button @click="cleanWatchList">Clean</button>

  <p v-if="states.loading">loading...</p>
  <pre v-if="!states.loading && states.result">{{ states.result }}</pre>
  <pre v-if="!states.loading && states.error">{{ states.error }}</pre>
</template>

<style scoped>
</style>
