<script lang="ts">
  import type { User } from "../types";
  import { onMount } from "svelte";
  import Admin from "./Admin.svelte";
  import * as vscode from "vscode";
  import Room from "./Room.svelte";

  export let user: User;
  export let accessToken: string;

  let createdRooms: Array<{ name: string; description: string }> = [];

  let isloading = true;
  let rooms: Array<{
    _id: string;
    name: string;
    code: string;
    description: string;
  }> = [];
  let admin: Array<{
    _id: string;
    name: string;
    code: string;
    description: string;
  }> = [];
  let name = "";
  let description = "";
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

    isloading = false;
  };

  onMount(async () => {
    await getRooms();
  });

  $: async () => {
    admin = [...admin];
    await getRooms();
  };

  const deleteRoom = async ({ detail: id }: any) => {
    // admin = admin.filter((room) => room._id !== id);
    await getRooms();
  };

  let rrrom: {
    _id: string;
    name: string;
    code: string;
    description: string;
  } | null;

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
    }
  });
</script>

<div>Welcome <span class="textlink">{user.name}</span></div>

<h3>Admin:</h3>

{#if admin.length == 0}
  <p>You have not created any Rooms yet!</p>
{:else}
  {#each admin as admin (admin.code)}
    <!-- on:deleteRoom={deleteRoom} -->
    <Admin {admin} {accessToken} on:deleteRoom={deleteRoom} />
  {/each}
{/if}

<!-- <pre>{JSON.stringify(admin,null,2)}</pre> -->

<!-- svelte-ignore missing-declaration -->

<!-- <form
  on:submit|preventDefault={async () => {
    rrrom = await createRoom({ name, description });
    if (rrrom) {
      admin = [
        { _id: rrrom._id, name, description, code: rrrom.code },
        ...admin,
      ];
    } else {
    }
    console.log(rrrom);
    name = "";
    description = "";
  }}
>
  <input bind:value={name} />
  <input bind:value={description} />
  <button type="submit">submit</button>
</form> -->

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
        <p class="heading">{room.name}</p>
        <div>
          <div class="header">
            <p>{room.description}</p>

            <div class="trash">
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

            <!-- <button class="round"
              ><svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                ><path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z"
                /></svg
              ></button
            > -->
          </div>
        </div>
      </div>
    </blockquote>
  {/each}
{/if}

<button
  on:click={() => {
    tsvscode.postMessage({ type: "joinRoom", value: accessToken });
  }}
>
  Join a Room
</button>
