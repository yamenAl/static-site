<script>
	import IconArrow from '$lib/components/icons/IconArrow.svelte';

	let { label = 'Send it', disabled = false } = $props();

	const showArrow = $derived(!disabled && !label.includes('…'));
</script>

<button class="btn send" type="submit" {disabled}>
	{label}
	{#if showArrow}
		<span class="btn-arrow" aria-hidden="true">
			<IconArrow />
		</span>
	{/if}
</button>
