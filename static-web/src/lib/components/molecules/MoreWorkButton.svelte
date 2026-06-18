<script>
	import IconArrow from '$lib/components/icons/IconArrow.svelte';

	let { forId } = $props();
</script>

<label class="btn" for={forId}>
	More work
	<span class="btn-arrow" aria-hidden="true">
		<IconArrow />
	</span>
</label>
