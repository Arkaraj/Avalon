<script lang="ts">
    import type { User } from "../types";

    let todos: Array<{ text: string; completed: boolean }> = [];
    let text: string = "";

    export let user: User;
</script>

<div>Hello {user.name}</div>

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
