<?php
/**
 * Radio control class that creates a list of radio inputs to choose from.
 *
 * @package Metabox\Control
 */

namespace NineCodes\Metabox;

/**
 * Radio control class.
 *
 * @since  0.1.0
 * @access public
 */
class Control_Radio extends Control {

	/**
	 * The type of control.
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $type = 'radio';

	/**
	 * Radio controls imply that a value should be set.  Therefore, we will return
	 * the default if there is no value.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param string $setting The setting name.
	 * @return mixed
	 */
	public function get_value( $setting = 'default' ) {

		$value  = parent::get_value( $setting );
		$object = $this->get_setting( $setting );

		return ! $value && $object ? $object->default : $value;
	}
}
