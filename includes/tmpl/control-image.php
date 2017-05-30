<# if ( data.label ) { #>
	<span class="ninecodes-metabox-label">{{ data.label }}</span>
<# } #>

<# if ( data.description ) { #>
	<span class="ninecodes-metabox-description">{{{ data.description }}}</span>
<# } #>

<input type="hidden" class="ninecodes-metabox-attachment-id" name="{{ data.field_name }}" value="{{ data.value }}" />

<# if ( data.src ) { #>
	<img class="ninecodes-metabox-img" src="{{ data.src }}" alt="{{ data.alt }}" />
<# } else { #>
	<div class="ninecodes-metabox-placeholder">{{ data.l10n.placeholder }}</div>
<# } #>

<p>
	<# if ( data.src ) { #>
		<button type="button" class="button button-secondary ninecodes-metabox-change-media">{{ data.l10n.change }}</button>
		<button type="button" class="button button-secondary ninecodes-metabox-remove-media">{{ data.l10n.remove }}</button>
	<# } else { #>
		<button type="button" class="button button-secondary ninecodes-metabox-add-media">{{ data.l10n.upload }}</button>
	<# } #>
</p>
