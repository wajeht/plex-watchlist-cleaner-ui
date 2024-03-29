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
  <div class="flex flex-col justify-between h-full p-4">

    <div></div>

    <div class="card w-[500px] bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Plex Watchlist Cleaner</h2>

        <div>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Username</span>
            </div>
          </label>
          <input type="text" v-model="states.username" placeholder="johnwack" class="input input-bordered w-full "
            :disabled="states.loading" />
        </div>

        <div>
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">Password</span>
            </div>
          </label>
          <div class="relative">
            <input :type="computedPasswordOrTextType" v-model="states.password" placeholder="••••••••"
              class="input input-bordered w-full " :disabled="states.loading" />
            <button @click="showPassword" v-if="states.showPassword && states.password.length"
              class="absolute h-full right-0 mr-2 p-2">🙈</button>
            <button @click="showPassword" v-if="!states.showPassword && states.password.length"
              class="absolute h-full right-0 mr-2 p-2">👀</button>
          </div>

        </div>

        <button class="btn btn-neutral mt-2" @click="cleanWatchList" :disabled="states.loading">
          <span v-if="states.loading" class="loading loading-spinner"></span>
          <span v-else>Clean</span>
        </button>

        <div v-if="(!states.loading && states.result) || (!states.loading && states.error)"
          class="overflow-scroll text-sm p-4 bg-[#1F1F1F] text-white rounded-md mt-2">
          <pre class="text-wrap" v-if="!states.loading && states.result">{{ states.result }}</pre>
          <pre class="text-wrap" v-if="!states.loading && states.error">{{ states.error }}</pre>
        </div>
      </div>
    </div>

    <p class="text-xs"> Copyright © {{ new Date().getFullYear() }} <a href="https://plex-watchlist-cleaner.jaw.dev/">
        plex-watchlist-cleaner.jaw.dev </a> . All rights reserved. Made with ❤️ by <a
        href="http://github.com/wajeht/plex-watchlist-cleaner-ui" target="_blank"> @wajeht ↗️ </a></p>
  </div>
</template>
