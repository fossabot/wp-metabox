/* no-unused-vars: ["error", { "vars": "local", "varsIgnorePattern": "^nineCodesMetabox" }] */

window.nineCodesMetabox = window.nineCodesMetabox || {};

(function ($) {

	'use strict';

	// Bail if we don't have the JSON, which is passed in via `wp_localize_script()`.
	if (_.isUndefined(nineCodesMetaboxData)) {
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
			template: {
				manager: {},
				section: {},
				control: {},
				nav: wp.template('ninecodes-metabox-nav'),
			}
		},

		Manager = {
			Model: Backbone.Model.extend({
				defaults: {
					name: '',
					type: '',
					sections: {},
					controls: {}
				}
			})
		},

		Section = {
			Model: Backbone.Model.extend({
				defaults: {
					name: '',
					type: '',
					label: '',
					description: '',
					icon: '',
					manager: '',
					active: '',
					selected: false
				}
			}),
			Collection: Backbone.Collection.extend({})
		},

		Control = {
			Model: Backbone.Model.extend({
				defaults: {
					name: '',
					type: '',
					label: '',
					description: '',
					icon: '',
					value: '',
					choices: {},
					attr: '',
					active: '',
					manager: '',
					section: '',
					setting: ''
				}
			}),
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
	api.metabox.registerManager = function (type, args) {

		if ('default' !== type) {
			this.manager[type] = this.manager.default.extend(args);
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
	api.metabox.getManager = function (type) {

		if (this.managerExists(type)) {
			return this.manager[type];
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
	api.metabox.unregisterManager = function (type) {

		if ('default' !== type && this.managerExists(type)) {
			delete this.manager[type];
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
	api.metabox.managerExists = function (type) {

		return this.manager.hasOwnProperty(type);
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
	api.metabox.registerSection = function (type, args) {

		if ('default' !== type) {
			this.section[type] = this.section.default.extend(args);
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
	api.metabox.getSection = function (type) {

		if (this.sectionExists(type)) {
			return this.section[type];
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
	api.metabox.unregisterSection = function (type) {

		if ('default' !== type && this.sectionExists(type)) {
			delete this.section[type];
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
	api.metabox.sectionExists = function (type) {
		return this.section.hasOwnProperty(type);
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
	api.metabox.registerControl = function (type, args) {

		if ('default' !== type) {
			this.control[type] = this.control.default.extend(args);
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
	api.metabox.getControl = function (type) {

		if (this.controlExists(type)) {
			return this.control[type];
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
	api.metabox.unregisterControl = function (type) {

		if ('default' !== type && this.controlExists(type)) {
			delete this.control[type];
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
	api.metabox.controlExists = function (type) {

		return this.control.hasOwnProperty(type);
	};

	/**
	 * Creates a new Manager template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Void} Returns nothing.
	 */
	api.template.registerManager = function (type) {

		this.manager[type] = wp.template('ninecodes-metabox-manager-' + type);
	};

	/**
	 * Returns a Manager template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Function} A function that lazily-compiles the template requested.
	 */
	api.template.getManager = function (type) {

		return this.managerExists(type) ? this.manager[type] : false;
	};

	/**
	 * Removes a manager template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Void} Returns nothing.
	 */
	api.template.unregisterManager = function (type) {

		if (this.managerExists(type)) {
			delete this.manager[type];
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
	api.template.managerExists = function (type) {

		return this.manager.hasOwnProperty(type);
	};

	/**
	 * Creates a new Section template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Section type.
	 * @return {Void} Returns nothing.
	 */
	api.template.registerSection = function (type) {

		this.section[type] = wp.template('ninecodes-metabox-section-' + type);
	};

	/**
	 * Returns a Section template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Manager type.
	 * @return {Function} A function that lazily-compiles the template requested.
	 */
	api.template.getSection = function (type) {

		return this.sectionExists(type) ? this.section[type] : false;
	};

	/**
	 * Removes a Section template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Section type
	 * @return {Void} Returns nothing.
	 */
	api.template.unregisterSection = function (type) {

		if (this.sectionExists(type)) {
			delete this.section[type];
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
	api.template.sectionExists = function (type) {

		return this.section.hasOwnProperty(type);
	};

	/**
	 * Creates a new Control template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Void} Returns nothing.
	 */
	api.template.registerControl = function (type) {

		this.control[type] = wp.template('ninecodes-metabox-control-' + type);
	};

	/**
	 * Returns a Control template
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Function} A function that lazily-compiles the template requested.
	 */
	api.template.getControl = function (type) {

		return this.controlExists(type) ? this.control[type] : false;
	};

	/**
	 * Removes a control template.
	 *
	 * @since 0.1.0
	 *
	 * @param {String} type Control type.
	 * @return {Void} Returns nothing.
	 */
	api.template.unregisterControl = function (type) {

		if (this.controlExists(type)) {
			delete this.control[type];
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
	api.template.controlExists = function (type) {

		return this.control.hasOwnProperty(type);
	};

	/**
	 * Renders our Managers, Sections, and Controls
	 *
	 * @since 0.1.0
	 *
	 * @return {Void} Returns nothing.
	 */
	api.render = function () {

		_.each(nineCodesMetaboxData.managers, function (data) {

			var ManagerModel = new Manager.Model(data), // Create a new Manager model with the JSON data for the manager.

				Callback = api.metabox.getManager(data.type), // Get the Manager View callback.

				View = new Callback({ // Create a new Manager View.
					model: ManagerModel
				}),

				metabox = document.getElementById('ninecodes-metabox-ui-' + ManagerModel.get('name')); // Get the meta box element.

			// Add the `.ninecodes-metabox-ui` class to the meta box.
			metabox.className += ' ninecodes-metabox-ui';

			// Render the manager View.
			metabox.querySelector('.inside').appendChild(View.render().el);

			// Render the manager subviews.
			View.subViewRender();

			// Call the View's ready method.
			View.ready();
		});
	};

	/**
	 * The nav item view for each section.
	 *
	 * @since 0.1.0
	 * @var {Backbone}
	 */
	Nav.View = Backbone.View.extend({

		template: api.template.nav,

		// Wrapper element for the nav item.
		tagName: 'li',

		// Custom events.
		events: {
			'click a': 'onSelect'
		},

		// Sets some custom attributes for the nav item wrapper.
		attributes: function () {
			return {
				'aria-selected': this.model.get('selected')
			};
		},

		// Initializes the nav item view.
		initialize: function () {

			this.model.on('change', this.render, this);
			this.model.on('change', this.onChange, this);
		},

		// Renders the nav item.
		render: function () {

			// Only render template if model is active.
			if (this.model.get('active')) {
				this.el.innerHTML = this.template(this.model.toJSON());
			}

			return this;
		},

		// Executed when the section model changes.
		onChange: function () {

			// Set the `aria-selected` attibute based on the model selected state.
			this.el.setAttribute('aria-selected', this.model.get('selected'));
		},

		// Executed when the link for the nav item is clicked.
		onSelect: function (event) {
			event.preventDefault();

			// Loop through each of the models in the collection and set them to inactive.
			_.each(this.model.collection.models, function (m) {
				m.set('selected', false);
			}, this);

			// Set this view's model to selected.
			this.model.set('selected', true);
		}
	});

	/**
	 * The default manager view.  Other views can extend this using the
	 * `nineCodesMetabox.views.registerManager()` function.
	 *
	 * @since  0.1.0
	 * @var    object
	 */
	api.metabox.manager['default'] = Backbone.View.extend({

		// Wrapper element for the manager view.
		tagName: 'div',

		sections: new Section.Collection(),

		// Adds some custom attributes to the wrapper.
		attributes: function () {
			return {
				'id': 'ninecodes-metabox-manager-' + this.model.get('name'),
				'class': 'ninecodes-metabox-manager ninecodes-metabox-manager-' + this.model.get('type')
			};
		},

		// Initializes the view.
		initialize: function () {

			var type = this.model.get('type');

			// If there's not yet a template for this manager type, create it.
			if (!api.template.managerExists(type)) {
				api.template.registerManager(type);
			}

			// Get the manager template.
			this.template = api.template.getManager(type);
		},

		// Renders the manager.
		render: function () {
			this.el.innerHTML = this.template(this.model.toJSON());
			return this;
		},

		/**
		 * Renders the manager's sections and controls.
		 *
		 * Important! This may change drastically in the future, possibly even
		 * taken out of the manager view altogether.  It's for this reason that
		 * it's not recommended to create custom views for managers right now.
		 *
		 * @since 0.1.0
		 *
		 * @returns {Void} Returns nothing.
		 */
		subViewRender: function () {

			var self = this;

			// Loop through each section and add it to the collection.
			_.each(this.model.get('sections'), function (data) {
				self.sections.add(new Section.Model(data));
			});

			// Loop through each section in the collection and render its view.
			_.each(self.sections.models, function (SectionModel, index) {

				var SectionNav = new Nav.View({
						model: SectionModel
					}),

					// Get the section view.
					SectionCallback = api.metabox.getSection(SectionModel.attributes.type),

					// Create a new section view.
					SectionView = new SectionCallback({
						model: SectionModel
					}),

					$metaboxManager = $('#ninecodes-metabox-ui-' + SectionModel.get('manager')),
					$metaboxNav = $metaboxManager.find('.ninecodes-metabox-nav'),
					$metaboxContent = $metaboxManager.find('.ninecodes-metabox-content');

				$metaboxNav.append(SectionNav.render().el); // Render the nav item view.
				$metaboxContent.append(SectionView.render().el); // Render the Section view.

				SectionView.ready(); // Call the Section view's ready method.
				SectionModel.set('selected', 0 === index); // If the first model, set it to selected.
			});

			// Loop through each control for the manager and render its view.
			_.each(this.model.get('controls'), function (control) {

				var ControlModel = new Control.Model(control),

					// Get the control view callback.
					ControlCallback = api.metabox.getControl(control.type),

					// Create a new control view.
					ControlView = new ControlCallback({
						model: ControlModel
					}),

					$metaboxSection = $('#ninecodes-metabox-' + ControlModel.get('manager') + '-section-' + ControlModel.get('section'));

				$metaboxSection.append(ControlView.render().el); // Render the control view.

				ControlView.ready();
			});

			return this;
		},

		/**
		 * Function that is executed *after* the view has been rendered.
		 * This is meant to be overwritten in sub-views.
		 *
		 * @since 0.1.0
		 *
		 * @returns {Void|Mixed} Returns nothing or it depends on the Subviews.
		 */
		ready: function () {}
	});

	/**
	 * The default section view.  Other views can extend this using the
	 * `nineCodesMetabox.views.registerSection()` function.
	 *
	 * @since  0.1.0
	 * @var    object
	 */
	api.metabox.section['default'] = Backbone.View.extend({

		model: new Section.Model(),

		/**
		 * Custom attributes for the control wrapper.
		 *
		 * @returns {Object} List of attributes to add in the View.
		 */
		attributes: function () {
			return {
				'id': 'ninecodes-metabox-' + this.model.get('manager') + '-section-' + this.model.get('name'),
				'class': 'ninecodes-metabox-section ninecodes-metabox-section-' + this.model.get('type'),
				'aria-hidden': !this.model.get('selected')
			};
		},

		/**
		 * Initiazlies the Section view.
		 *
		 * @since 0.1.0
		 *
		 * @returns {Void} Returns nothing.
		 */
		initialize: function () {

			var type = this.model.get('type');

			if (!api.template.sectionExists(type)) {
				api.template.registerSection(type);
			}

			this.template = api.template.getSection(type);
			this.model.on('change', this.onChange, this);
		},

		/**
		 * Renders the Section
		 *
		 * @returns {Object} api.metabox.section
		 */
		render: function () {

			if (this.model.get('active')) {
				this.el.innerHTML = this.template(this.model.toJSON());
			}

			return this;
		},

		/**
		 * Executed when the model changes
		 *
		 * @since 0.1.0
		 *
		 * @return {Void} Returns nothing.
		 */
		onChange: function () {

			/**
			 * Set the view's `aria-hidden` attribute based on
			 * whether the model is selected.
			 */
			this.el.setAttribute('aria-hidden', !this.model.get('selected'));
		},

		/**
		 * Function that is executed *after* the view has been rendered.
		 * This is meant to be overwritten in sub-views.
		 *
		 * @since 0.1.0
		 *
		 * @returns {Void|Mixed} Returns nothing or it depends on the Subviews.
		 */
		ready: function () {}
	});

	/**
	 * The Default Control
	 *
	 * Other views can extend this using the `nineCodesMetabox.View.registerControl()` function.
	 *
	 * @since  0.1.0
	 * @var    object
	 */
	api.metabox.control['default'] = Backbone.View.extend({

		/**
		 * Custom attributes for the control wrapper.
		 *
		 * @returns {Object} List of attributes to add in the View.
		 */
		attributes: function () {
			return {
				'id': 'ninecodes-metabox-control-' + this.model.get('name'),
				'class': 'ninecodes-metabox-control ninecodes-metabox-control-' + this.model.get('type')
			};
		},

		/**
		 * Initiazlies the Control view.
		 *
		 * @since 0.1.0
		 *
		 * @returns {Void} Returns nothing.
		 */
		initialize: function () {

			var type = this.model.get('type');

			// Only add a new Control template if we have a different Control type.
			if (!api.template.controlExists(type)) {
				api.template.registerControl(type);
			}

			// Bind changes so that the view is re-rendered when the Model changes.
			_.bindAll(this, 'render', 'ready');

			this.template = api.template.getControl(type);

			this.model.bind('change', this.render);
		},

		/**
		 * Renders the Control template.
		 *
		 * @since 0.1.0
		 *
		 * @returns {Object} api.metabox.control
		 */
		render: function () {

			// Only render template if the Model is active.
			if (this.model.get('active')) {
				this.el.innerHTML = this.template(this.model.toJSON());
			}

			return this;
		},

		/**
		 * Function that is executed *after* the view has been rendered.
		 * This is meant to be overwritten in sub-views.
		 *
		 * @since 0.1.0
		 *
		 * @returns {Void|Mixed} Returns nothing or it depends on the Subviews.
		 */
		ready: function () {}
	});
})(jQuery);
