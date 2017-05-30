<label>
	<# if ( data.label ) { #>
		<span class="ninecodes-metabox-label">{{ data.label }}</span>
	<# } #>

	<select name="{{ data.field_name }}" id="{{ data.field_name }}">

		<# _.each( data.choices, function( choice ) { #>
			<option value="{{ choice.value }}" <# if ( choice.value === data.value ) { #> selected="selected" <# } #>>{{ choice.label }}</option>
		<# } ) #>

	</select>

	<# if ( data.description ) { #>
		<span class="ninecodes-metabox-description">{{{ data.description }}}</span>
	<# } #>
</label>
