<script lang="ts">
  import { api } from "$lib";

  let health = $state<{ status: string; timestamp: string } | null>(null);
  let loading = $state(true);

  async function checkHealth() {
    loading = true;
    try {
      health = await api.health.get();
    } catch (e) {
      console.error("Health check failed:", e);
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    checkHealth();
  });
</script>

<svelte:head>
  <title>Moon - Home</title>
</svelte:head>

<div class="hero min-h-[60vh]">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Welcome to Moon</h1>
      <p class="py-6">
        A modern web application built with SvelteKit, Tailwind CSS 4, and DaisyUI 5.
      </p>
      <div class="flex flex-col gap-4 items-center">
        <a href="/users" class="btn btn-primary">Manage Users</a>
        <div class="card bg-base-200 shadow-xl w-full mt-4">
          <div class="card-body">
            <h2 class="card-title">API Health</h2>
            {#if loading}
              <span class="loading loading-spinner loading-md"></span>
            {:else if health}
              <div class="badge badge-success gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="w-4 h-4 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {health.status}
              </div>
              <p class="text-sm opacity-70">
                Last checked: {new Date(health.timestamp).toLocaleString()}
              </p>
            {:else}
              <div class="badge badge-error">Unavailable</div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
