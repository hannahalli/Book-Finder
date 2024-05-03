<script>
  import { onMount } from 'svelte';
  import BookDetails from './BookDetails.svelte';

  export let selectedCategory;

  let books = [];
  let showBookDetails = false;
  let selectedBookTitle = '';

  // Function to fetch book titles for the selected category
  async function fetchBooks(groupName) {
    try {
      const response = await fetch(`https://book-server-n6xk.onrender.com/books/${groupName}`);
      if (response.ok) {
        const data = await response.json();
        books = data.bookTitles;
      } else {
        console.error('Failed to fetch books:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }

  // Function to handle button click event
  function handleClick(bookTitle) {
    showBookDetails = true;
    selectedBookTitle = bookTitle;
  }

  // Fetch books when the component is mounted
  onMount(async () => {
    await fetchBooks(selectedCategory);
  });
</script>

{#if !showBookDetails}
<div>
  <h2>Pick a Book to Learn More!</h2>
  {#each books as bookTitle}
    <button class="book-button" on:click={() => handleClick(bookTitle)}>{bookTitle}</button>
  {/each}
</div>
{:else}
<BookDetails bookTitle="{selectedBookTitle}" />
{/if}

<style>
  /* Add your CSS styles here */
  h2 {
    font-size: 25px;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .book-button {
    font-size: 18px;
    width: 260px; /* Set width to auto */
    padding: 10px 20px; /* Add padding for height adjustment */
    background-color: darkgreen;
    color: white;
    border: none;
    border-radius: 10px;
    margin: 2px;
    cursor: pointer;
  }
  button:hover {
        background-color: green;
    }

</style>
