<?php
/**
 * Base setting class for the fields metabox
 *
 * @package Metabox
 */

namespace NineCodes\Metabox;

/**
 * Base setting class.
 *
 * @since  0.1.0
 * @access public
 */
class Setting {

	/**
	 * The type of setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'default';

	/**
	 * Stores the metabox object.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    object
	 */
	public $metabox;

	/**
	 * Name/ID of the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $name = '';

	/**
	 * Value of the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $value = '';

	/**
	 * Default value of the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $default = '';

	/**
	 * Sanitization/Validation callback function.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $sanitize_callback = '';

	/**
	 * A user role capability required to save the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string|array
	 */
	public $capability = '';

	/**
	 * A feature that the current post type must support to save the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $post_type_supports = '';

	/**
	 * A feature that the current theme must support to save the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string|array
	 */
	public $theme_supports = '';

	/**
	 * Creates a new setting object
	 *
	 * @since 0.1.0
	 * @access public
	 * @param Metabox $metabox The Metabox object.
	 * @param string  $name The setting name.
	 * @param array   $args The setting arguments.
	 * @return void
	 */
	public function __construct( $metabox, $name, $args = array() ) {

		foreach ( array_keys( get_object_vars( $this ) ) as $key ) {

			if ( isset( $args[ $key ] ) ) {
				$this->$key = $args[ $key ];
			}
		}

		$this->metabox = $metabox;
		$this->name = $name;

		if ( $this->sanitize_callback ) {
			add_filter( "ninecodes_metabox_{$this->metabox->name}_sanitize_{$this->name}", $this->sanitize_callback, 10, 2 );
		}
	}

	/**
	 * Gets the value of the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return mixed
	 */
	public function get_value() {

		$value = get_post_meta( $this->metabox->post_id, $this->name, true );

		return ! $value && ninecodes_metabox()->is_new_post ? $this->default : $value;
	}

	/**
	 * Gets the posted value of the setting.
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @return mixed
	 */
	public function get_posted_value() {

		$value = '';

		if ( isset( $_POST[ $this->get_field_name() ] ) &&
			wp_verify_nonce( $_POST[ "ninecodes_metabox_{$this->metabox->name}" ], "ninecodes_metabox_{$this->metabox->name}_nonce" ) ) {
			$value = $_POST[ $this->get_field_name() ];
		}

		return $this->sanitize( $value );
	}

	/**
	 * Retuns the correct field name for the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 *
	 * @return string
	 */
	public function get_field_name() {
		return "ninecodes_metabox_{$this->metabox->name}_setting_{$this->name}";
	}

	/**
	 * Sanitizes the value of the setting
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param mixed $value Unsanitized value.
	 * @return mixed
	 */
	public function sanitize( $value ) {
		return apply_filters( "ninecodes_metabox_{$this->metabox->name}_sanitize_{$this->name}", $value, $this );
	}

	/**
	 * Saves the value of the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 *
	 * @return void
	 */
	public function save() {

		if ( ! $this->check_capabilities() ) {
			return;
		}

		$old_value = $this->get_value();
		$new_value = $this->get_posted_value();

		// If we have don't have a new value but do have an old one, delete it.
		if ( ! $new_value && $old_value ) {
			delete_post_meta( $this->metabox->post_id, $this->name );
		} elseif ( $new_value !== $old_value ) {
			update_post_meta( $this->metabox->post_id, $this->name, $new_value );
		}
	}

	/**
	 * Checks if the setting should be saved at all.
	 *
	 * @since 0.1.0
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
}
