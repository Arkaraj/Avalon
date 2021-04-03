<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";

  export let room: {
    _id: string;
    name: string;
    code: string;
    description: string;
  };
  export let accessToken: string;

  let members: Array<User> = [];

  onMount(async () => {
    // tsvscode.postMessage({
    //   type: "showRoomMembers",
    //   value: { roomId: admin._id, accessToken },
    // });

    const response = await fetch(`http://localhost:3000/admin/${room._id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    members = data.members;
  });
</script>

<div class="header">
  <p class="heading">{room.name}</p>
  <p class="code">Admin</p>
</div>
<p class="heading">Code: <span class="code">{room.code}</span></p>

<div>
  <p class="headin">Description:</p>
  <p>{room.description}</p>
</div>

<!-- <pre>{JSON.stringify(members,null,2)}</pre> -->
{#if members.length == 0}
  <p>No Members in this Room, To get Members share the Room Code</p>
{:else}
  <h4>Members of the room are:</h4>
  {#each members as member (member._id)}
    <ul>
      <li><h3>{member.name}</h3></li>
    </ul>
    <!-- Show this on click like a drop down -->
    <!-- {#each member.tasks as task (task._id)}
      <h4>{task}</h4>
    {/each} -->
  {/each}
{/if}
