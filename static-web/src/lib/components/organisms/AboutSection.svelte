<script>
	import SectionLabel from '$lib/components/atoms/SectionLabel.svelte';
	import FactList from '$lib/components/molecules/FactList.svelte';

	let { about, facts } = $props();
</script>

<section class="sec" id="about">
	<SectionLabel text="About" />
	<section class="about">
		{#if about || facts.length}
			<article>
				{#if about}
					<p>{about}</p>
				{/if}
			</article>
			{#if facts.length}
				<FactList {facts} />
			{/if}
		{/if}
	</section>
</section>
