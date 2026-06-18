<script>
	let {
		label,
		id,
		name,
		type = 'text',
		value = $bindable(''),
		autocomplete = '',
		multiline = false
	} = $props();
</script>

<label class="field" for={id}>
	<span class="field-label">{label}</span>
	{#if multiline}
		<textarea {id} {name} rows="2" bind:value></textarea>
	{:else}
		<input {id} {name} {type} {autocomplete} bind:value />
	{/if}
</label>
