<script>
	import SocialLinks from '$lib/components/molecules/SocialLinks.svelte';

	let { firstName, lastName, displayName, roleHtml, year, socials, meta } = $props();
</script>

<section class="hero" id="top">
	<h1 class="masthead">
		<span class="line"><span>{displayName}</span></span>
	</h1>

	<figure class="portrait">
		<img src="/portrait.png" alt={displayName} />
	</figure>

	<section class="lede">
		<p class="role">{@html roleHtml}</p>
		<SocialLinks links={socials} />
	</section>

	<aside class="meta">
		{#each meta as item}
			<span>{item}</span>
		{/each}
	</aside>
</section>
