<script>
	let { facts } = $props();
</script>

<dl class="facts">
	{#each facts as fact}
		<dt class="k">{fact.k}</dt>
		<dd class="v">{fact.v}</dd>
	{/each}
</dl>
