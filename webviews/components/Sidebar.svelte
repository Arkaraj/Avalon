<script lang="ts">
  import { onMount } from "svelte";
  // import Router from "svelte-routing/src/Router.svelte";
  // import Route from "svelte-routing/src/Route.svelte";
  import type { User } from "../types";
  import Dashboard from "./Dashboard.svelte";
  // import Link from "svelte-routing/src/Link.svelte";
  // import Room from "./Room.svelte";

  let accessToken = "";
  let user: User | null = null;
  let loading = true;

  // $: {
  //   tsvscode.setState({ accessToken });
  // }

  onMount(async () => {
    window.addEventListener("message", async (e) => {
      const message = e.data;

      switch (message.type) {
        case "Token":
          accessToken = message.value;

          const response = await fetch("http://localhost:3000/me", {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          // console.log(data);
          user = data.user;
          loading = false;

          break;
      }
    });

    tsvscode.postMessage({ type: "getToken", value: undefined });
  });
</script>

<!-- svelte-ignore missing-declaration -->
{#if loading}
  <div>Loading...</div>
{:else if user}
  <!-- <pre>{JSON.stringify(user,null,2)}</pre> -->
  <!-- <Router>
    <Link to="main">Go to DashBoard</Link>
    <Route path="main">
      <Dashboard {user} {accessToken} />
    </Route>

    <Route path="room">
      <Room />
    </Route>
    <Route />
  </Router> -->
  <Dashboard {user} {accessToken} />
  <div class="logout">
    <button
      on:click={() => {
        accessToken = "";
        user = null;
        tsvscode.postMessage({ type: "logout", value: undefined });
      }}>Logout</button
    >
  </div>
{:else}
  <div>You are Logged out!</div>
  <button
    on:click={() => {
      tsvscode.postMessage({ type: "authenticate", value: undefined });
    }}>Login with Github</button
  >
{/if}
