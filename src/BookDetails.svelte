<!-- BookDetails.svelte -->
<script>
  import { onMount } from 'svelte';
  import Location from './Location.svelte';
  let click = true;

  export let bookTitle;

  let bookInfo = null;
  let locationInfo = null;

  async function fetchBookDetails(title) {
    try { 
      //const response = await fetch(`http://localhost:3000/search?title=${encodeURIComponent(title)}`);
      const response = await fetch(`https://book-server-n6xk.onrender.com/search?title=${encodeURIComponent(title)}`);
      if (response.ok) {
        bookInfo = await response.json();
      } else {
        console.error('Failed to fetch book details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  }

  async function fetchLocation(title) {
    try {
      const response = await fetch(`https://book-server-n6xk.onrender.com/book-location/${encodeURIComponent(title)}`);
      if (response.ok) {
        locationInfo = await response.json();
      } else {
        console.error('Failed to fetch location:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  }

  // Fetch book details when the component is mounted
  onMount(async () => {
    await fetchBookDetails(bookTitle);
  });

  async function handleFindMe() {
    await fetchLocation(bookTitle);
  }
</script>

{#if locationInfo}
  <Location bookTitle={bookTitle} location={locationInfo.location} />
{:else}
  {#if bookInfo}
    <h2>{bookInfo.Title}</h2>
    {#if bookInfo.Author}
      <p>Author: {bookInfo.Author}</p>
    {/if}
    {#if bookInfo['Edition Date']}
      <p>Publication Date: {bookInfo['Edition Date']}</p>
    {/if}
    {#if bookInfo.Publisher}
      <p>Publisher: {bookInfo.Publisher}</p>
    {/if}
    {#if bookInfo.Description}
      <p class="description">Description: {bookInfo.Description}</p>
    {/if}
    <button on:click={handleFindMe}>Find Me!</button>
  {/if}
{/if}

<style>
  h2 {
    margin-top: 0px;
    font-size: 25px;
    margin-bottom: 10px;
  }

  p {
    font-size: 18px;
    margin-bottom: -15px;
  }

  .description {
    margin-top: 30px;
    font-size: 15px;
    margin-bottom: 10px;
  }

  button {
    margin-top: 50px;
    font-size: 18px;
    padding: 8px 16px;
    background-color: darkgreen;
    color: white;
    border: none;
    margin-top: 5px;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: green;
  }

</style>