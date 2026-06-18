<script>
	import { onDestroy } from 'svelte';
	import SocialLinks from '$lib/components/molecules/SocialLinks.svelte';

	const PORTRAIT_VIDEO = {
		light: '/portrait-easter-egg-light.mp4',
		dark: '/portrait-easter-egg-dark.mp4'
	};

	let { displayName, roleHtml, year, socials, meta } = $props();

	let showingVideo = $state(false);
	/** @type {HTMLVideoElement | undefined} */
	let videoEl;
	let clickCount = 0;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let clickResetTimer;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let videoStopTimer;

	function portraitVideoSrc() {
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? PORTRAIT_VIDEO.dark
			: PORTRAIT_VIDEO.light;
	}

	function stopVideo() {
		if (videoStopTimer) clearTimeout(videoStopTimer);
		videoStopTimer = undefined;
		showingVideo = false;

		if (videoEl) {
			videoEl.pause();
			videoEl.currentTime = 0;
		}
	}

	async function playPortraitVideo() {
		if (!videoEl || showingVideo) return;

		videoEl.src = portraitVideoSrc();
		videoEl.load();
		showingVideo = true;
		videoEl.currentTime = 0;

		try {
			await videoEl.play();
		} catch {
			stopVideo();
			return;
		}

		videoStopTimer = setTimeout(stopVideo, 5000);
	}

	function handlePortraitClick() {
		if (showingVideo) return;

		clickCount += 1;
		clearTimeout(clickResetTimer);
		clickResetTimer = setTimeout(() => {
			clickCount = 0;
		}, 700);

		if (clickCount >= 3) {
			clickCount = 0;
			clearTimeout(clickResetTimer);
			playPortraitVideo();
		}
	}

	onDestroy(() => {
		clearTimeout(clickResetTimer);
		clearTimeout(videoStopTimer);
	});
</script>

<section class="hero" id="top">
	<h1 class="masthead">
		<span class="line"><span>{displayName}</span></span>
	</h1>

	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
	<figure class="portrait" class:is-playing={showingVideo} onclick={handlePortraitClick}>
		<img src="/portrait.png" alt={displayName} />
		<video bind:this={videoEl} muted playsinline preload="metadata" aria-hidden="true"></video>
	</figure>

	<section class="lede">
		{#if roleHtml}
			<p class="role">{@html roleHtml}</p>
		{/if}
		<SocialLinks links={socials} />
	</section>

	<aside class="meta">
		{#each meta as item}
			<span>{item}</span>
		{/each}
	</aside>
</section>
