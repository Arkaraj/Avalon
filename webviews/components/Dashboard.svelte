<script lang="ts">
  import type { User } from "../types";
  import { onMount } from "svelte";

  let todos: Array<{ text: string; completed: boolean }> = [];
  let text: string = "";

  export let user: User;
  export let accessToken: string;

  let createRooms: Array<{ name: string; description: string }> = [];

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
  onMount(async () => {
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
  });
</script>

<div>Welcome <span class="textlink">{user.name}</span></div>

<h3>Admin:</h3>

{#if admin.length == 0}
  <p>You have not created any Rooms yet!</p>
{:else}
  {#each admin as admin (admin.code)}
    <blockquote class="cards">
      <div class="header">
        <p
          class="heading"
          on:click={() => {
            tsvscode.postMessage({
              type: "showRoomMembers",
              value: { roomId: admin._id, accessToken },
            });
          }}
        >
          {admin.name}
        </p>
        <p class="code">{admin.code}</p>
      </div>
      <div>
        {admin.description}
        <!-- <button
          on:click={() => {
            tsvscode.postMessage({
              type: "deleteRoom",
              value: { roomId: admin._id, accessToken },
            });
          }}>Remove</button
        > -->
      </div>
    </blockquote>
  {/each}
{/if}

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
  {#each rooms as room (room.code)}
    <blockquote>
      <div class="cards">
        <p class="heading">{room.name}</p>
        <div>
          <div class="header">
            <p>{room.description}</p>
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

<form
  on:submit|preventDefault={() => {
    todos = [{ text, completed: false }, ...todos];
    text = "";
  }}
>
  <input bind:value={text} />
</form>

<ul>
  {#each todos as todo (todo.text)}
    <li class:strikeout={todo.completed}>
      <input
        type="checkbox"
        checked={todo.completed}
        on:click={() => {
          todo.completed = !todo.completed;
        }}
      />
      {todo.text}
    </li>
  {/each}
</ul>

<style>
  .strikeout {
    text-decoration: line-through;
  }
</style>
