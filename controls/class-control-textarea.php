<?php
/**
 * Textarea control class.
 *
 * @package Metabox\Control
 */

namespace NineCodes\Metabox;

/**
 * Textarea control class.
 *
 * @since  0.1.0
 * @access public
 */
class Control_Textarea extends Control {

	/**
	 * The type of control.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'textarea';

	/**
	 * Adds custom data to the json array. This data is passed to the Underscore template.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return void
	 */
	public function to_json() {
		parent::to_json();
		$this->json['value'] = esc_textarea( $this->get_value() );
	}
}
