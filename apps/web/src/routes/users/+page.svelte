<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageProps } from "./$types";

  let { data, form }: PageProps = $props();

  let showModal = $state(false);
  let name = $state("");
  let email = $state("");

  function openModal() {
    name = "";
    email = "";
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    name = "";
    email = "";
  }
</script>

<svelte:head>
  <title>Moon - Users</title>
</svelte:head>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-3xl font-bold">Users</h1>
  <button class="btn btn-primary" onclick={openModal}>Add User</button>
</div>

{#if data.users.length === 0}
  <div class="alert alert-info">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-current shrink-0 w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>No users found. Create one to get started!</span>
  </div>
{:else}
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.users as user (user.id)}
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              <form method="POST" action="?/delete" use:enhance>
                <input type="hidden" name="id" value={user.id} />
                <button type="submit" class="btn btn-error btn-sm">
                  Delete
                </button>
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<dialog class="modal" class:modal-open={showModal}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Add New User</h3>

    {#if form?.error}
      <div class="alert alert-error mt-2">
        <span>{form.error}</span>
      </div>
    {/if}

    <form
      method="POST"
      action="?/create"
      use:enhance={() =>
        async ({ result, update }) => {
          if (result.type === "success") {
            closeModal();
          }
          await update({ reset: false });
        }}
    >
      <div class="form-control w-full mt-4">
        <label class="label" for="name">
          <span class="label-text">Name</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          class="input input-bordered w-full"
          bind:value={name}
          required
        />
      </div>
      <div class="form-control w-full mt-4">
        <label class="label" for="email">
          <span class="label-text">Email</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          class="input input-bordered w-full"
          bind:value={email}
          required
        />
      </div>
      <div class="modal-action">
        <button type="button" class="btn" onclick={closeModal}>Cancel</button>
        <button type="submit" class="btn btn-primary">Create</button>
      </div>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button type="button" onclick={closeModal}>close</button>
  </form>
</dialog>
