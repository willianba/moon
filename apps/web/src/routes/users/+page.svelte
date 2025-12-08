<script lang="ts">
  import { api } from "$lib";

  // JSON serialized user type (dates come as strings over the wire)
  type UserResponse = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

  let users = $state<UserResponse[]>([]);
  let loading = $state(true);
  let newUser = $state({ email: "", name: "" });
  let showModal = $state(false);

  async function fetchUsers() {
    loading = true;
    try {
      const res = await api.api.users.$get();
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          users = data.data;
        }
      }
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      loading = false;
    }
  }

  async function createUser() {
    try {
      const res = await api.api.users.$post({
        json: newUser,
      });
      if (res.ok) {
        newUser = { email: "", name: "" };
        showModal = false;
        await fetchUsers();
      }
    } catch (e) {
      console.error("Failed to create user:", e);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await api.api.users[":id"].$delete({
        param: { id },
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (e) {
      console.error("Failed to delete user:", e);
    }
  }

  $effect(() => {
    fetchUsers();
  });
</script>

<svelte:head>
  <title>Moon - Users</title>
</svelte:head>

<div class="flex justify-between items-center mb-6">
  <h1 class="text-3xl font-bold">Users</h1>
  <button class="btn btn-primary" onclick={() => (showModal = true)}>
    Add User
  </button>
</div>

{#if loading}
  <div class="flex justify-center py-12">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{:else if users.length === 0}
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
        {#each users as user}
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
              <button class="btn btn-error btn-sm" onclick={() => deleteUser(user.id)}>Delete</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<!-- Add User Modal -->
<dialog class="modal" class:modal-open={showModal}>
  <div class="modal-box">
    <h3 class="font-bold text-lg">Add New User</h3>
    <form onsubmit={(e) => { e.preventDefault(); createUser(); }}>
      <div class="form-control w-full mt-4">
        <label class="label" for="name">
          <span class="label-text">Name</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          class="input input-bordered w-full"
          bind:value={newUser.name}
          required
        >
      </div>
      <div class="form-control w-full mt-4">
        <label class="label" for="email">
          <span class="label-text">Email</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          class="input input-bordered w-full"
          bind:value={newUser.email}
          required
        >
      </div>
      <div class="modal-action">
        <button type="button" class="btn" onclick={() => (showModal = false)}>
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">Create</button>
      </div>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button type="button" onclick={() => (showModal = false)}>close</button>
  </form>
</dialog>
