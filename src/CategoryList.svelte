<script>
  import BookList from './BookList.svelte'; // Import the BookList component

  let categories = [];
  let selectedCategory = null;
  let showBookList = false; // State variable to control rendering

  async function getCategories() {
    try {
      // const response = await fetch('http://localhost:3000/');
      const response = await fetch('https://book-server-n6xk.onrender.com/');
      if (response.ok) {
        categories = await response.json();
      } else {
        console.error('Failed to fetch categories:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  getCategories();

  // Function to handle category button click event
  function handleCategoryClick(groupName) {
    console.log("Clicked Category:", groupName);
    selectedCategory = groupName; // Set the selected category
    showBookList = true; // Set the state variable to show BookList
  }

  // Function to handle going back to category list
  function handleBackClick() {
    showBookList = false; // Set the state variable to show CategoryList
    selectedCategory = null; // Reset selected category
  }
</script>

{#if showBookList}
  <BookList {selectedCategory} on:back={handleBackClick}/> <!-- Render BookList component when showBookList is true -->
{:else}
  <div>
    <h2>What Do You Want To Read?</h2>
    {#each categories as groupName}
      <button class="category-button" on:click={() => handleCategoryClick(groupName)}>{groupName}</button>
    {/each}
  </div>
{/if}

<style>
  /* Add your CSS styles here */
  h2 {
    font-size: 30px;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .category-button {
    font-size: 20px;
    width: 240px;
    height: auto;
    background-color: darkgreen;
    color: white;
    border: none;
    border-radius: 10px;
    margin: 2px;
    cursor: pointer;
    font-family: Chalkboard, sans-serif;
  }
  button:hover {
        background-color: green;
    }
</style>
