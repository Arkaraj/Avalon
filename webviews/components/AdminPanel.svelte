<script lang="ts">
  import { onMount } from "svelte";
  import type { Task, User } from "../types";
  import ShowTask from "./ShowTask.svelte";

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
  let visible: Boolean = false;
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
    // await getMemberTasks("605874bb197f7b0b96dfdc1f"); // Pranav
  });

  const showTask = async (userId: string) => {
    await getMemberTasks(userId);
    visible = !visible;
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
          <h3 class="heading" on:click={async () => await showTask(member._id)}>
            {member.name}
          </h3>
        </li>
        {#if visible}
          <ShowTask
            {text}
            {accessToken}
            {tasks}
            {memberTasks}
            {member}
            {room}
          />
        {/if}
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
