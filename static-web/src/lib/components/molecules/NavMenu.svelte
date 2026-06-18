<script>
	const links = [
		{ href: '#work', label: 'Work' },
		{ href: '#about', label: 'About' },
		{ href: '#contact', label: 'Contact' }
	];
</script>

<nav id="main-nav" class="menu" aria-label="Main">
	{#each links as link}
		<a href={link.href}>{link.label}</a>
	{/each}
</nav>
