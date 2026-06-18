<script>
	let { links } = $props();
</script>

<nav class="socials" aria-label="Social links">
	{#each links as link, i}
		{#if i > 0}<span class="dot">/</span>{/if}
		<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
	{/each}
</nav>
