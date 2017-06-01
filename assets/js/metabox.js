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
	var api = {
			template: {
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
					metabox: '',
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
					metabox: '',
					section: '',
					setting: ''
				}
			}),
		},

		Nav = {
			View: Backbone.View.extend({

				template: api.template.nav,

				tagName: 'li',

				events: {
					'click a': 'onSelect'
				},

				/**
				 * Custom attributes for the control wrapper.
				 *
				 * @since 0.1.0
				 *
				 * @returns {Object} List of attributes to add in the View.
				 */
				attributes: function () {
					return {
						'aria-selected': this.model.get('selected')
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

					this.model.on('change', this.render, this);
					this.model.on('change', this.onChange, this);
				},

				/**
				 * Renders the Section
				 *
				 * @returns {Object} section
				 */
				render: function () {

					if (this.model.get('active')) {
						this.el.innerHTML = this.template(this.model.toJSON());
					}

					return this;
				},

				onChange: function () {
					this.el.setAttribute('aria-selected', this.model.get('selected'));
				},

				onSelect: function (event) {
					event.preventDefault();

					_.each(this.model.collection.models, function (model) {
						model.set('selected', false);
					}, this);

					this.model.set('selected', true);
				}
			})
		};

	/**
	 * Houses the metabox, section, and control views based on the `type`.
	 *
	 * @since 0.1.0
	 * @var {Object}
	 */
	api = {

		metabox: [],
		section: [],
		control: [],

		/**
		 * Creates a new Manager view
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Manager type.
		 * @param {Object} args Manager arguments.
		 * @return {Void} Returns nothing.
		 */
		registerManager: function (type, args) {

			if ('default' !== type) {
				this.metabox[type] = this.metabox.default.extend(args);
			}
		},

		/**
		 * Returns a Manager view
		 *

		* @since 0.1.0
		*
		* @param {String} type Manager type.
		* @return {Object} The Manager instance.
		*/
		getManager: function (type) {

			if (this.managerExists(type)) {
				return this.metabox[type];
			}

			return this.metabox.default;
		},

		/**
		 * Removes a metabox view.
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Manager type.
		 * @return {Void} Returns nothing.
		 */
		unregisterManager: function (type) {

			if ('default' !== type && this.managerExists(type)) {
				delete this.metabox[type];
			}
		},

		/**
		 * Checks if a Manager view exists
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Manager type.
		 * @return {Boolean} Returns `true` if the Manager of the given type exists.
		 */
		managerExists: function (type) {

			return this.metabox.hasOwnProperty(type);
		},

		/**
		 * Creates a new Section view
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type The new Section type to register.
		 * @param {Object} args The Section arguments.
		 * @return {Void} Returns nothing.
		 */
		registerSection: function (type, args) {

			if ('default' !== type) {
				this.section[type] = this.section.default.extend(args);
			}
		},

		/**
		 * Returns a Section view
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Section type.
		 * @return {Object} Section instance.
		 */
		getSection: function (type) {

			if (this.sectionExists(type)) {
				return this.section[type];
			}

			return this.section.default;
		},

		/**
		 * Removes a Section view
		 *
		 * @since  0.1.0
		 *
		 * @param {String} type Section type.
		 * @return {Void} Returns nothing.
		 */
		unregisterSection: function (type) {

			if ('default' !== type && this.sectionExists(type)) {
				delete this.section[type];
			}
		},

		/**
		 * Checks if a Section view exists
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Section type.
		 * @return {Boolean} Returns `true` if the Section exists.
		 */
		sectionExists: function (type) {
			return this.section.hasOwnProperty(type);
		},

		/**
		 * Creates a new Control view
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type A new Control type to register.
		 * @param {Object} args Control arguments.
		 * @return {Void} Returns nothing.
		 */
		registerControl: function (type, args) {

			if ('default' !== type) {
				this.control[type] = this.control.default.extend(args);
			}
		},

		/**
		 * Returns a Control view
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Control type.
		 * @return {Object} Control instance.
		 */
		getControl: function (type) {

			if (this.controlExists(type)) {
				return this.control[type];
			}

			return this.control.default;
		},

		/**
		 * Removes a Control view
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Control type.
		 * @return {Void} Returns nothing.
		 */
		unregisterControl: function (type) {

			if ('default' !== type && this.controlExists(type)) {
				delete this.control[type];
			}
		},

		/**
		 * Checks if a Control view exists
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Control type.
		 * @return {Boolean} Returns `true` if the Control of the given type exists.
		 */
		controlExists: function (type) {

			return this.control.hasOwnProperty(type);
		},
	};

	/**
	 * Houses the metabox, section, and control templates based on the `type`.
	 *
	 * @since  0.1.0
	 * @var {Object}
	 */
	api.template = {

		metabox: [],
		section: [],
		control: [],

		/**
		 * Creates a new Manager template
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Manager type.
		 * @return {Void} Returns nothing.
		 */
		registerManager: function (type) {

			this.metabox[type] = wp.template('ninecodes-metabox-' + type);
		},

		/**
		 * Returns a Manager template
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Manager type.
		 * @return {Function} A function that lazily-compiles the template requested.
		 */
		getManager: function (type) {

			return this.managerExists(type) ? this.metabox[type] : false;
		},

		/**
		 * Removes a metabox template
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Manager type.
		 * @return {Void} Returns nothing.
		 */
		unregisterManager: function (type) {

			if (this.managerExists(type)) {
				delete this.metabox[type];
			}
		},

		/**
		 * Checks if a Manager template exists
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Manager type.
		 * @return {Boolean} Returns true if the Manager template of the given type exists.
		 */
		managerExists: function (type) {

			return this.metabox.hasOwnProperty(type);
		},

		/**
		 * Creates a new Section template
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Section type.
		 * @return {Void} Returns nothing.
		 */
		registerSection: function (type) {

			this.section[type] = wp.template('ninecodes-metabox-section-' + type);
		},

		/**
		 * Returns a Section template
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Manager type.
		 * @return {Function} A function that lazily-compiles the template requested.
		 */
		getSection: function (type) {

			return this.sectionExists(type) ? this.section[type] : false;
		},

		/**
		 * Removes a Section template
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Section type
		 * @return {Void} Returns nothing.
		 */
		unregisterSection: function (type) {

			if (this.sectionExists(type)) {
				delete this.section[type];
			}
		},

		/**
		 * Checks if a Section template exists
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Section type.
		 * @return {Boolean} Returns `true` if the Section template of the given type exists.
		 */
		sectionExists: function (type) {

			return this.section.hasOwnProperty(type);
		},

		/**
		 * Creates a new Control template
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Control type.
		 * @return {Void} Returns nothing.
		 */
		registerControl: function (type) {

			this.control[type] = wp.template('ninecodes-metabox-control-' + type);
		},

		/**
		 * Returns a Control template
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Control type.
		 * @return {Function} A function that lazily-compiles the template requested.
		 */
		getControl: function (type) {

			return this.controlExists(type) ? this.control[type] : false;
		},

		/**
		 * Removes a control template.
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Control type.
		 * @return {Void} Returns nothing.
		 */
		unregisterControl: function (type) {

			if (this.controlExists(type)) {
				delete this.control[type];
			}
		},

		/**
		 * Checks if a Control template exists.
		 *
		 * @since 0.1.0
		 *
		 * @param {String} type Control type.
		 * @return {Boolean} Returns `true` if the Control template of the given type exists.
		 */
		controlExists: function (type) {

			return this.control.hasOwnProperty(type);
		},
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

			var ManagerCallback = api.getManager(data.type),

				ManagerModel = new Manager.Model(data),
				ManagerView = new ManagerCallback({
					model: ManagerModel
				});

			// Add the `.ninecodes-metabox-ui` class to the meta box.
			$('#ninecodes-metabox-ui-' + ManagerModel.get('name'))
				.addClass('ninecodes-metabox-ui')
				.find('.inside')
				.append(ManagerView.render().el);

			ManagerView.subViewRender();
			ManagerView.ready();
		});
	};

	/**
	 * The default metabox view.  Other views can extend this using the
	 * `nineCodesMetabox.views.registerManager()` function.
	 *
	 * @since  0.1.0
	 * @var    object
	 */
	api.metabox['default'] = Backbone.View.extend({

		sections: new Section.Collection(),

		/**
		 * Custom attributes for the control wrapper.
		 *
		 * @returns {Object} List of attributes to add in the View.
		 */
		attributes: function () {
			return {
				'id': 'ninecodes-metabox-' + this.model.get('name'),
				'class': 'ninecodes-metabox ninecodes-metabox-' + this.model.get('type')
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

			// If there's not yet a template for this metabox type, create it.
			if (!api.template.managerExists(type)) {
				api.template.registerManager(type);
			}

			this.template = api.template.getManager(type);
		},

		/**
		 * Renders the Section
		 *
		 * @returns {Object} api.section
		 */
		render: function () {
			this.el.innerHTML = this.template(this.model.toJSON());
			return this;
		},

		/**
		 * Renders the metabox's sections and controls.
		 *
		 * Important! This may change drastically in the future, possibly even
		 * taken out of the metabox view altogether.  It's for this reason that
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

				var SectionCallback = api.getSection(SectionModel.attributes.type),

					SectionView = new SectionCallback({
						model: SectionModel
					}),
					SectionNav = new Nav.View({
						model: SectionModel
					}),

					$metaboxManager = $('#ninecodes-metabox-ui-' + SectionModel.get('metabox')),
					$metaboxNav = $metaboxManager.find('.ninecodes-metabox-nav'),
					$metaboxContent = $metaboxManager.find('.ninecodes-metabox-content');

				$metaboxNav.append(SectionNav.render().el); // Render the nav item view.
				$metaboxContent.append(SectionView.render().el); // Render the Section view.

				SectionView.ready(); // Call the Section view's ready method.
				SectionModel.set('selected', 0 === index); // If the first model, set it to selected.
			});

			// Loop through each control for the metabox and render its view.
			_.each(this.model.get('controls'), function (control) {

				var ControlCallback = api.getControl(control.type),
					ControlModel = new Control.Model(control),
					ControlView = new ControlCallback({
						model: ControlModel
					}),

					$metaboxSection = $('#ninecodes-metabox-' + ControlModel.get('metabox') + '-section-' + ControlModel.get('section'));

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
	 * The default section view. Other views can extend this using the
	 * `nineCodesMetabox.views.registerSection()` function.
	 *
	 * @since  0.1.0
	 * @var    object
	 */
	api.section['default'] = Backbone.View.extend({

		model: new Section.Model(),

		/**
		 * Custom attributes for the control wrapper.
		 *
		 * @returns {Object} List of attributes to add in the View.
		 */
		attributes: function () {
			return {
				'id': 'ninecodes-metabox-' + this.model.get('metabox') + '-section-' + this.model.get('name'),
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
		 * @returns {Object} api.section
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
	api.control['default'] = Backbone.View.extend({

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
		 * @returns {Object} control
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

	// Merge the api Object to window.nineCodesMetabox.
	_.extend( nineCodesMetabox, api );

})(jQuery);
