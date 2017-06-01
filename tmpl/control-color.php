<label>
	<# if ( data.label ) { #>
		<span class="ninecodes-metabox-label">{{ data.label }}</span>
	<# } #>

	<# if ( data.description ) { #>
		<span class="ninecodes-metabox-description">{{{ data.description }}}</span>
	<# } #>

	<input {{{ data.attr }}} value="<# if ( data.value ) { #>#{{ data.value }}<# } #>" />
</label>
