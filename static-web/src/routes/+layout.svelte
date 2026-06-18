<script>
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/organisms/Navbar.svelte';
	import '$lib/styles/styleguide.css';
	import '$lib/styles/portfolio.css';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="site-shell">
	<Navbar brand={data.firstName.toLowerCase()} />

	{@render children()}
</div>
