<script lang="ts">
  import type { User } from "../types";
  import { onMount } from "svelte";
  import Admin from "./Admin.svelte";
  import AdminPanel from "./AdminPanel.svelte";
  import TaskPanel from "./TaskPanel.svelte";
  
  // import Task from "./Task.svelte";
  // import Router from "svelte-routing/src/Router.svelte";
  // import Link from "svelte-routing/src/Link.svelte";
  // import Route from "svelte-routing/src/Route.svelte";
  // import Home from "./Home.svelte";

  export let user: User;
  export let accessToken: string;

  let page: "main" | "tasks" | "admin" = tsvscode.getState()?.page || "main";
  // tsvscode.getState()?.page ||
  let rooms: Array<{
    _id: string;
    name: string;
    code: string;
    description: string;
  }> = [];
  let roomData: {
    _id: string;
    name: string;
    code: string;
    description: string;
  } | null = tsvscode.getState()?.roomData || null;
  let admin: Array<{
    _id: string;
    name: string;
    code: string;
    description: string;
  }> = [];

  let adminData: {
    _id: string;
    name: string;
    code: string;
    description: string;
  } | null = tsvscode.getState()?.adminData || null;

  $: {
    tsvscode.setState({ page, roomData, adminData, accessToken });
  }

  const getRooms = async () => {
    const response = await fetch("http://localhost:3000/room", {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    // console.log(data);
    rooms = data.rooms;
    admin = data.admin;
  };

  onMount(async () => {
    await getRooms();
  });

  const changePage = ({ detail }: any) => {
    page = "admin";
    adminData = detail;
  };

  const assignTask = (room: typeof roomData) => {
    roomData = room;
    page = "tasks";
  };

  window.addEventListener("message", async (e) => {
    const message = e.data;

    switch (message.type) {
      case "createdRoom":
        if (message.value) {
          admin = [...admin, message.value];
        } else {
        }

        break;

      case "deleteRoom":
        admin = admin.filter((room) => room._id !== message.value);
        break;

      case "joinRoom":
        rooms = [...rooms, message.value];
        break;

      case "leaveRoom":
        rooms = rooms.filter((room) => room._id !== message.value);
        break;
      case "leaveAdmin":
        page = "main";
        break;
    }
  });
</script>

<!-- <Router>
  <Link to="/room">Go to Room</Link>
  <Route path="/room" component={Home} />
</Router> -->

{#if page === "main"}
  <div>Welcome <span class="textlink">{user.name}</span></div>
  <div>GitHub Id: <span class="textlink">{user.githubId}</span></div>

  <h3>Admin:</h3>

  {#if admin.length == 0}
    <p>You have not created any Rooms yet!</p>
  {:else}
    {#each admin as admin (admin.code)}
      <!-- on:deleteRoom={deleteRoom} -->
      <Admin {admin} {accessToken} on:goToRoom={changePage} />
    {/each}
  {/if}

  <!-- <pre>{JSON.stringify(admin,null,2)}</pre> -->

  <!-- svelte-ignore missing-declaration -->
  <button
    on:click={() => {
      tsvscode.postMessage({ type: "createRoom", value: accessToken });
    }}
  >
    Create a Room
  </button>

  <h3>Rooms:</h3>

  {#if rooms.length == 0}
    <p>You have not joined any Room yet!</p>
  {:else}
    {#each rooms as room (room._id)}
      <blockquote>
        <div class="cards">
          <p class="heading" on:click={() => assignTask(room)}>{room.name}</p>
          <div>
            <div class="header">
              <p class="desc">{room.description}</p>

              <div class="trash">
                <!-- svelte-ignore missing-declaration -->
                <svg
                  class="icons"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  on:click={async () => {
                    tsvscode.postMessage({
                      type: "leaveRoom",
                      value: { roomId: room._id, accessToken },
                    });
                  }}
                  ><path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M11.02 3.77v1.56l1-.99V2.5l-.5-.5h-9l-.5.5v.486L2 3v10.29l.36.46 5 1.72L8 15v-1h3.52l.5-.5v-1.81l-1-1V13H8V4.71l-.33-.46L4.036 3h6.984v.77zM7 14.28l-4-1.34V3.72l4 1.34v9.22zm6.52-5.8H8.55v-1h4.93l-1.6-1.6.71-.7 2.47 2.46v.71l-2.49 2.48-.7-.7 1.65-1.65z"
                  /></svg
                >
              </div>
            </div>
          </div>
        </div>
      </blockquote>
    {/each}
  {/if}

  <!-- <Task {accessToken} /> -->

  <!-- svelte-ignore missing-declaration -->
  <button
    on:click={() => {
      tsvscode.postMessage({ type: "joinRoom", value: accessToken });
    }}
  >
    Join a Room
  </button>
{:else if page === "tasks"}
  <button
    on:click={() => {
      page = "main";
    }}>Back</button
  >
  <!-- svelte-ignore missing-declaration -->
  <TaskPanel room={tsvscode.getState()?.roomData || roomData} {accessToken} />
{:else if page === "admin"}
  <button
    on:click={() => {
      page = "main";
    }}>Back</button
  >
  <!-- svelte-ignore missing-declaration -->
  <AdminPanel
    room={tsvscode.getState()?.adminData || adminData}
    {accessToken}
  />
{/if}
