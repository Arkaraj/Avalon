<script lang="ts">
    let todos: Array<{ text: string; completed: boolean }> = [];

    let text: string = "";
</script>

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
