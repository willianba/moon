<script lang="ts">
  import "../app.css";
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<div class="min-h-screen bg-base-100">
  <nav class="navbar bg-base-200 shadow-lg">
    <div class="flex-1">
      <a href="/" class="btn btn-ghost text-xl">Moon</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/users">Users</a>
        </li>
      </ul>
    </div>
  </nav>
  <main class="container mx-auto p-4">{@render children()}</main>
</div>
