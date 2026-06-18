<script>
	import TickerTrack from '$lib/components/molecules/TickerTrack.svelte';

	let { items } = $props();
</script>

<aside class="ticker" aria-label="Recognition">
	<TickerTrack items={[...items, ...items]} />
</aside>
