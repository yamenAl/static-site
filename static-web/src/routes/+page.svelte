<script>
	import HeroSection from '$lib/components/organisms/HeroSection.svelte';
	import TickerBar from '$lib/components/organisms/TickerBar.svelte';
	import WorkSection from '$lib/components/organisms/WorkSection.svelte';
	import AboutSection from '$lib/components/organisms/AboutSection.svelte';
	import ContactSection from '$lib/components/organisms/ContactSection.svelte';
	import SiteFooter from '$lib/components/organisms/SiteFooter.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.displayName} — Senior Product Designer</title>
</svelte:head>

<main>
	<HeroSection
		firstName={data.firstName}
		lastName={data.lastName}
		displayName={data.displayName}
		roleHtml={data.roleHtml}
		year={data.year}
		socials={data.socials}
		meta={data.meta}
	/>
	<TickerBar items={data.tickerItems} />
	<WorkSection projects={data.projects} />
	<AboutSection about={data.about} facts={data.facts} />
	<ContactSection />
</main>

<SiteFooter
	year={data.year}
	displayName={data.displayName}
	firstName={data.firstName}
/>
