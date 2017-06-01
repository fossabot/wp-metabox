<?php
/**
 * Select group control class.  This works just like a normal select.  However, it
 * allows for `<optgroup>` to be added.
 *
 * @package Metabox\Control
 */

namespace NineCodes\Metabox;

/**
 * Select group control class.
 *
 * @since  0.1.0
 * @access public
 */
class Control_Select_Group extends Control {

	/**
	 * The type of control.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'select-group';

	/**
	 * Adds custom data to the json array.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return void
	 */
	public function to_json() {
		parent::to_json();

		$group = array();
		$choices = $group;

		foreach ( $this->choices as $choice => $maybe_group ) {

			if ( is_array( $maybe_group ) ) {
				$group[ $choice ] = $maybe_group;
			} else {
				$choices[ $choice ] = $maybe_group;
			}
		}

		$this->json['choices'] = $choices;
		$this->json['group']   = $group;
	}
}
