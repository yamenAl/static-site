<script>
	let {
		label,
		id,
		name,
		type = 'text',
		value = $bindable(''),
		autocomplete = '',
		multiline = false,
		disabled = false,
		required = false
	} = $props();
</script>

<label class="field" for={id}>
	<span class="field-label">{label}</span>
	{#if multiline}
		<textarea {id} {name} rows="2" bind:value {disabled} {required}></textarea>
	{:else}
		<input {id} {name} {type} {autocomplete} bind:value {disabled} {required} />
	{/if}
</label>
