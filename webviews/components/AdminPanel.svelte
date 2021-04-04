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

  let members: Array<User> = [];
  let error: Boolean = false;
  let msg: string = "";

  let text: string = "";
  let tasks: Array<{ text: string; completed: boolean }> = [];
  let memberTasks: Array<Task> = [];

  const getMembers = async () => {
    // tsvscode.postMessage({
    //   type: "showRoomMembers",
    //   value: { roomId: admin._id, accessToken },
    // });
    const response = await fetch(`http://localhost:3000/admin/${room._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    if (data.msgError) {
      members = [];
      error = true;
      msg = data.msg;
    } else {
      error = false;
      members = data.members;
      // console.log(data.members);
    }
  };
  const getMemberTasks = async (userId: string) => {
    // tsvscode.postMessage({
    //   type: "showRoomMembers",
    //   value: { roomId: admin._id, accessToken },
    // });
    const response = await fetch(
      `http://localhost:3000/admin/${room._id}/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (data.msgError) {
      memberTasks = [];
      error = true;
      msg = data.msg;
    } else {
      error = false;
      memberTasks = data.tasks;
      // console.log(data.members);
    }
  };

  onMount(async () => {
    await getMembers();
    // Will be dynamic later on
    // await getMemberTasks("604e50e8928cb54baa934bdf"); // Arkaraj
    await getMemberTasks("605874bb197f7b0b96dfdc1f"); // Pranav
  });

  const postTask = async (userId: string) => {
    // For quick UI rendering
    tasks = [{ text, completed: false }, ...tasks];

    const todo = {
      text,
    };

    const response = await fetch(
      `http://localhost:3000/admin/task/${room._id}/${userId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(todo),
      }
    );

    const data = await response.json();

    // This Works
    // tasks = [
    //   { text: data.task.text, completed: data.task.completed },
    //   ...tasks,
    // ];

    text = "";
  };

  const deleteTask = async (taskId: string) => {
    const response = await fetch(
      `http://localhost:3000/admin/task/${taskId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (data.done) {
      memberTasks = memberTasks.filter((task) => task._id !== taskId);
    } else {
    }
  };
</script>

<div class="header">
  <p class="bold">{room.name}</p>
  <p class="code">Admin</p>
</div>
<p class="bold">Code: <span class="code">{room.code}</span></p>

<div>
  <p class="bold">Description:</p>
  <p>{room.description}</p>
</div>

<!-- <pre>{JSON.stringify(members,null,2)}</pre> -->
{#if members.length == 0}
  <p>No Members in this Room, To get Members share the Room Code</p>
{:else}
  <h4>Members of the room are:</h4>
  {#if !error}
    {#each members as member (member._id)}
      <ul>
        <li>
          <h3>{member.name}</h3>
        </li>
        <div class="taskCard">
          <h4>Enter The tasks :</h4>
          <form on:submit|preventDefault={() => postTask(member._id)}>
            <input bind:value={text} />
          </form>

          <ul>
            {#each tasks as todo (todo.text)}
              <li class="tasks">
                {todo.text}
              </li>
            {/each}
          </ul>
          <!-- List of all the tasks -->
        </div>
        {#each memberTasks as task (task._id)}
          <ul class="">
            <li class="tasks" class:strikeout={task.completed}>{task.text}</li>
            <div class="trash">
              <svg
                class="icons"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                on:click={async () => {
                  await deleteTask(task._id);
                }}
                ><path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"
                /></svg
              >
            </div>
          </ul>
        {/each}
      </ul>
      <!-- Show this on click like a drop down -->
      <!-- {#each member.tasks as task (task._id)}
    <h4>{task}</h4>
  {/each} -->
    {/each}
  {:else}
    <p>{msg}</p>
  {/if}
{/if}
