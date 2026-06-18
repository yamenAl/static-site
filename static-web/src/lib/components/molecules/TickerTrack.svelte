<script>
	import IconStar from '$lib/components/icons/IconStar.svelte';

	let { items } = $props();
</script>

<ul class="track">
	{#each items as item}
		<li>
			<span>{item}</span>
			<IconStar />
		</li>
	{/each}
</ul>
