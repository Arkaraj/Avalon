<script lang="ts">
  import { onMount } from "svelte";
  import type { Room } from "../types";

  let accessToken: string;

  let tasks: Array<{
    _id: string;
    text: string;
    completed: boolean;
    room: Room;
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
    tsvscode.postMessage({ type: "getToken", value: null });
  });

  window.addEventListener("message", async (e) => {
    const message = e.data;

    switch (message.type) {
      case "token":
        accessToken = message.value;
        await getTasks();
        break;
    }
  });
</script>

<h3>Tasks</h3>

{#if tasks.length == 0}
  <p>You don't have any Tasks assigned yet!</p>
{:else}
  <p class="bold">Pending Tasks:</p>
  {#if tasks.filter((t) => t.completed == false).length == 0}
    <p>You have no tasks left 🚀</p>
  {/if}
  {#each tasks.filter((t) => t.completed == false) as task (task._id)}
    <div class="cards">
      <li>
        {task.text}
      </li>
      <div>Room: <span class="code">{task.room.name}</span></div>
    </div>
  {/each}
  <p class="bold">Completed Tasks:</p>
  {#each tasks.filter((t) => t.completed == true) as task (task._id)}
    <div class="cards">
      <li>
        {task.text}
      </li>
      <div>Room: <span class="code">{task.room.name}</span></div>
    </div>
  {/each}
{/if}
