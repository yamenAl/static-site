<script>
	let { year, displayName, email = '' } = $props();
</script>

<footer>
	<span>© {year} {displayName}</span>
	{#if email}
		<a class="footer-email" href="mailto:{email}">
			<span class="footer-email-track">
				<span class="footer-email-label">Send email</span>
				<span class="footer-email-address">{email}</span>
			</span>
		</a>
	{/if}
</footer>
