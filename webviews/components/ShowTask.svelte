<script lang="ts">
  import { apiBaseUrl, Room, Task, User } from "../types";

  export let text: string;
  export let memberTasks: Array<Task>;
  export let member: User;
  export let room: Room;

  export let accessToken: string;
  let tasks: Array<{ _id: string; text: string; completed: boolean }> = [];

  const postTask = async (userId: string) => {
    // For quick UI rendering
    // tasks = [{ text, completed: false }, ...tasks];

    const todo = {
      text,
    };

    const response = await fetch(
      `${apiBaseUrl}/admin/task/${room._id}/${userId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(todo),
      }
    );

    const data = await response.json();

    // This Works
    tasks = [
      {
        _id: data.task._id,
        text: data.task.text,
        completed: data.task.completed,
      },
      ...tasks,
    ];

    text = "";
  };

  const deleteTask = async (taskId: string) => {
    const response = await fetch(
      `${apiBaseUrl}/admin/task/${taskId}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    if (data.done) {
      memberTasks = memberTasks.filter((task) => task._id !== taskId);
      tasks = tasks.filter((task) => task._id !== taskId);
    } else {
    }
  };
</script>

<div class="taskInput">
  <h4>Enter The tasks :</h4>
  <form on:submit|preventDefault={() => postTask(member._id)}>
    <input bind:value={text} />
  </form>

  <ul>
    {#each tasks as todo (todo._id)}
      <div class="taskView">
        <li class="tasks">
          <span>{todo.text}</span>
        </li>
        <div class="side">
          <svg
            class="icons"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            on:click={async () => {
              await deleteTask(todo._id);
            }}
            ><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"
            /></svg
          >
        </div>
      </div>
    {/each}
  </ul>
  <!-- List of all the tasks -->
</div>
{#if memberTasks.length == 0}
  <p>No tasks assigned yet !</p>
{:else}
  {#each memberTasks as task (task._id)}
    <ul class="taskView">
      <li class="tasks">
        <span class:strikeout={task.completed}>{task.text}</span>
        {#if task.completed}
          <span class="code">(completed)</span>
        {/if}
      </li>
      <div class="side">
        <svg
          class="icons"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          on:click={async () => {
            await deleteTask(task._id);
          }}
          ><path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"
          /></svg
        >
      </div>
    </ul>
  {/each}
{/if}
