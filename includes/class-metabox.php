<?php
/**
 * Base class for handling managers.  Managers are groups of sections, which are groups of
 * controls + settings.  Managers are output as a metabox.  This essentially allows
 * developers to output multiple post meta fields within a single metabox.
 *
 * @package NineCodes\Metabox
 */

namespace NineCodes\Metabox;

/**
 * Base metabox class.
 *
 * @since  0.1.0
 * @access public
 */
class Metabox {

	/**
	 * The type of metabox.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'default';

	/**
	 * Name of this instance of the metabox.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $name = '';

	/**
	 * Label for the metabox.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $label = '';

	/**
	 * Post type this metabox is used on.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string|array
	 */
	public $post_type = 'post';

	/**
	 * Location of the meta box.  Accepted values: 'normal', 'advanced', 'side'.
	 *
	 * @link https://developer.wordpress.org/reference/functions/add_meta_box/
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $context = 'advanced';

	/**
	 * Priority of the meta box. Accepted values: 'high', 'core', 'default', 'low'.
	 *
	 * @link https://developer.wordpress.org/reference/functions/add_meta_box/
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $priority = 'default';

	/**
	 * Array of sections.
	 *
	 * @since 0.1.0
	 * @access public
	 * @var array
	 */
	public $sections = array();

	/**
	 * Array of controls.
	 *
	 * @since 0.1.0
	 * @access public
	 * @var array
	 */
	public $controls = array();

	/**
	 * Array of settings
	 *
	 * @since 0.1.0
	 * @access public
	 * @var array
	 */
	public $settings = array();

	/**
	 * A user role capability required to show the metabox
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string|array
	 */
	public $capability = '';

	/**
	 * A feature that the current post type must support to show the metabox
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $post_type_supports = '';

	/**
	 * A feature that the current theme must support to show the metabox
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string|array
	 */
	public $theme_supports = '';

	/**
	 * Stores the JSON data for the metabox
	 *
	 * @since  0.1.0
	 * @access public
	 * @var array
	 */
	public $json = array();

	/**
	 * ID of the post that's being edited
	 *
	 * @since 0.1.0
	 * @access public
	 * @var int
	 */
	public $post_id = 0;

	/**
	 * Sets up the metabox
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $name The metabox name.
	 * @param array  $args The metabox arguments.
	 * @return void
	 */
	public function __construct( $name, $args = array() ) {

		foreach ( array_keys( get_object_vars( $this ) ) as $key ) {

			if ( isset( $args[ $key ] ) ) {
				$this->$key = $args[ $key ];
			}
		}

		// Make sure the post type is an array.
		$this->post_type = (array) $this->post_type;

		// Set the metabox name.
		$this->name = sanitize_key( $name );
	}

	/**
	 * Enqueue scripts/styles for the metabox.
	 *
	 * @since  0.1.0
	 * @access public
	 *
	 * @return void
	 */
	public function enqueue() {}

	/**
	 * Register a section.
	 *
	 * @since  0.1.0
	 * @access public
	 *
	 * @param  object|string $section The section name or Object.
	 * @param  array         $args The section arguments.
	 * @return void
	 */
	public function register_section( $section, $args = array() ) {

		if ( ! is_object( $section ) ) {

			$type = isset( $args['type'] ) ? ninecodes_metabox()->get_section_type( $args['type'] ) : ninecodes_metabox()->get_section_type( 'default' );
			$type = __NAMESPACE__ . '\\' . $type;

			$section = new $type( $this, $section, $args );
		}

		if ( ! $this->section_exists( $section->name ) ) {
			$this->sections[ $section->name ] = $section;
		}
	}

	/**
	 * Register a control.
	 *
	 * @since  0.1.0
	 * @access public
	 *
	 * @param  object|string $control The control name or Object.
	 * @param  array         $args The control arguments.
	 * @return void
	 */
	public function register_control( $control, $args = array() ) {

		if ( ! is_object( $control ) ) {

			$type = isset( $args['type'] ) ? ninecodes_metabox()->get_control_type( $args['type'] ) : ninecodes_metabox()->get_control_type( 'default' );

			$control = new $type( $this, $control, $args );
		}

		if ( ! $this->control_exists( $control->name ) ) {
			$this->controls[ $control->name ] = $control;
		}
	}

	/**
	 * Register a setting.
	 *
	 * @since  0.1.0
	 * @access public
	 *
	 * @param  object|string $setting The setting name or Object.
	 * @param  array         $args The setting arguments.
	 * @return void
	 */
	public function register_setting( $setting, $args = array() ) {

		if ( ! is_object( $setting ) ) {

			$type = isset( $args['type'] ) ? ninecodes_metabox()->get_setting_type( $args['type'] ) : ninecodes_metabox()->get_setting_type( 'default' );

			$setting = new $type( $this, $setting, $args );
		}

		if ( ! $this->setting_exists( $setting->name ) ) {
			$this->settings[ $setting->name ] = $setting;
		}
	}

	/**
	 * Register a control and setting object.
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string       $name The field / control name.
	 * @param object|array $control Control object or array of control arguments.
	 * @param object|array $setting Setting object or array of setting arguments.
	 * @return void
	 */
	public function register_field( $name, $control, $setting ) {

		is_object( $control ) ? $this->register_control( $control ) : $this->register_control( $name, $control );
		is_object( $setting ) ? $this->register_setting( $setting ) : $this->register_setting( $name, $setting );
	}

