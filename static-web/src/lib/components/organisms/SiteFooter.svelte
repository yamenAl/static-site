<script>
	let { year, displayName, firstName } = $props();
</script>

<footer>
	<span>© {year} {displayName}</span>
	<span>hello@{firstName.toLowerCase()}.com</span>
</footer>
