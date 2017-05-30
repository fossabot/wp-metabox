/* no-unused-vars: ["error", { "vars": "local", "varsIgnorePattern": "^nineCodesMetabox" }] */

window.nineCodesMetabox = window.nineCodesMetabox || {};

( function( $ ) {

	'use strict';

	// Bail if we don't have the JSON, which is passed in via `wp_localize_script()`.
	if ( _.isUndefined( nineCodesMetaboxData ) ) {
		return;
	}

	/**
	 * Our global object. The `nineCodesMetabox` object is just a wrapper to house everything
	 * in a single namespace.
	 *
	 * @since 0.1.0
	 * @var {Object}
	 */
	var api = nineCodesMetabox = {

			/**
			 * Houses the manager, section, and control views based on the `type`.
			 *
			 * @since 0.1.0
			 * @var {Object}
			 */
			metabox: {
				manager: {},
				section: {},
				control: {},
				nav: {},
			},

			/**
			 * Houses the manager, section, and control templates based on the `type`.
			 *
			 * @since  0.1.0
			 * @var {Object}
			 */
			template : {
				manager: {},
				section: {},
				control: {},
				nav: wp.template( 'ninecodes-metabox-nav' ),
			}
		},

		Manager = {
			Model: Backbone.Model.extend( {
				defaults : {
					name : '',
					type : '',
					sections : {},
					controls : {}
				}
			} )
		},

		Section = {
			Model: Backbone.Model.extend( {
				defaults : {
					name : '',
					type : '',
					label : '',
					description : '',
					icon : '',
					manager : '',
					active : '',
					selected : false
				}
			} ),
			Collection: Backbone.Collection.extend( {} )
		},

		Control = {
			Model: Backbone.Model.extend( {
				defaults : {
					name : '',
					type : '',
					label : '',
					description : '',
					icon : '',
					value : '',
					choices : {},
					attr : '',
					active : '',
					manager : '',
					section : '',
					setting : ''
				}
			} ),
		},

		Nav = {
			View: {}
		};

	/**
	 * Creates a new Manager view
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @param {Object} args Manager arguments.
	 * @return {Void} Returns nothing.
	 */
	api.metabox.registerManager = function( type, args ) {

		if ( 'default' !== type ) {
			this.manager[ type ] = this.manager.default.extend( args );
		}
	};

	/**
	 * Returns a Manager view
	 *

	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Object} The Manager instance.
	 */
	api.metabox.getManager = function( type ) {

		if ( this.managerExists( type ) ) {
			return this.manager[ type ];
		}

		return this.manager.default;
	};

	/**
	 * Removes a manager view.
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Void} Returns nothing.
	 */
	api.metabox.unregisterManager = function( type ) {

		if ( 'default' !== type && this.managerExists( type ) ) {
			delete this.manager[ type ];
		}
	};

	/**
	 * Checks if a Manager view exists
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Boolean} Returns `true` if the Manager of the given type exists.
	 */
	api.metabox.managerExists = function( type ) {

		return this.manager.hasOwnProperty( type );
	};

	/**
	 * Creates a new Section view
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type The new Section type to register.
	 * @param {Object} args The Section arguments.
	 * @return {Void} Returns nothing.
	 */
	api.metabox.registerSection = function( type, args ) {

		if ( 'default' !== type ) {
			this.section[ type ] = this.section.default.extend( args );
		}
	};

	/**
	 * Returns a Section view
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Section type.
	 * @return {Object} Section instance.
	 */
	api.metabox.getSection = function( type ) {

		if ( this.sectionExists( type ) ) {
			return this.section[ type ];
		}

		return this.section.default;
	};

	/**
	 * Removes a Section view
	 *
	 * @since  0.1.0
	 *
	 * @param {String} type Section type.
	 * @return {Void} Returns nothing.
	 */
	api.metabox.unregisterSection = function( type ) {

		if ( 'default' !== type && this.sectionExists( type ) ) {
			delete this.section[ type ];
		}
	};

	/**
	 * Checks if a Section view exists
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Section type.
	 * @return {Boolean} Returns `true` if the Section exists.
	 */
	api.metabox.sectionExists = function( type ) {
		return this.section.hasOwnProperty( type );
	};

	/**
	 * Creates a new Control view
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type A new Control type to register.
	 * @param {Object} args Control arguments.
	 * @return {Void} Returns nothing.
	 */
	api.metabox.registerControl = function( type, args ) {

		if ( 'default' !== type ) {
			this.control[ type ] = this.control.default.extend( args );
		}
	};

	/**
	 * Returns a Control view
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Object} Control instance.
	 */
	api.metabox.getControl = function( type ) {

		if ( this.controlExists( type ) ) {
			return this.control[ type ];
		}

		return this.control.default;
	};

	/**
	 * Removes a Control view
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Void} Returns nothing.
	 */
	api.metabox.unregisterControl = function( type ) {

		if ( 'default' !== type && this.controlExists( type ) ) {
			delete this.control[ type ];
		}
	};

	/**
	 * Checks if a Control view exists
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Boolean} Returns `true` if the Control of the given type exists.
	 */
	api.metabox.controlExists = function( type ) {

		return this.control.hasOwnProperty( type );
	};

	/**
	 * Creates a new Manager template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Void} Returns nothing.
	 */
	api.template.registerManager = function( type ) {

		this.manager[ type ] = wp.template( 'ninecodes-metabox-manager-' + type );
	};

	/**
	 * Returns a Manager template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Function} A function that lazily-compiles the template requested.
	 */
	api.template.getManager = function( type ) {

		return this.managerExists( type ) ? this.manager[ type ] : false;
	};

	/**
	 * Removes a manager template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Void} Returns nothing.
	 */
	api.template.unregisterManager = function( type ) {

		if ( this.managerExists( type ) ) {
			delete this.manager[ type ];
		}
	};

	/**
	 * Checks if a Manager template exists
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Boolean} Returns true if the Manager template of the given type exists.
	 */
	api.template.managerExists = function( type ) {

		return this.manager.hasOwnProperty( type );
	};

	/**
	 * Creates a new Section template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Section type.
	 * @return {Void} Returns nothing.
	 */
	api.template.registerSection = function( type ) {

		this.section[ type ] = wp.template( 'ninecodes-metabox-section-' + type );
	};

	/**
	 * Returns a Section template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Function} A function that lazily-compiles the template requested.
	 */
	api.template.getSection = function( type ) {

		return this.sectionExists( type ) ? this.section[ type ] : false;
	};

	/**
	 * Removes a Section template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Section type
	 * @return {Void} Returns nothing.
	 */
	api.template.unregisterSection = function( type ) {

		if ( this.sectionExists( type ) ) {
			delete this.section[ type ];
		}
	};

	/**
	 * Checks if a Section template exists
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Section type.
	 * @return {Boolean} Returns `true` if the Section template of the given type exists.
	 */
	api.template.sectionExists = function( type ) {

		return this.section.hasOwnProperty( type );
	};

	/**
	 * Creates a new Control template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Void} Returns nothing.
	 */
	api.template.registerControl = function( type ) {

		this.control[ type ] = wp.template( 'ninecodes-metabox-control-' + type );
	};

	/**
	 * Returns a Control template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Function} A function that lazily-compiles the template requested.
	 */
	api.template.getControl = function( type ) {

		return this.controlExists( type ) ? this.control[ type ] : false;
	};

	/**
	 * Removes a control template.
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Void} Returns nothing.
	 */
	api.template.unregisterControl = function( type ) {

		if ( this.controlExists( type ) ) {
			delete this.control[ type ];
		}
	};

	/**
	 * Checks if a Control template exists.
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Boolean} Returns `true` if the Control template of the given type exists.
	 */
	api.template.controlExists = function( type ) {

		return this.control.hasOwnProperty( type );
	};

	/**
	 * Renders our Managers, Sections, and Controls
	 *
	 * @since 0.1.0
	 *
	 * @return {Void} Returns nothing.
	 */
	api.render = function() {

		_.each( nineCodesMetaboxData.managers, function( data ) {

			var ManagerModel = new Manager.Model( data ), // Create a new Manager model with the JSON data for the manager.

				Callback = api.metabox.getManager( data.type ), // Get the Manager View callback.

				View = new Callback( { // Create a new Manager View.
					model : ManagerModel
				} ),

				metabox = document.getElementById( 'ninecodes-metabox-ui-' + ManagerModel.get( 'name' ) ); // Get the meta box element.

			// Add the `.ninecodes-metabox-ui` class to the meta box.
			metabox.className += ' ninecodes-metabox-ui';

			// Render the manager View.
			metabox.querySelector( '.inside' ).appendChild( View.render().el );

			// Render the manager subviews.
			View.subViewRender();

			// Call the View's ready method.
			View.ready();
		} );
	};

	/**
	 * The nav item view for each section.
	 *
	 * @since 0.1.0
	 * @var {Backbone}
	 */
	Nav.View = Backbone.View.extend( {

		// Sets the template used.
		template : api.template.nav,

		// Wrapper element for the nav item.
		tagName : 'li',

		// Custom events.
		events : {
			'click a' : 'onSelect'
		},

		// Sets some custom attributes for the nav item wrapper.
		attributes : function() {
			return {
				'aria-selected' : this.model.get( 'selected' )
			};
		},

		// Initializes the nav item view.
		initialize : function() {

			this.model.on( 'change', this.render, this );
			this.model.on( 'change', this.onChange, this );
		},

		// Renders the nav item.
		render : function() {

			// Only render template if model is active.
			if ( this.model.get( 'active' ) ) {
				this.el.innerHTML = this.template( this.model.toJSON() );
			}

			return this;
		},

		// Executed when the section model changes.
		onChange : function() {

			// Set the `aria-selected` attibute based on the model selected state.
			this.el.setAttribute( 'aria-selected', this.model.get( 'selected' ) );
		},

		// Executed when the link for the nav item is clicked.
		onSelect : function( event ) {
			event.preventDefault();

			// Loop through each of the models in the collection and set them to inactive.
			_.each( this.model.collection.models, function( m ) {
				m.set( 'selected', false );
			}, this );

			// Set this view's model to selected.
			this.model.set( 'selected', true );
		}
	} );

	/**
	 * The default manager view.  Other views can extend this using the
	 * `nineCodesMetabox.views.registerManager()` function.
	 *
	 * @since  0.1.0
	 * @var    object
	 */
	api.metabox.manager[ 'default' ] = Backbone.View.extend( {

		// Wrapper element for the manager view.
		tagName : 'div',

		// Adds some custom attributes to the wrapper.
		attributes : function() {
			return {
				'id'    : 'ninecodes-metabox-manager-' + this.model.get( 'name' ),
				'class' : 'ninecodes-metabox-manager ninecodes-metabox-manager-' + this.model.get( 'type' )
			};
		},

		// Initializes the view.
		initialize : function() {

			var type = this.model.get( 'type' );

			// If there's not yet a template for this manager type, create it.
			if ( ! api.template.managerExists( type ) ) {
				api.template.registerManager( type );
			}

			// Get the manager template.
			this.template = api.template.getManager( type );
		},

		// Renders the manager.
		render : function() {
			this.el.innerHTML = this.template( this.model.toJSON() );
			return this;
		},

		// Renders the manager's sections and controls.
		// Important! This may change drastically in the future, possibly even
		// taken out of the manager view altogether.  It's for this reason that
		// it's not recommended to create custom views for managers right now.
		subViewRender : function() {

			// Create a new section collection.
			var Sections = new Section.Collection();

			// Loop through each section and add it to the collection.
			_.each( this.model.get( 'sections' ), function( data ) {
				Sections.add( new Section.Model( data ) );
			} );

			// Loop through each section in the collection and render its view.
			Sections.forEach( function( section, i ) {

				var NavView = new Nav.View( { // Create a new nav item view for the section.
						model : section
					} ),

					Callback = api.metabox.getSection( section.attributes.type ), // Get the section view callback.

					SectionView = new Callback( { // Create a new section view.
						model : section
					} );

				// Render the nav item view.
				document.querySelector( '#ninecodes-metabox-ui-' + section.get( 'manager' ) + ' .ninecodes-metabox-nav' )
						.appendChild( NavView.render().el );

				// Render the Section view.
				document.querySelector( '#ninecodes-metabox-ui-' + section.get( 'manager' ) + ' .ninecodes-metabox-content' )
						.appendChild( SectionView.render().el );

				SectionView.ready(); // Call the Section view's ready method.
				section.set( 'selected', 0 === i ); // If the first model, set it to selected.
			}, this );

			// Loop through each control for the manager and render its view.
			_.each( this.model.get( 'controls' ), function( data ) {

				// Create a new control model.
				var control = new Control.Model( data ),

					// Get the control view callback.
					Callback = api.metabox.getControl( data.type ),

					 // Create a new control view.
					View = new Callback( {
						model : control
					} );

				// Render the view.
				document.getElementById( 'ninecodes-metabox-' + control.get( 'manager' ) + '-section-' + control.get( 'section' ) )	.appendChild( View.render().el );

				// Call the View's ready method.
				View.ready();
			} );

			return this;
		},

		// Function that is executed *after* the view has been rendered.
		// This is meant to be overwritten in sub-views.
		ready : function() {}
	} );

	/**
	 * The default section view.  Other views can extend this using the
	 * `nineCodesMetabox.views.registerSection()` function.
	 *
	 * @since  0.1.0
	 * @var    object
	 */
	api.metabox.section[ 'default' ] = Backbone.View.extend( {

		tagName : 'div',

		model : new Section.Model(),

		attributes : function() {
			return {
				'id' : 'ninecodes-metabox-' + this.model.get( 'manager' ) + '-section-' + this.model.get( 'name' ),
				'class' : 'ninecodes-metabox-section ninecodes-metabox-section-' + this.model.get( 'type' ),
				'aria-hidden' : ! this.model.get( 'selected' )
			};
		},

		initialize : function() {

			// Add an event for when the model changes.
			this.model.on( 'change', this.onChange, this );

			// Get the section type.
			var type = this.model.get( 'type' );

			// If there's no template for this section type, create it.
			if ( ! api.template.sectionExists( type ) ) {
				api.template.registerSection( type );
			}

			// Gets the section template.
			this.template = api.template.getSection( type );
		},

		// Renders the section.
		render : function() {

			// Only render template if model is active.
			if ( this.model.get( 'active' ) ) {
				this.el.innerHTML = this.template( this.model.toJSON() );
			}

			return this;
		},

		// Executed when the model changes.
		onChange : function() {

			// Set the view's `aria-hidden` attribute based on whether the model is selected.
			this.el.setAttribute( 'aria-hidden', ! this.model.get( 'selected' ) );
		},

		// Function that is executed *after* the view has been rendered.
		// This is meant to be overwritten in sub-views.
		ready : function() {}
	} );

	/**
	 * The default control view.  Other views can extend this using the
	 * `nineCodesMetabox.View.registerControl()` function.
	 *
	 * @since  0.1.0
	 * @var    object
	 */
	api.metabox.control[ 'default' ] = Backbone.View.extend( {

		// Wrapper element for the control.
		tagName : 'div',

		// Custom attributes for the control wrapper.
		attributes : function() {
			return {
				'id'    : 'ninecodes-metabox-control-' + this.model.get( 'name' ),
				'class' : 'ninecodes-metabox-control ninecodes-metabox-control-' + this.model.get( 'type' )
			};
		},

		// Initiazlies the control view.
		initialize : function() {
			var type = this.model.get( 'type' );

			// Only add a new control template if we have a different control type.
			if ( ! api.template.controlExists( type ) ) {
				api.template.registerControl( type );
			}

			// Get the control template.
			this.template = api.template.getControl( type );

			// Bind changes so that the view is re-rendered when the model changes.
			_.bindAll( this, 'render' );
			this.model.bind( 'change', this.render );
		},

		// Renders the control template.
		render : function() {

			// Only render template if model is active.
			if ( this.model.get( 'active' ) ) {
				this.el.innerHTML = this.template( this.model.toJSON() );
			}

			return this;
		},

		// Function that is executed *after* the view has been rendered. This is meant to be overwritten in sub-views.
		ready : function() {}
	} );

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

	/**
	 * Adds the color palette view.
	 *
	 * @since  0.1.0
	 */
	api.metabox.registerControl( 'palette', {

		events : {
			'change input' : 'onSelect'
		},

		// Executed when one of the color palette's value has changed.
		// These are radio inputs.
		onSelect : function() {

			// Get the value of the input.
			var value = document.querySelector( '#' + this.el.id + ' input:checked' ).getAttribute( 'value' ),
				choices = this.model.get( 'choices' );

			// Loop through choices and change the selected value.
			_.each( choices, function( choice, key ) {
				choice.selected = key === value;
			} );

			// Because `choices` is an array, it's not recognized as a change.  So, we
			// have to manually trigger a change here so that the view gets re-rendered.
			this.model.set( 'choices', choices ).trigger( 'change', this.model );
		}
	} );

	/**
	 * Adds the image control view.
	 *
	 * @since  0.1.0
	 */
	api.metabox.registerControl( 'image', {

		// Adds custom events.
		events : {
			'click .ninecodes-metabox-add-media' : 'showModal',
			'click .ninecodes-metabox-change-media' : 'showModal',
			'click .ninecodes-metabox-remove-media' : 'removeMedia'
		},

		// Executed when the show modal button is clicked.
		showModal : function() {

			// If we already have a media modal, open it.
			if ( ! _.isUndefined( this.wpMediaModal ) ) {

				this.wpMediaModal.open();
				return;
			}

			// Create a new media modal.
			this.wpMediaModal = wp.media( {
				frame  : 'select',
				multiple : false,
				editing : true,
				title : this.model.get( 'l10n' ).choose,
				library : { type : 'image' },
				button : { text: this.model.get( 'l10n' ).set }
			} );

			// Runs when an image is selected in the media modal.
			this.wpMediaModal.on( 'select', function() {

				// Gets the JSON data for the first selection.
				var media = this.wpMediaModal.state().get( 'selection' ).first().toJSON(),
					size = this.model.attributes.size; // Size of image to display.

				// Updates the model for the view.
				this.model.set( {
					src : media.sizes[ size ] ? media.sizes[ size ]['url'] : media.url,
					alt : media.alt,
					value : media.id
				} );
			}, this );

			this.wpMediaModal.open(); // Opens the media modal.
		},

		// Executed when the remove media button is clicked.
		removeMedia : function() {

			// Updates the model for the view.
			this.model.set( {
				src : '',
				alt : '',
				value : ''
			} );
		}
	} );

})( jQuery ) ;
