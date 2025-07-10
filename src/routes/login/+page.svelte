<script lang="ts">
  import { login } from '$lib/auth';
  import { goto } from '$app/navigation';
  let identifier = '';
  let password = '';
  let error = '';

  async function handleLogin() {
    const result = await login(identifier, password);
    if (result.success) {
      goto('/');
    } else {
      error = result.error;
    }
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-accent-purple/10 to-white dark:from-[#1E2130] dark:to-[#23263a] py-12 px-4">
  <div class="w-full max-w-md rounded-xl bg-white/90 dark:bg-[#23263a] shadow-xl p-8">
    <h1 class="text-3xl font-extrabold text-accent-purple dark:text-white mb-6 text-center">Log In</h1>
    <form on:submit|preventDefault={handleLogin} class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email or Username</label>
        <input type="text" placeholder="Email or Username" bind:value={identifier} required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#23263a] px-4 py-2 text-gray-900 dark:text-white focus:border-accent-purple focus:ring-2 focus:ring-accent-purple outline-none transition" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
        <input type="password" placeholder="Password" bind:value={password} required class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#23263a] px-4 py-2 text-gray-900 dark:text-white focus:border-accent-purple focus:ring-2 focus:ring-accent-purple outline-none transition" />
      </div>
      {#if error}
        <div class="text-red-500 text-sm text-center">{error}</div>
      {/if}
      <button type="submit" class="w-full rounded-lg bg-accent-purple hover:bg-accent-teal transition text-white font-semibold py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2">Log In</button>
    </form>
    <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
      Don't have an account?
      <a href="/signup" class="text-accent-purple hover:underline font-medium">Sign Up</a>
    </div>
  </div>
</div> 