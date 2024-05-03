<script>
    export let bookTitle;
    export let location;
    let click = true; 
    import CategoryList from './CategoryList.svelte';

    function handleClick() {
        click = false;
    }
</script>

{#if click}
<h2>{bookTitle}</h2>
<p>Location: {location}</p>
{#if location}
    {#if location === 'Clock Tower'}
        <p>Look to the right to find the book you seek!</p>
        <div class="arrow-right">
            <img src='./arrow.png' alt="Right Arrow" class="arrow-img">
        </div>
    {:else if location === 'Book Cart'}
        <p>Look down and unearth the book you seek!</p>
        <div class="arrow-down">
            <img src='./arrow.png' alt="Down Arrow" class="arrow-img">
        </div>
    {:else if location === 'Wooden Crates'}
        <p>Cast your gaze to the left and discover the book you seek!</p>
        <div class="arrow-left">
            <img src='./arrow.png' alt="Left Arrow" class="arrow-img">
        </div>
    {:else}
        <p>No specific instruction available.</p>
    {/if}
    <button on:click={handleClick}>Find Another Book!</button>
{/if}
{:else}
    <CategoryList />
{/if}

<style>
    h2 {
        margin-top: 0px;
        font-size: 20px;
        margin-bottom: 10px;
    }

    p {
        font-size: 20px;
        margin-bottom: -15px;
    }

    .arrow-right,
    .arrow-down,
    .arrow-left {
        width: 200px;  /* Increased arrow size */
        height: 200px;
        position: relative;
        display: inline-block;
        margin-top: 30px;
    }

    .arrow-img {
        width: 100%;
        height: 100%;
        transform-origin: center;
        animation: spin 1s linear 3; /* Spin animation limited to 3 iterations */
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .arrow-right {
        transform: rotate(-180deg); /* Rotate left arrow for right position */
    }

    .arrow-down {
        transform: rotate(-90deg); /* Rotate left arrow for down position */
    }

    .arrow-left {
        transform: rotate(0deg); /* No change needed for left arrow */
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