	/**
	 * Unregisters a section object
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The section name.
	 * @return void
	 */
	public function unregister_section( $name ) {

		if ( $this->section_exists( $name ) ) {
			unset( $this->sections[ $name ] );
		}
	}

	/**
	 * Unregisters a control object.
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The control name.
	 * @return void
	 */
	public function unregister_control( $name ) {

		if ( $this->control_exists( $name ) ) {
			unset( $this->controls[ $name ] );
		}
	}

	/**
	 * Unregisters a setting object.
	 *
	 * @since  0.1.0
	 * @access public
	 *
	 * @param  string $name The setting name.
	 * @return void
	 */
	public function unregister_setting( $name ) {

		if ( $this->setting_exists( $name ) ) {
			unset( $this->settings[ $name ] );
		}
	}

	/**
	 * Unregisters a control and setting object
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The field / control name.
	 * @return void
	 */
	public function unregister_field( $name ) {

		$this->unregister_control( $name );
		$this->unregister_setting( $name );
	}

	/**
	 * Returns a section object
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The section name.
	 * @return object|bool
	 */
	public function get_section( $name ) {

		return $this->section_exists( $name ) ? $this->sections[ $name ] : false;
	}

	/**
	 * Returns a control object
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The control name.
	 * @return object|bool
	 */
	public function get_control( $name ) {
		return $this->control_exists( $name ) ? $this->controls[ $name ] : false;
	}

	/**
	 * Returns a setting object
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The setting name.
	 * @return object|bool
	 */
	public function get_setting( $name ) {
		return $this->setting_exists( $name ) ? $this->settings[ $name ] : false;
	}

	/**
	 * Returns an object that contains both the control and setting objects
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The setting name.
	 * @return object|bool
	 */
	public function get_field( $name ) {

		$control = $this->get_control( $name );
		$setting = $this->get_setting( $name );

		$field = array(
			'name' => $name,
			'control' => $control,
			'setting' => $setting,
		);

		return $control && $setting ? (object) $field : false;
	}

	/**
	 * Checks if a section exists
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The section name.
	 * @return bool
	 */
	public function section_exists( $name ) {
		return isset( $this->sections[ $name ] );
	}

	/**
	 * Checks if a control exists
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The control name.
	 * @return bool
	 */
	public function control_exists( $name ) {
		return isset( $this->controls[ $name ] );
	}

	/**
	 * Checks if a setting exists
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param string $name The section name.
	 * @return bool
	 */
	public function setting_exists( $name ) {
		return isset( $this->settings[ $name ] );
	}

	/**
	 * Checks if a both a control and setting exist
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $name The setting and control name.
	 * @return bool
	 */
	public function field_exists( $name ) {
		return $this->control_exists( $name ) && $this->setting_exists( $name );
	}

	/**
	 * Returns the json array
	 *
	 * @since  0.1.0
	 * @access public
	 * @return array
	 */
	public function get_json() {
		$this->to_json();

		return $this->json;
	}

	/**
	 * Adds custom data to the JSON array. This data is passed to the Underscore template.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return void
	 */
	public function to_json() {

		$sections_with_controls = array();
		$blocked_sections       = array();

		$this->json['name'] = $this->name;
		$this->json['type'] = $this->type;

		// Get all sections that have controls.
		foreach ( $this->controls as $control ) {
			$sections_with_controls[] = $control->section;
		}

		$sections_with_controls = array_unique( $sections_with_controls );

		// Get the JSON data for each section.
		foreach ( $this->sections as $section ) {

			$caps = $section->check_capabilities();

			if ( $caps && in_array( $section->name, $sections_with_controls, true ) ) {
				$this->json['sections'][] = $section->get_json();
			}

			if ( ! $caps ) {
				$blocked_sections[] = $section->name;
			}
		}

		// Get the JSON data for each control.
		foreach ( $this->controls as $control ) {

			if ( $control->check_capabilities() && ! in_array( $control->section, $blocked_sections, true ) ) {
				$this->json['controls'][] = $control->get_json();
			}
		}
	}

	/**
	 * Saves each of the settings for the metabox
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param mixed $post_id The Post ID.
	 * @return void
	 */
	public function save( $post_id ) {

		if ( ! $this->post_id ) {
			$this->post_id = $post_id;
		}

		// Verify the nonce for this metabox.
		if ( ! isset( $_POST[ "ninecodes_metabox_{$this->name}" ] ) || ! wp_verify_nonce( $_POST[ "ninecodes_metabox_{$this->name}" ], "ninecodes_metabox_{$this->name}_nonce" ) ) {
			return;
		}

		// Loop through each setting and save it.
		foreach ( $this->settings as $setting ) {
			$setting->save();
		}
	}

	/**
	 * Checks if the control should be allowed at all.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return bool
	 */
	public function check_capabilities() {

		if ( $this->capability && ! call_user_func_array( 'current_user_can', (array) $this->capability ) ) {
			return false;
		}

		if ( $this->post_type_supports && ! call_user_func_array( 'post_type_supports', array( get_post_type( $this->metabox->post_id ), $this->post_type_supports ) ) ) {
			return false;
		}

		if ( $this->theme_supports && ! call_user_func_array( 'theme_supports', (array) $this->theme_supports ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Prints Underscore.js template.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return void
	 */
	public function print_template() {
	?>
	<script type="text/html" id="tmpl-ninecodes-metabox-<?php echo esc_attr( $this->type ); ?>">
		<?php $this->get_template(); ?>
	</script>
	<?php }

	/**
	 * Gets the Underscore.js template.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return void
	 */
	public function get_template() {
		get_manager_template( $this->type );
	}
}
