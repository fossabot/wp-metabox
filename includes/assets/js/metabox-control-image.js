(function ( api ) {

	'use strict';

	/**
	 * Adds the image control view.
	 *
	 * @since  0.1.0
	 */
	api.metabox.registerControl('image', {

		// Adds custom events.
		events: {
			'click .ninecodes-metabox-add-media': 'showModal',
			'click .ninecodes-metabox-change-media': 'showModal',
			'click .ninecodes-metabox-remove-media': 'removeMedia'
		},

		// Executed when the show modal button is clicked.
		showModal: function () {

			// If we already have a media modal, open it.
			if (!_.isUndefined(this.wpMediaModal)) {

				this.wpMediaModal.open();
				return;
			}

			// Create a new media modal.
			this.wpMediaModal = wp.media({
				frame: 'select',
				multiple: false,
				editing: true,
				title: this.model.get('l10n').choose,
				library: {
					type: 'image'
				},
				button: {
					text: this.model.get('l10n').set
				}
			});

			// Runs when an image is selected in the media modal.
			this.wpMediaModal.on('select', function () {

				// Gets the JSON data for the first selection.
				var media = this.wpMediaModal.state().get('selection').first().toJSON(),
					size = this.model.attributes.size; // Size of image to display.

				// Updates the model for the view.
				this.model.set({
					src: media.sizes[size] ? media.sizes[size]['url'] : media.url,
					alt: media.alt,
					value: media.id
				});
			}, this);

			this.wpMediaModal.open(); // Opens the media modal.
		},

		// Executed when the remove media button is clicked.
		removeMedia: function () {

			// Updates the model for the view.
			this.model.set({
				src: '',
				alt: '',
				value: ''
			});
		}
	});

})( nineCodesMetabox );