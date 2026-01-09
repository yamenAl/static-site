<script>
  let { data } = $props();
</script>

<h1>hello</h1>

<ul>
  {#each data.articles as article}
    <li>{article.titel}</li>
    <li>{article.body}</li>
  {/each}
</ul>