<script>
	import TickerTrack from '$lib/components/molecules/TickerTrack.svelte';

	let { items } = $props();

	const duration = $derived(Math.max(45, items.length * 5.5));
</script>

<aside class="ticker" aria-label="Selected work" style="--ticker-duration: {duration}s">
	<TickerTrack items={[...items, ...items]} />
</aside>
