<script lang="ts">
  import { onMount } from "svelte";

  export let accessToken: string;

  let tasks: Array<{
    _id: string;
    text: string;
    completed: boolean;
    room: string;
    user: string;
  }> = [];

  const getTasks = async () => {
    const response = await fetch("http://localhost:3000/task", {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    if (data.msgError) {
      console.log("Error Occured");
    } else {
      tasks = data.roomTasks;
    }
  };

  onMount(async () => {
    await getTasks();
  });
</script>

<h3>Tasks</h3>

{#if tasks.length == 0}
  <p>You don't have any Tasks yet!</p>
{:else}
  {#each tasks as task (task._id)}
    <blockquote>
      <div class="cards">
        <li class:strikeout={task.completed}>
          <input
            type="checkbox"
            checked={task.completed}
            on:click={() => {
              task.completed = !task.completed;
            }}
          />
          {task.text}
        </li>
      </div>
    </blockquote>
  {/each}
{/if}

<style>
  .strikeout {
    text-decoration: line-through;
  }
</style>
