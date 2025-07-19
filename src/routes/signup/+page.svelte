<script lang="ts">
	import { register } from '$lib/auth';
	import { goto } from '$app/navigation';
	let username = '';
	let email = '';
	let password = '';
	let error = '';

	async function handleSignup() {
		const result = await register(username, email, password);
		if (result.success) {
			goto('/');
		} else {
			error = result.error;
		}
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-accent-purple/10 to-white px-4 py-12 dark:from-[#1E2130] dark:to-[#23263a]"
>
	<div class="w-full max-w-md rounded-xl bg-white/90 p-8 shadow-xl dark:bg-[#23263a]">
		<h1 class="mb-6 text-center text-3xl font-extrabold text-accent-purple dark:text-white">
			Sign Up
		</h1>
		<form on:submit|preventDefault={handleSignup} class="space-y-6">
			<div>
				<label for="username" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
					>Username</label
				>
				<input
					id="username"
					type="text"
					placeholder="Username"
					bind:value={username}
					required
					class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition focus:border-accent-purple focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#23263a] dark:text-white"
				/>
			</div>
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
				<input
					id="email"
					type="email"
					placeholder="Email"
					bind:value={email}
					required
					class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition focus:border-accent-purple focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#23263a] dark:text-white"
				/>
			</div>
			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200"
					>Password</label
				>
				<input
					id="password"
					type="password"
					placeholder="Password"
					bind:value={password}
					required
					class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 outline-none transition focus:border-accent-purple focus:ring-2 focus:ring-accent-purple dark:border-gray-600 dark:bg-[#23263a] dark:text-white"
				/>
			</div>
			{#if error}
				<div class="text-center text-sm text-red-500">{error}</div>
			{/if}
			<button
				type="submit"
				class="w-full rounded-lg bg-accent-purple py-2 font-semibold text-white shadow-md transition hover:bg-accent-teal focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2"
				>Sign Up</button
			>
		</form>
		<div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
			Already have an account?
			<a href="/login" class="font-medium text-accent-purple hover:underline">Log In</a>
		</div>
	</div>
</div>
