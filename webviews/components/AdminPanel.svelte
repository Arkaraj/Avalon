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

  window.addEventListener("message", async (e) => {
    const message = e.data;

    switch (message.type) {
      case "kickRoom":
        members = members.filter((member) => member._id !== message.value);
        break;
    }
  });
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
  <h3 class="bold">
    No Members in this Room, To get Members share the Room Code.
  </h3>
{:else}
  <h3>Members of the room are:</h3>
  {#if !error}
    <div class="memberCard">
      {#each members as member (member._id)}
        <ul>
          <li>
            <h3 class="header">
              <h3
                class="heading"
                on:click={async () => await showTask(member._id)}
              >
                {member.name}
              </h3>
              <div class="side">
                <!-- svelte-ignore missing-declaration -->
                <svg
                  class="closeIcons"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  on:click={() => {
                    tsvscode.postMessage({
                      type: "removeUser",
                      value: {
                        accessToken: accessToken,
                        userId: member._id,
                        roomId: room._id,
                      },
                    });
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  ><path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M8.6 1c1.6.1 3.1.9 4.2 2 1.3 1.4 2 3.1 2 5.1 0 1.6-.6 3.1-1.6 4.4-1 1.2-2.4 2.1-4 2.4-1.6.3-3.2.1-4.6-.7-1.4-.8-2.5-2-3.1-3.5C.9 9.2.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1zm.5 12.9c1.3-.3 2.5-1 3.4-2.1.8-1.1 1.3-2.4 1.2-3.8 0-1.6-.6-3.2-1.7-4.3-1-1-2.2-1.6-3.6-1.7-1.3-.1-2.7.2-3.8 1-1.1.8-1.9 1.9-2.3 3.3-.4 1.3-.4 2.7.2 4 .6 1.3 1.5 2.3 2.7 3 1.2.7 2.6.9 3.9.6zM7.9 7.5L10.3 5l.7.7-2.4 2.5 2.4 2.5-.7.7-2.4-2.5-2.4 2.5-.7-.7 2.4-2.5-2.4-2.5.7-.7 2.4 2.5z"
                  /></svg
                >
              </div>
            </h3>
          </li>
          {#if visible}
            <div class="taskCard">
              <ShowTask
                {text}
                {accessToken}
                {tasks}
                {memberTasks}
                {member}
                {room}
              />
            </div>
          {/if}
        </ul>
        <!-- Show this on click like a drop down -->
        <!-- {#each member.tasks as task (task._id)}
    <h4>{task}</h4>
  {/each} -->
      {/each}
    </div>
  {:else}
    <p>{msg}</p>
  {/if}
{/if}
