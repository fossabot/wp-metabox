<label>
	<input type="checkbox" value="true" {{{ data.attr }}} <# if ( data.value ) { #> checked="checked" <# } #> />

	<# if ( data.label ) { #>
		<span class="ninecodes-metabox-label">{{ data.label }}</span>
	<# } #>

	<# if ( data.description ) { #>
		<span class="ninecodes-metabox-description">{{{ data.description }}}</span>
	<# } #>
</label>
