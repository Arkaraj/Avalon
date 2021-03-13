<script lang="ts">
    let counter = 0;
</script>

<div>
    Counter: <h1>{counter}</h1>

    <button
        on:click={() => {
            counter++;
        }}>Increment</button
    >
</div>
