<script lang="ts">
  import { onMount } from "svelte";
  import { apiBaseUrl, Room, Task, User } from "../types";

  export let room: Room;

  export let accessToken: string;

  let tasks: Array<Task> = [];
  let Admins: Array<User> = [];
  let error: Boolean = false;
  let msg: string = "";
  onMount(async () => {
    const response = await fetch(
      `${apiBaseUrl}/task/${room._id}`,
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
      `${apiBaseUrl}/task/${taskId}`,
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


{#if room.message}
<h2 class="bold">Room Message: </h2>
  <div class="roomMsg">
    <h3 class="msgHero">Room Message:</h3>
    <p>
      {room.message}
    </p>
  </div>
  <!-- <p class="code">Hide</p> -->
{/if}

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
