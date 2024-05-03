<!-- App.svelte -->
<script>
    import { onMount } from 'svelte';
    import CategoryList from './CategoryList.svelte';

    let currentComponent = null;
    let categories = [];

    const toggleCategories = () => {
        currentComponent = CategoryList;
    };
</script>

<div class="container">
    {#if !currentComponent}
        <h1>Welcome to the Book Finder!</h1>
        <div class="paragraph-container">
            <p>There are so many wonderful stories to read! Look through the different categories to find a book.</p>
        </div>
        <button on:click={toggleCategories}>Find a Book!</button>
    {/if}

    {#if currentComponent}
        <svelte:component this={currentComponent}  />
    {/if}
</div>

<style>
    /* Add your CSS styles here */
    .container {
        position: absolute;
        top: 75px; /* Adjust the top position as per your requirement */
        left: calc((1536px - 500px) / 2 + 400px); /* Adjust the left position as per your requirement */
        width: 260px; /* Increase width */
        height: 550px; /* Increase height */
        background-color: #FAEBD7; /* Set light brown background color */
        border: 8px solid #8B4513; /* Set dark brown border */
        padding: 20px;
        border-radius: 15px;
        /* overflow-y: auto; Enable scrolling if content overflows */
        z-index: 1; /* Ensure the container is above other elements */
        pointer-events: auto; /* Enable pointer events for the container */
        text-align: center; /* Center text horizontally */
        color: #8B4513; /* Set text color to dark brown */
        font-family: Chalkboard, sans-serif; /* Set font to Chalkduster */
    }

    h1 {
        margin-top: 50px; /* Lower the margin top */
        font-size: 30px;
    }

    .paragraph-container {
        background-color: #e3fad7; /* Set light brown background color */
        padding: 10px; /* Add padding */
        border-radius: 10px; /* Add border radius */
        margin-bottom: 25px; /* Add margin bottom */
        margin-top: 15px;
        width: 200px; /* Set width to auto */
        align-items: center;
        margin-left: 15px;
        border: 4px solid #8B4513; /* Set dark brown border */
    }

    p {
        font-size: 20px; /* Set font size for paragraphs */
    }

    button {
        font-size: 25px;
        padding: 10px 20px;
        width: 220px; /* Set width to auto */
        background-color: darkgreen;
        color: white;
        border: 4px solid #8B4513; /* Set dark brown border */
        border-radius: 10px;
        cursor: pointer;
    }

    button:hover {
        background-color: green;
    }
</style>

