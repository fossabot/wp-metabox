(function( api, $ ){

	'use strict';

	/**
	 * Adds the color control view.
	 *
	 * @since  0.1.0
	 */
	api.metabox.registerControl( 'color', {

		// Calls the core WP color picker for the control's input.
		ready : function() {

			var options = this.model.attributes.options;

			$( this.$el ).find( '.ninecodes-metabox-color-picker' ).wpColorPicker( options );
		}
	} );

})( nineCodesMetabox, jQuery );
