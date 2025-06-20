<script lang="ts">
  import { onMount } from 'svelte';

  let message = 'Hello from Svelte!';
  let backendMessage = 'Loading...';

  onMount(async () => {
    try {
      const response = await fetch('/api/svelte-data');
      if (response.ok) {
        const data = await response.json();
        backendMessage = data.message;
      } else {
        backendMessage = 'Failed to load data from backend.';
        console.error('Failed to load data:', response.statusText);
      }
    } catch (error) {
      backendMessage = 'Error fetching data.';
      console.error('Error fetching data:', error);
    }
  });
</script>

<main>
  <h1>Svelte App</h1>
  <p>{message}</p>
  <p>Message from Backend: {backendMessage}</p>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  h1 {
    color: #ff3e00; /* Svelte orange */
    text-transform: uppercase;
    font-size: 3em; /* Adjusted for manual setup */
    font-weight: 100;
  }
</style>
