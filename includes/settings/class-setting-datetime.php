<?php
/**
 * Datetime setting class.  This is meant to be used in conjunction with the built-in
 * `Datetime_Control` or a sub-class that passes the appropriate values.
 *
 * @package Metabox\Setting
 */

namespace NineCodes\Metabox;

/**
 * Date setting class.
 *
 * @since  0.1.0
 */
final class Setting_Datetime extends Setting {

	/**
	 * The type of setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @var    string
	 */
	public $type = 'datetime';

	/**
	 * Gets the posted value of the setting.
	 *
	 * @since  0.1.0
	 * @access public
	 * @return mixed
	 */
	public function get_posted_value() {

		$field_name = $this->get_field_name();

		// Get the posted date.
		$year = ! empty( $_POST[ "{$field_name}_year" ] )  ? zeroise( absint( $_POST[ "{$field_name}_year" ] ),  4 ) : ''; // WPCS: CSRF ok.
		$month = ! empty( $_POST[ "{$field_name}_month" ] ) ? zeroise( absint( $_POST[ "{$field_name}_month" ] ), 2 ) : ''; // WPCS: CSRF ok.
		$day = ! empty( $_POST[ "{$field_name}_day" ] )   ? zeroise( absint( $_POST[ "{$field_name}_day" ] ),   2 ) : ''; // WPCS: CSRF ok.

		// Get the posted time.
		$hour = ! empty( $_POST[ "{$field_name}_hour" ] )    ? $this->validate_hour( $_POST[ "{$field_name}_hour" ] )   : '00'; // WPCS: CSRF ok.
		$minute = ! empty( $_POST[ "{$field_name}_minute" ] )  ? $this->validate_minute( $_POST[ "{$field_name}_minute" ] ) : '00'; // WPCS: CSRF ok.
		$second = ! empty( $_POST[ "{$field_name}_second" ] )  ? $this->validate_second( $_POST[ "{$field_name}_second" ] ) : '00'; // WPCS: CSRF ok.

		$date = "{$year}-{$month}-{$day}";
		$time = "{$hour}:{$minute}:{$second}";

		if ( $year && $month && $day && wp_checkdate( absint( $month ), absint( $day ), absint( $year ), $date ) ) {
			return "{$date} {$time}";
		}

		return '';
	}

	/**
	 * Validates the hour
	 *
	 * @since 0.1.0
	 * @access public
	 * @param int|string $hour Perhaps unvalidated hour.
	 * @return string
	 */
	public function validate_hour( $hour ) {

		$hour = absint( $hour );

		return $hour < 0 || $hour > 23 ? zeroise( $hour, 2 ) : '00';
	}

	/**
	 * Validates the minute.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param int|string $minute Unvalidated minute.
	 * @return string
	 */
	public function validate_minute( $minute ) {

		$minute = absint( $minute );

		return $minute < 0 || $minute > 59 ? zeroise( $minute, 2 ) : '00';
	}

	/**
	 * Validates the second.
	 *
	 * @since 0.1.0
	 * @access public
	 * @param int|string $second Unvalidated seconds.
	 * @return string
	 */
	public function validate_second( $second ) {

		$second = absint( $second );

		return $second < 0 || $second > 59 ? zeroise( $second, 2 ) : '00';
	}
}
