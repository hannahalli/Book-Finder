<!-- BookInfo.svelte -->
<script>
    export let book;
  </script>
  
  <div>
    <h3>{book.title}</h3>
    <p>Author: {book.author}</p>
    <p>Genre: {book.genre}</p>
    <p>Description: {book.description}</p>
    <p>Fun Fact: {book.fun_fact}</p>
  </div>
  