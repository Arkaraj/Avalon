<script lang="ts">
    import { onMount } from "svelte";

    let todos: Array<{ text: string; completed: boolean }> = [];

    let text: string = "";
    let user: { name: string; githubId: number } | null = null;
    let loading = true;

    onMount(async () => {
        console.log("check: " + accessToken);
        const response = await fetch("http://localhost:3000/me", {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await response.json();
        console.log(data);
        user = data.user;
        loading = false;
    });
</script>

{#if loading}
    <div>Loading...</div>
{:else if user}
    <pre>{JSON.stringify(user,null,2)}</pre>
{:else}
    <div>No users Logged in</div>
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

<button
    on:click={() => {
        tsvscode.postMessage({
            type: "onInfo",
            value: "Info Message",
        });
    }}>Click me</button
>

<style>
    .strikeout {
        text-decoration: line-through;
    }
</style>
