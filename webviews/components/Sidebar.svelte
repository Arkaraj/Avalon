<script lang="ts">
    import { onMount } from "svelte";
    import type { User } from "../types";
    import Task from "./Task.svelte";

    let accessToken = "";
    let user: User | null = null;
    let loading = true;

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
                    console.log(data);
                    user = data.user;
                    loading = false;

                    break;
            }
        });

        tsvscode.postMessage({ type: "getToken", value: undefined });
    });
</script>

{#if loading}
    <div>Loading...</div>
{:else if user}
    <!-- <pre>{JSON.stringify(user,null,2)}</pre> -->
    <Task {user} />
    <!-- <div>Hello {user.name}</div> -->

    <button
        on:click={() => {
            accessToken = "";
            user = null;
            tsvscode.postMessage({ type: "logout", value: undefined });
        }}>Logout</button
    >
{:else}
    <button
        on:click={() => {
            tsvscode.postMessage({ type: "authenticate", value: undefined });
        }}>Login with Github</button
    >
{/if}
