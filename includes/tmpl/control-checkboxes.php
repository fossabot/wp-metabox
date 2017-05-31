<# if ( data.label ) { #>
	<span class="ninecodes-metabox-label">{{ data.label }}</span>
<# } #>

<# if ( data.description ) { #>
	<span class="ninecodes-metabox-description">{{{ data.description }}}</span>
<# } #>

<ul class="ninecodes-metabox-checkbox-list">

	<# _.each( data.choices, function( label, choice ) { #>

		<li>
			<label>
				<input type="checkbox" value="{{ choice }}" name="{{ data.field_name }}[]" <# if ( -1 !== _.indexOf( data.value, choice ) ) { #> checked="checked" <# } #> />
				{{ label }}
			</label>
		</li>

	<# } ) #>

</ul>