<script>
	let { year, displayName, firstName, designedIn } = $props();
</script>

<footer>
	<span>© {year} {displayName}</span>
	<span>hello@{firstName.toLowerCase()}.com</span>
	<span>Designed in {designedIn}</span>
</footer>
