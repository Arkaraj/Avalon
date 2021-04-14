<script lang="ts">
  import { onMount } from "svelte";
  import type { Task, User } from "../types";

  export let room: {
    _id: string;
    name: string;
    code: string;
    description: string;
  };

  export let accessToken: string;

  let tasks: Array<Task> = [];
  let Admins: Array<User> = [];
  let error: Boolean = false;
  let msg: string = "";
  onMount(async () => {
    const response = await fetch(
      `https://avalon7.herokuapp.com/task/${room._id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (data.msgError) {
      error = true;
      msg = data.msg;
      return;
    } else {
      const { roomTasks, admin } = data;

      tasks = roomTasks;
      Admins = admin;
    }
  });

  const taskCompleted = async (taskId: string) => {
    const response = await fetch(
      `https://avalon7.herokuapp.com/task/${taskId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (data.msgError) {
      error = true;
      msg = data.msg;
      return;
    } else {
      // updated the task
    }
  };
</script>

<div class="header">
  <p class="bold">{room.name}</p>
  <p class="code">Member</p>
</div>

<div>
  <p class="bold">Description:</p>
  <p>{room.description}</p>
  {#each Admins as admin (admin._id)}
    <div class="adminName">
      <p class="bold">{admin.name}</p>
      <span style="margin-left: 0.3rem" class="code">Admin</span>
    </div>
  {/each}
</div>

<h2 class="bold">Your Tasks:</h2>

{#if !error}
  {#if tasks.length == 0}
    <p>You have no Tasks</p>
  {:else}
    <!-- <pre>{JSON.stringify(tasks,null,2)}</pre> -->

    {#each tasks as task (task._id)}
      <div class="cards">
        <li class:strikeout={task.completed}>
          <input
            type="checkbox"
            checked={task.completed}
            on:click={async () => {
              task.completed = !task.completed;
              await taskCompleted(task._id);
            }}
          />
          {task.text}
        </li>
      </div>
    {/each}
  {/if}
{:else}
  <p>{msg}</p>
{/if}

<style>
  .strikeout {
    text-decoration: line-through;
  }
</style>
