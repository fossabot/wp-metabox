<?php
/**
 * Serialized data and store it in a single row
 *
 * @package Metabox\Setting
 */

namespace NineCodes\Metabox;

/**
 * Serialize setting class
 *
 * @since 0.1.0
 */
final class Setting_Serialize extends Setting {

	/**
	 * The type of setting
	 *
	 * @since 0.1.0
	 * @access public
	 * @var string
	 */
	public $type = 'serialize';

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

		$values = $this->get_serialized_value();
		$values[ $this->name ] = $this->get_posted_value();

		if ( is_array( $values ) && ! empty( $values ) ) {
			return update_post_meta( $this->metabox->post_id, $this->metabox->name, $values );
		} elseif ( empty( $values ) ) {
			return delete_post_meta( $this->metabox->post_id, $this->metabox->name );
		}
	}

	/**
	 * Gets the value of the setting
	 *
	 * @since 0.1.0
	 * @access public
	 * @return mixed
	 */
	public function get_value() {

		$value = $this->get_serialized_value();

		if ( isset( $value[ $this->name ] ) ) {
			return $value[ $this->name ];
		}

		if ( ! isset( $value[ $this->name ] ) && ! ninecodes_metabox()->is_new_post ) {
			return $this->default;
		}

		if ( ninecodes_metabox()->is_new_post ) {
			return $this->default;
		}
	}

	/**
	 * Gets the serialized value of the setting
	 *
	 * @since 0.1.0
	 * @access public
	 * @return mixed
	 */
	public function get_serialized_value() {

		$value = get_post_meta( $this->metabox->post_id, $this->metabox->name, true );

		return ! $value || ninecodes_metabox()->is_new_post ? null : $value;
	}
}
