<?php
/**
 * Setting class for storing a single meta value as an array
 *
 * @package Metabox\Setting
 */

namespace NineCodes\Metabox;

/**
 * Array setting class.
 *
 * @since  0.1.0
 * @access public
 */
class Setting_Array extends Setting {

	/**
	 * The type of setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'array';

	/**
	 * Sanitizes the value of the setting.
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param array $values Unsanitized values.
	 * @return array
	 */
	public function sanitize( $values ) {

		$multi_values = $values && ! is_array( $values ) ? explode( ',', $values ) : $values;

		return $multi_values ? array_map( array( $this, 'map' ), $multi_values ) : array();
	}

	/**
	 * Helper function for sanitizing each value of the array.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param mixed $value Unsantized value.
	 * @return mixed
	 */
	public function map( $value ) {

		return apply_filters( "ninecodes_metabox_{$this->metabox->name}_sanitize_{$this->name}", $value, $this );
	}

	/**
	 * Saves the value of the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return void
	 */
	public function save() {

		if ( ! $this->check_capabilities() ) {
			return;
		}

		$old_values = $this->get_value();
		$new_values = $this->get_posted_value();

		// If there's an array of posted values, set them.
		if ( $new_values && is_array( $new_values ) && $new_values !== $old_values ) {
			return update_post_meta( $this->metabox->post_id, $this->name, $new_values );
		} // End if().
		elseif ( $old_values && ! $new_values ) {
			return delete_post_meta( $this->metabox->post_id, $this->name );
		}
	}
}
