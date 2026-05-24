<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Moon - Home</title>
</svelte:head>

<div class="hero min-h-[60vh]">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">Welcome to Moon</h1>
      <p class="py-6">
        A modern web application built with SvelteKit, Tailwind CSS 4, and
        DaisyUI 5.
      </p>
      <div class="flex flex-col gap-4 items-center">
        <a href="/users" class="btn btn-primary">Manage Users</a>
        <div class="card bg-base-200 shadow-xl w-full mt-4">
          <div class="card-body">
            <h2 class="card-title">API Health</h2>
            <div
              class="badge gap-2 {data.health.status === 'ok'
                ? 'badge-success'
                : 'badge-error'}"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="w-4 h-4 stroke-current"
              >
                {#if data.health.status === "ok"}
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                {:else}
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                {/if}
              </svg>
              {data.health.status}
            </div>
            <p class="text-sm opacity-70">
              Last checked: {new Date(data.health.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
