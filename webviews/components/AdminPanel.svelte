<script lang="ts">
  import { onMount } from "svelte";
  import { apiBaseUrl, Room, Task, User } from "../types";
  import ShowTask from "./ShowTask.svelte";

  export let room: Room;
  export let accessToken: string;

  let members: Array<User> = [];
  let admins: Array<User> = [];
  let error: Boolean = false;
  let view: Boolean = false;
  let msg: string = "";
  let editable: Boolean = false;
  let text: string = "";
  let desc: string = room.description;

  // let tasks: Array<{ _id: string; text: string; completed: boolean }> = [];
  let memberTasks: Array<Task> = [];

  const getMembers = async () => {
    // tsvscode.postMessage({
    //   type: "showRoomMembers",
    //   value: { roomId: admin._id, accessToken },
    // });
    const response = await fetch(`${apiBaseUrl}/admin/${room._id}`, {
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
      admins = data.admins;
    }
  };
  const getMemberTasks = async (userId: string) => {
    // tsvscode.postMessage({
    //   type: "showRoomMembers",
    //   value: { roomId: admin._id, accessToken },
    // });
    const response = await fetch(
      `${apiBaseUrl}/admin/${room._id}/${userId}`,
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

  const showTask = async (userId: string, member: User) => {
    // Close other mebmers panel if open, O(n), can be better
    members
      .filter((m) => m._id != userId)
      .forEach((mem) => {
        mem.visible = false;
      });
    // For UI
    member.visible = !member.visible;

    await getMemberTasks(userId);
  };

  window.addEventListener("message", async (e) => {
    const message = e.data;

    switch (message.type) {
      case "kickRoom":
        members = members.filter((member) => member._id !== message.value);
        break;
    }
  });

  const editDesc = (desc: string) => {
    editable = !editable;
  };
  const postDesc = async (desc: string) => {
    const description = {
      desc,
    };

    const response = await fetch(`${apiBaseUrl}/admin/${room._id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(description),
    });
    const data = await response.json();
    if (data.msgError) {
      error = true;
      msg = data.msg;
      return;
    } else {
      error = false;

      room.description = data.room.description;

      editable = false;
    }
  };
</script>

<div class="header">
  <p class="bold">{room.name}</p>
  <p class="code">Admin</p>
</div>
<!-- svelte-ignore missing-declaration -->

<div class="header">
  <p class="bold">Code: <span class="code">{room.code}</span></p>
  <h4
    class="addAdmin"
    on:click={() => {
      tsvscode.postMessage({
        type: "addAdmin",
        value: { accessToken: accessToken, roomId: room._id },
      });
    }}
  >
    Add Admin
  </h4>
</div>

<div class="desc">
  <p class="bold">Description:</p>
  <p>{room.description}</p>
  <p class="trash">
    <svg
      class="icons"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      on:click={() => editDesc(desc)}
      ><path
        d="M13.23 1h-1.46L3.52 9.25l-.16.22L1 13.59 2.41 15l4.12-2.36.22-.16L15 4.23V2.77L13.23 1zM2.41 13.59l1.51-3 1.45 1.45-2.96 1.55zm3.83-2.06L4.47 9.76l8-8 1.77 1.77-8 8z"
      /></svg
    >
  </p>
  {#if editable}
    <h3 class="code">Edit:</h3>
    <form on:submit|preventDefault={async () => await postDesc(desc)}>
      <input type="text" bind:value={desc} />
    </form>
    <h4 class="pre">Hit Enter to Submit, Give some time for changes to activate</h4>
  {/if}
</div>

<!-- Only when room has a message -->
{#if room._id}
<div class="roomMsg">
  <h3 class="msgHero">Room Message:</h3>
  <p>Today we will be having meeting at 4 sharp.
    Join: https://www.youtube.com/watch?v=VIqJ4rdKUEY&ab_channel=TutorialsPoint%28India%29Ltd.
  </p>
</div>
{/if}

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
                on:click={async () => await showTask(member._id, member)}
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
          {#if member.visible}
            <div class="taskCard">
              <ShowTask {text} {accessToken} {memberTasks} {member} {room} />
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

<!-- svelte-ignore missing-declaration -->
<div class="header">
  <h4 class="addAdmin" on:click={() => (view = !view)}>Show Admins</h4>
</div>

{#if view}
  {#each admins as admin (admin._id)}
    <p>{admin.name}</p>
  {/each}
{/if}

<!-- svelte-ignore missing-declaration -->
<button
  class="logout"
  on:click={() => {
    tsvscode.postMessage({
      type: "leaveAdmin",
      value: { accessToken: accessToken, roomId: room._id },
    });
  }}
>
  Leave Room
</button>
