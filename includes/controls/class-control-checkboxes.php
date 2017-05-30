<?php
/**
 * Multiple checkbox control class.  This is for array-type settings, so you'll need
 * to utilize a setting type that handles arrays.  Both the `array` and `multiple`
 * setting types will do this.
 *
 * @package Metabox\Control
 */

namespace NineCodes\Metabox;

/**
 * Multiple checkboxes control class.
 *
 * @since  0.1.0
 * @access public
 */
class Control_CheckBoxes extends Control {

	/**
	 * The type of control.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'checkboxes';

	/**
	 * Adds custom data to the json array. This data is passed to the Underscore template.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return void
	 */
	public function to_json() {
		parent::to_json();

		$this->json['value'] = (array) $this->get_value();
	}
}
