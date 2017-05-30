<# if ( data.label ) { #>
	<span class="ninecodes-metabox-label">{{ data.label }}</span>
<# } #>

<# if ( data.description ) { #>
	<span class="ninecodes-metabox-description">{{{ data.description }}}</span>
<# } #>

<# _.each( data.choices, function( palette, choice ) { #>
	<label aria-selected="{{ palette.selected }}">
		<input type="radio" value="{{ choice }}" name="{{ data.field_name }}" <# if ( palette.selected ) { #> checked="checked" <# } #> />

		<span class="ninecodes-metabox-palette-label">{{ palette.label }}</span>

		<div class="ninecodes-metabox-palette-block">

			<# _.each( palette.colors, function( color ) { #>
				<span class="ninecodes-metabox-palette-color" style="background-color: {{ color }}">&nbsp;</span>
			<# } ) #>

		</div>
	</label>
<# } ) #>
