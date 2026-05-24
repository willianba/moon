<script lang="ts">
  import { page } from "$app/state";
</script>

<svelte:head>
  <title>{page.status} - Moon</title>
</svelte:head>

<div class="hero min-h-[60vh]">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">{page.status}</h1>
      <p class="py-6">{page.error?.message ?? "An unexpected error occurred."}</p>
      <a href="/" class="btn btn-primary">Go Home</a>
    </div>
  </div>
</div>
