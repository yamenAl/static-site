<script>
	import SectionLabel from '$lib/components/atoms/SectionLabel.svelte';
	import ProjectItem from '$lib/components/molecules/ProjectItem.svelte';
	import MoreWorkButton from '$lib/components/molecules/MoreWorkButton.svelte';

	const PAGE_SIZE = 4;

	let { projects } = $props();

	/** @param {typeof projects} list @param {number} size */
	function chunkProjects(list, size) {
		/** @type {Array<Array<typeof list[number] & { num: string }>>} */
		const chunks = [];

		for (let i = 0; i < list.length; i += size) {
			chunks.push(
				list.slice(i, i + size).map((project, index) => ({
					...project,
					num: String(index + 1).padStart(2, '0')
				}))
			);
		}

		return chunks;
	}

	let chunks = $derived(chunkProjects(projects, PAGE_SIZE));
</script>

<section class="sec work" id="work">
	{#each chunks as _, pageIndex}
		<input
			type="radio"
			name="work-page"
			id="work-page-{pageIndex}"
			class="work-page-input"
			checked={pageIndex === 0}
		/>
	{/each}

	<SectionLabel text="Selected Work" />

	<div class="work-pages">
		{#each chunks as chunk, pageIndex}
			<div class="work-page">
				{#each chunk as project (project.id ?? project.name)}
					<ProjectItem {...project} />
				{/each}
			</div>
		{/each}
	</div>

	{#if chunks.length > 1}
		<div class="more">
			<nav class="work-nav" aria-label="More projects">
				{#each chunks as _, pageIndex}
					<MoreWorkButton forId="work-page-{(pageIndex + 1) % chunks.length}" />
				{/each}
			</nav>
		</div>
	{/if}
</section>
