<script>
  export let admin;
  export let accessToken;
  // import Router from "svelte-routing/src/Router.svelte";
  // import Link from "svelte-routing/src/Link.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
</script>

<blockquote class="cards">
  <div class="header">
    <!-- svelte-ignore missing-declaration -->
    <p
      class="heading"
      on:click={() => {
        dispatch("goToRoom", admin);
      }}
    >
      {admin.name}
    </p>
    <p class="code">{admin.code}</p>
  </div>
  <div>
    {admin.description}
    <div class="trash">
      <!-- svelte-ignore missing-declaration -->
      <svg
        class="icons"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        on:click={async () => {
          tsvscode.postMessage({
            type: "deleteRoom",
            value: { roomId: admin._id, accessToken },
          });
        }}
        ><path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"
        /></svg
      >
    </div>
  </div>
</blockquote>
