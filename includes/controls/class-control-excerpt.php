<?php
/**
 * Excerpt control class.  Note that this control isn't meant to be tied to a setting.  Core
 * WP will save the excerpt.  Also, make sure to disable the core excerpt metabox if using
 * this control.
 *
 * @package Metabox
 */

namespace NineCodes\Metabox;

/**
 * Excerpt control class.
 *
 * @since  0.1.0
 * @access public
 */
class Control_Excerpt extends Control_Textarea {

	/**
	 * The type of control.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'excerpt';

	/**
	 * Gets the attributes for the control.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return array
	 */
	public function get_attr() {
		$attr = parent::get_attr();

		$attr['id'] = 'post_excerpt';

		return $attr;
	}

	/**
	 * Returns the HTML field name for the control.
	 *
	 * @since  0.1.0
	 * @access public
	 * @param  string $setting The setting name.
	 * @return string
	 */
	public function get_field_name( $setting = 'default' ) {
		return 'post_excerpt';
	}

	/**
	 * Get the value for the setting.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $setting The setting name.
	 * @return mixed
	 */
	public function get_value( $setting = 'default' ) {
		return get_post( $this->manager->post_id )->post_excerpt;
	}

	/**
	 * Gets the Underscore.js template.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return void
	 */
	public function get_template() {
		get_control_template( 'textarea' );
	}
}
