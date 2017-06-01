<?php
/**
 * Setting class for storing multiple post meta values for a single key
 *
 * @package Metabox\Setting
 */

namespace NineCodes\Metabox;

/**
 * Multiple setting class
 *
 * @since 0.1.0
 */
final class Setting_Multiple extends Setting {

	/**
	 * The type of setting
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $type = 'multiple';

	/**
	 * Gets the value of the setting
	 *
	 * @since 0.1.0
	 * @access public
	 * @return mixed
	 */
	public function get_value() {

		return get_post_meta( $this->metabox->post_id, $this->name );
	}

	/**
	 * Sanitizes the value of the setting
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
	 * Helper function for sanitizing each value of the array
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param mixed $value Unsanitized value.
	 * @return mixed
	 */
	public function map( $value ) {
		return apply_filters( "ninecodes_metabox_{$this->metabox->name}_sanitize_{$this->name}", $value, $this );
	}

	/**
	 * Saves the value of the setting
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
		if ( is_array( $new_values ) ) {
			$this->set_values( $new_values, $old_values );
		} // End if().
		elseif ( $old_values ) {
			$this->delete_values();
		}
	}

	/**
	 * Loops through new and old meta values and updates
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param array $new_values The new value.
	 * @param array $old_values The old value, obviously.
	 * @return void
	 */
	public function set_values( $new_values, $old_values ) {

		foreach ( $new_values as $new ) {

			if ( ! in_array( $new, $old_values, true ) ) {
				$this->add_value( $new );
			}
		}

		foreach ( $old_values as $old ) {

			if ( ! in_array( $old, $new_values, true ) ) {
				$this->remove_value( $old );
			}
		}
	}

	/**
	 * Deletes old meta values
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @return bool True on success, false on failure.
	 */
	public function delete_values() {
		return delete_post_meta( $this->metabox->post_id, $this->name );
	}

	/**
	 * Adds a single meta value
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param mixed $value The value to add in the post meta.
	 * @return bool True on success, false on failure.
	 */
	public function add_value( $value ) {
		return add_post_meta( $this->metabox->post_id, $this->name, $value, false );
	}

	/**
	 * Deletes a single meta value
	 *
	 * @since 0.1.0
	 * @access public
	 *
	 * @param mixed $value The value to add in the post meta.
	 * @return bool True on success, false on failure.
	 */
	public function remove_value( $value ) {
		return delete_post_meta( $this->metabox->post_id, $this->name, $value );
	}
}
