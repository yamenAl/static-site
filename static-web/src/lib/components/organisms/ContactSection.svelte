<script>
	import SectionLabel from '$lib/components/atoms/SectionLabel.svelte';
	import FormField from '$lib/components/atoms/FormField.svelte';
	import SubmitButton from '$lib/components/atoms/SubmitButton.svelte';

	let note = $state('');
	let noteColor = $state('#2a7d4f');
	let name = $state('');
	let email = $state('');
	let message = $state('');

	function handleSubmit(event) {
		event.preventDefault();
		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		const trimmedMessage = message.trim();
		const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

		if (!trimmedName || !ok || !trimmedMessage) {
			noteColor = '#b00020';
			note = !trimmedName
				? '// add your name'
				: !ok
					? '// valid email please'
					: '// write a short note';
			return;
		}

		noteColor = '#2a7d4f';
		note = `// thanks ${trimmedName}, message ready to send`;
		name = '';
		email = '';
		message = '';
	}
</script>

<section class="sec contact" id="contact">
	<SectionLabel text="Contact" />
	<p class="big">Let's make something<br /><em>worth using.</em></p>
	<form novalidate onsubmit={handleSubmit}>
		<FormField label="Name" id="name" name="name" autocomplete="name" bind:value={name} />
		<FormField label="Email" id="email" name="email" type="email" autocomplete="email" bind:value={email} />
		<FormField label="Message" id="message" name="message" multiline bind:value={message} />
		<SubmitButton />
		{#if note}
			<p class="note" role="status" aria-live="polite" style:color={noteColor}>{note}</p>
		{/if}
	</form>
</section>
