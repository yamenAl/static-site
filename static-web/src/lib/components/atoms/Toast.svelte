<script>
	let { message = '// message sent' } = $props();
</script>

<div class="toast" role="status" aria-live="polite">
	{message}
</div>
