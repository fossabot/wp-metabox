<?php
/**
 * Radio image control class extends the built-in radio control.  This control is
 * meant for displaying an image instead of the radio fields.
 *
 * @package Metabox\Control
 */

namespace NineCodes\Metabox;

/**
 * Radio image control class.
 *
 * @since  0.1.0
 * @access public
 */
class Control_Radio_Image extends Control_Radio {

	/**
	 * The type of control.
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $type = 'radio-image';

	/**
	 * Adds custom data to the json array. This data is passed to the Underscore template.
	 *
	 * @since 0.1.0
	 * @access public
	 * @return void
	 */
	public function to_json() {
		parent::to_json();

		foreach ( $this->choices as $value => $args ) {
			$this->choices[ $value ]['url'] = esc_url( sprintf( $args['url'], get_template_directory_uri(), get_stylesheet_directory_uri() ) );
		}

		$this->json['choices'] = $this->choices;
	}
}
