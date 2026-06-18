<script>
	import IconArrow from '$lib/components/icons/IconArrow.svelte';

	let { num, name, em = '', tags, year, href = '' } = $props();
</script>

<svelte:element
	this={href ? 'a' : 'article'}
	class="proj"
	{...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
>
	<span class="num">{num}</span>
	<h3 class="name">
		{name}
		{#if em}
			<em> {em}</em>
		{/if}
		<IconArrow />
	</h3>
	<p class="tags">
		{#if tags}{tags}<br />{/if}{year}
	</p>
</svelte:element>
