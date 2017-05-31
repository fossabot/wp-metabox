(function (api) {

	'use strict';

	/**
	 * Adds the color palette view.
	 *
	 * @since  0.1.0
	 */
	api.metabox.registerControl('palette', {

		events: {
			'change input': 'onSelect'
		},

		// Executed when one of the color palette's value has changed.
		// These are radio inputs.
		onSelect: function () {

			// Get the value of the input.
			var value = document.querySelector('#' + this.el.id + ' input:checked').getAttribute('value'),
				choices = this.model.get('choices');

			// Loop through choices and change the selected value.
			_.each(choices, function (choice, key) {
				choice.selected = key === value;
			});

			// Because `choices` is an array, it's not recognized as a change.  So, we
			// have to manually trigger a change here so that the view gets re-rendered.
			this.model.set('choices', choices).trigger('change', this.model);
		}
	});
})(nineCodesMetabox);
