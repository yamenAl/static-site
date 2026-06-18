<script>
	import { onMount } from 'svelte';
	import SectionLabel from '$lib/components/atoms/SectionLabel.svelte';
	import FormField from '$lib/components/atoms/FormField.svelte';
	import SubmitButton from '$lib/components/atoms/SubmitButton.svelte';
	import Toast from '$lib/components/atoms/Toast.svelte';
	import { submitContactMessage } from '$lib/submitContact.js';

	const formAction = '/.netlify/functions/contact';

	let note = $state('');
	let noteColor = $state('var(--error, #b00020)');
	let toastMessage = $state('');
	let toastKey = $state(0);
	let name = $state('');
	let email = $state('');
	let message = $state('');
	let sending = $state(false);

	function setNote(color, text) {
		noteColor = color;
		note = text;
	}

	function showToast(text = '// message sent') {
		toastMessage = text;
		toastKey += 1;
	}

	function hideToast() {
		toastMessage = '';
	}

	onMount(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get('sent') === '1') {
			showToast('// message sent');
			history.replaceState({}, '', `${window.location.pathname}#contact`);
		}
	});

	async function handleSubmit(event) {
		event.preventDefault();

		const trimmedName = name.trim();
		const trimmedEmail = email.trim();
		const trimmedMessage = message.trim();
		const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

		if (!trimmedName || !ok || !trimmedMessage) {
			setNote(
				'var(--error, #b00020)',
				!trimmedName
					? '// add your name'
					: !ok
						? '// valid email please'
						: '// write a short note'
			);
			return;
		}

		sending = true;
		note = '';
		setNote('var(--grey)', '// sending…');

		try {
			await submitContactMessage({
				name: trimmedName,
				email: trimmedEmail,
				message: trimmedMessage
			});

			note = '';
			showToast(`// thanks ${trimmedName}, message sent`);
			name = '';
			email = '';
			message = '';
		} catch (error) {
			const detail = error instanceof Error ? error.message : 'Unknown error';
			setNote('var(--error, #b00020)', `// could not send — ${detail}`);
			console.error('Contact form error:', error);
		} finally {
			sending = false;
		}
	}
</script>

<section class="sec contact" id="contact">
	<SectionLabel text="Contact" />
	<p class="big">Let's make something<br /><em>worth using.</em></p>
	<form action={formAction} method="POST" novalidate onsubmit={handleSubmit}>
		<FormField
			label="Name"
			id="name"
			name="name"
			autocomplete="name"
			required
			bind:value={name}
			disabled={sending}
		/>
		<FormField
			label="Email"
			id="email"
			name="email"
			type="email"
			autocomplete="email"
			required
			bind:value={email}
			disabled={sending}
		/>
		<FormField
			label="Message"
			id="message"
			name="message"
			multiline
			required
			bind:value={message}
			disabled={sending}
		/>
		<SubmitButton disabled={sending} label={sending ? 'Sending…' : 'Send it'} />
		{#if note}
			<p class="note" role="status" aria-live="polite" style:color={noteColor}>{note}</p>
		{/if}
	</form>
</section>

{#key toastKey}
	{#if toastMessage}
		<Toast message={toastMessage} onanimationend={hideToast} />
	{/if}
{/key}
