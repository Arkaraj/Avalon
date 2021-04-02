<script lang="ts">
  import type { RoomDetail } from "../types";
  let roomSelected: boolean = true;
  let room: RoomDetail;
  let admin: boolean = true;
  let text: string = "";
  let tasks: Array<{ text: string; completed: boolean }> = [];
</script>

<!-- Tasks -->

{#if roomSelected}
  {#if admin}
    <div class="header">
      <p class="heading">RoomName</p>
      <p class="code">Admin</p>
    </div>

    <div class="members">
      <h4>Members of the room are:</h4>
      <!-- Members here room.members -->
    </div>

    <div class="tasks">
      <h4>Enter The tasks :</h4>
      <form
        on:submit|preventDefault={() => {
          tasks = [{ text, completed: false }, ...tasks];
          text = "";
        }}
      >
        <input bind:value={text} />
      </form>

      <ul>
        {#each tasks as todo (todo.text)}
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
      <!-- List of all the tasks -->
    </div>
  {:else}
    <p>Your tasks for this roomName is:</p>
  {/if}
{:else}
  <h3>Click on a Room to assign/view Tasks</h3>
{/if}

<style>
  .strikeout {
    text-decoration: line-through;
  }
</style>
