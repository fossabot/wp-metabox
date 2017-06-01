<label>
	<# if ( data.label ) { #>
		<span class="ninecodes-metabox-label">{{ data.label }}</span>
	<# } #>

	<# if ( data.description ) { #>
		<span class="ninecodes-metabox-description">{{{ data.description }}}</span>
	<# } #>

	<input type="{{ data.type }}" value="{{ data.value }}" {{{ data.attr }}} />
</label>
