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
  <p class="bold">
    <svg
      class="icons2"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      ><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5 2.5l.5-.5h2l.5.5v11l-.5.5h-2l-.5-.5v-11zM6 3v10h1V3H6zm3.171.345l.299-.641 1.88-.684.64.299 3.762 10.336-.299.641-1.879.684-.64-.299L9.17 3.345zm1.11.128l3.42 9.396.94-.341-3.42-9.397-.94.342zM1 2.5l.5-.5h2l.5.5v11l-.5.5h-2l-.5-.5v-11zM2 3v10h1V3H2z"
      /></svg
    >

    Pending Tasks:
  </p>
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
  <p class="bold">
    <svg
      class="icons2"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      ><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.62 3.596L7.815 12.81l-.728-.033L4 8.382l.754-.53 2.744 3.907L14.917 3l.703.596z"
      /><path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7.234 8.774l4.386-5.178L10.917 3l-4.23 4.994.547.78zm-1.55.403l.548.78-.547-.78zm-1.617 1.91l.547.78-.799.943-.728-.033L0 8.382l.754-.53 2.744 3.907.57-.672z"
      /></svg
    >

    Completed Tasks:
  </p>
  {#each tasks.filter((t) => t.completed == true) as task (task._id)}
    <div class="cards">
      <li>
        {task.text}
      </li>
      <div>Room: <span class="code">{task.room.name}</span></div>
    </div>
  {/each}
{/if}
