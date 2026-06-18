<script>
	import Brand from '$lib/components/atoms/Brand.svelte';
	import NavMenu from '$lib/components/molecules/NavMenu.svelte';
	import IconMenu from '$lib/components/icons/IconMenu.svelte';

	let { brand = 'yamen' } = $props();
</script>

<header class="topbar">
	<Brand label={brand} />

	<input type="checkbox" id="nav-toggle" class="nav-toggle" aria-hidden="true" tabindex="-1" />

	<label for="nav-toggle" class="burger">
		<IconMenu />
		<span class="sr-only">Toggle menu</span>
	</label>

	<NavMenu />
</header>
