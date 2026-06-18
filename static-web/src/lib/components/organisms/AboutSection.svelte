<script>
	import SectionLabel from '$lib/components/atoms/SectionLabel.svelte';
	import FactList from '$lib/components/molecules/FactList.svelte';

	let { about, facts } = $props();
</script>

<section class="sec" id="about">
	<SectionLabel text="About" />
	<section class="about">
		<article>
			<p class="big">A decade turning <em>fuzzy problems</em> into clear, usable products.</p>
			<p>{about}</p>
		</article>
		<FactList {facts} />
	</section>
</section>
