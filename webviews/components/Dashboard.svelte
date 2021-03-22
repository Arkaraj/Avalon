<script lang="ts">
    import type { User } from "../types";
    import { onMount } from "svelte";

    let todos: Array<{ text: string; completed: boolean }> = [];
    let text: string = "";

    export let user: User;
    export let accessToken: string;

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
        console.log(admin.length);
        isloading = false;
    });
</script>

<div>Welcome <span class="textlink">{user.name}</span></div>

<h3>Admin:</h3>

{#if admin.length == 0}
    <p>You have not created any Rooms yet!</p>
{:else}
    {#each admin as admin (admin.code)}
        <div>
            <p>{admin.name}</p>
            <p>{admin.code}</p>
        </div>
    {/each}
{/if}

<h3>Rooms:</h3>

{#if rooms.length == 0}
    <p>You have not joined any Room yet!</p>
{:else}
    {#each rooms as room (room.code)}
        <div>
            {room.name}
        </div>
    {/each}
{/if}

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
