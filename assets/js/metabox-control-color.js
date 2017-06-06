(function (api) {

	'use strict';

	/**
	 * Adds the color control view.
	 *
	 * @since  0.1.0
	 */
	api.registerControl('color', {
		ready: function () {
			this.$el.find('.ninecodes-metabox-color-picker')
			.wpColorPicker(this.model.attributes.options);
		}
	});

})(ninecodes.metabox);
