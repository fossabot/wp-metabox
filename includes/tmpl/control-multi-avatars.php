<# if ( data.label ) { #>
	<span class="ninecodes-metabox-label">{{ data.label }}</span>
<# } #>

<# if ( data.description ) { #>
	<span class="ninecodes-metabox-description">{{{ data.description }}}</span>
<# } #>

<div class="ninecodes-metabox-multi-avatars-wrap">
	<# _.each( data.choices, function( user ) { #>
		<label>
			<input type="checkbox" value="{{ user.id }}" name="{{ data.field_name }}[]" <# if ( -1 !== _.indexOf( data.value, user.id ) ) { #> checked="checked" <# } #> />
			<span class="screen-reader-text">{{ user.name }}</span>
			{{{ user.avatar }}}
		</label>
	<# } ) #>
</div><!-- .ninecodes-metabox-multi-avatars-wrap -->
